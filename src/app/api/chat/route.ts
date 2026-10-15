import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

const UNAVAILABLE = "The study assistant is unavailable right now — try again shortly.";

function makeTitle(question: string) {
  const t = question.replace(/\s+/g, " ").trim();
  return t.length > 48 ? `${t.slice(0, 45).trimEnd()}…` : t;
}

// This route is the RAG boundary: it never lets the model see textbook
// content outside the asking profile's class/medium. It also keeps the
// student's chat history: every question and answer is saved to a
// conversation that belongs to that profile (RLS keeps it private).
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { profileId?: unknown; question?: unknown; conversationId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (typeof body.profileId !== "string" || typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const question = body.question.trim().slice(0, 2000);

  // Confirm the profile belongs to this account.
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", body.profileId)
    .eq("account_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Find the conversation, or start a new one. If saving isn't possible (for
  // example the chat-history SQL hasn't been run yet) we still answer, just
  // without saving — chat keeps working either way.
  let conversationId: string | null = null;
  let title: string | null = null;
  let isNew = false;

  if (typeof body.conversationId === "string") {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", body.conversationId)
      .eq("profile_id", profile.id)
      .single();
    if (existing) {
      conversationId = existing.id;
      title = existing.title;
    }
  }

  if (!conversationId) {
    const { data: created } = await supabase
      .from("conversations")
      .insert({ profile_id: profile.id, title: makeTitle(question) })
      .select("id, title")
      .single();
    if (created) {
      conversationId = created.id;
      title = created.title;
      isNew = true;
    }
  }

  // Recent turns for context (oldest first), read before saving the new question.
  let history: { role: string; content: string }[] = [];
  if (conversationId && !isNew) {
    const { data: recent } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(10);
    history = (recent ?? []).reverse();
  }

  if (conversationId) {
    await supabase.from("chat_messages").insert({
      profile_id: profile.id,
      conversation_id: conversationId,
      role: "user",
      content: question,
    });
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  // Only resources matching this student's class and medium reach the model.
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, content")
    .eq("class_level", profile.class_level)
    .eq("medium", profile.medium)
    .limit(6); // replace with a real vector-similarity match against `question`

  const context = (resources ?? []).map((r) => `### ${r.title}\n${r.content}`).join("\n\n");

  const systemPrompt = `You are Keralite AI, a study assistant for a Class ${profile.class_level} student
studying in ${profile.medium === "english" ? "English" : "Malayalam"} medium, first language
${profile.first_language}. Answer only using the textbook context below. If the answer
isn't in the context, say so plainly instead of guessing.

Context:
${context}`;

  let answer: string | null = null;
  try {
    const slmResponse = await fetch(process.env.SLM_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLM_API_KEY}`,
      },
      body: JSON.stringify({
        system: systemPrompt,
        messages: [...history, { role: "user", content: question }],
        question,
      }),
    });
    if (slmResponse.ok) {
      const data = await slmResponse.json();
      if (typeof data.answer === "string" && data.answer.trim()) answer = data.answer;
    }
  } catch {
    // Model unreachable or not configured yet — fall through to the friendly message.
  }

  if (answer === null) {
    // The question stays saved; the error text is not saved as if it were an answer.
    return NextResponse.json({ answer: UNAVAILABLE, failed: true, conversationId, title });
  }

  if (conversationId) {
    await supabase.from("chat_messages").insert({
      profile_id: profile.id,
      conversation_id: conversationId,
      role: "assistant",
      content: answer,
    });
  }

  return NextResponse.json({ answer, conversationId, title });
}
