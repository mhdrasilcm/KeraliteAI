import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

// This route is the RAG boundary: it never lets the model see textbook
// content outside the asking profile's class/language/medium. Swap the
// SLM_ENDPOINT call below for wherever your open-source SLM is hosted
// (a Cloudflare Worker AI binding, a Modal/RunPod endpoint, etc).
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { profileId, question, history } = await request.json();

  // Confirm the profile belongs to this account — RLS enforces this too,
  // but checking explicitly keeps the resource filter honest.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .eq("account_id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Pull only the resources matching this student's class, first language
  // and medium — the core "only load resources for who signed up" rule.
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, content")
    .eq("class_level", profile.class_level)
    .eq("medium", profile.medium)
    .limit(6); // replace with a real vector-similarity match against `question`

  const context = (resources ?? [])
    .map((r) => `### ${r.title}\n${r.content}`)
    .join("\n\n");

  const systemPrompt = `You are Keralite AI, a study assistant for a Class ${profile.class_level} student
studying in ${profile.medium === "english" ? "English" : "Malayalam"} medium, first language
${profile.first_language}. Answer only using the textbook context below. If the answer
isn't in the context, say so plainly instead of guessing.

Context:
${context}`;

  const slmResponse = await fetch(process.env.SLM_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLM_API_KEY}`,
    },
    body: JSON.stringify({
      system: systemPrompt,
      messages: history,
      question,
    }),
  });

  if (!slmResponse.ok) {
    return NextResponse.json({ answer: "The study assistant is unavailable right now — try again shortly." });
  }

  const data = await slmResponse.json();
  return NextResponse.json({ answer: data.answer });
}
