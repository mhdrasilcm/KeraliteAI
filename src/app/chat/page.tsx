import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatInterface } from "@/components/ChatInterface";
import type { ChatMessage, Conversation, Profile } from "@/lib/types";

export const runtime = "edge";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { profile?: string; c?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at", { ascending: true });

  const list = (profiles ?? []) as Profile[];
  if (list.length === 0) redirect("/onboarding");

  const active = list.find((p) => p.id === searchParams.profile) ?? list[0];
  if (!active) redirect("/select");

  // Saved chats for THIS student only. (If the chat-history SQL hasn't been run
  // yet this simply comes back empty and chat still works.)
  const { data: convs } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("profile_id", active.id)
    .order("updated_at", { ascending: false })
    .limit(50);
  const conversations = (convs ?? []) as Conversation[];

  let initialConversationId: string | null = null;
  let initialMessages: ChatMessage[] = [];
  if (searchParams.c && conversations.some((c) => c.id === searchParams.c)) {
    initialConversationId = searchParams.c;
    const { data: msgs } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", initialConversationId)
      .order("created_at", { ascending: true });
    initialMessages = (msgs ?? []) as ChatMessage[];
  }

  return (
    <ChatInterface
      key={active.id}
      profile={active}
      hasMultipleProfiles={list.length > 1}
      userEmail={user.email ?? ""}
      initialConversations={conversations}
      initialConversationId={initialConversationId}
      initialMessages={initialMessages}
    />
  );
}
