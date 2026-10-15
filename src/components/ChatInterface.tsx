"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, Conversation, Profile } from "@/lib/types";
import { Button } from "@/components/Button";
import { Sidebar } from "@/components/chat/Sidebar";
import { MenuIcon } from "@/components/chat/icons";

const CLASS_LABEL: Record<string, string> = {
  "5": "Class 5", "6": "Class 6", "7": "Class 7", "8": "Class 8", "9": "Class 9",
};

export function ChatInterface({
  profile,
  hasMultipleProfiles,
  userEmail,
  initialConversations,
  initialConversationId,
  initialMessages,
}: {
  profile: Profile;
  hasMultipleProfiles: boolean;
  userEmail: string;
  initialConversations: Conversation[];
  initialConversationId: string | null;
  initialMessages: ChatMessage[];
}) {
  const [supabase] = useState(() => createClient());
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadToken = useRef(0);

  const activeTitle = conversations.find((c) => c.id === activeId)?.title ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  function setUrl(id: string | null) {
    window.history.replaceState(null, "", id ? `/chat?profile=${profile.id}&c=${id}` : `/chat?profile=${profile.id}`);
  }

  function newChat() {
    loadToken.current++;
    setActiveId(null);
    setMessages([]);
    setSidebarOpen(false);
    setUrl(null);
  }

  async function selectConversation(id: string) {
    setSidebarOpen(false);
    if (id === activeId) return;
    const token = ++loadToken.current;
    setActiveId(id);
    setMessages([]);
    setLoadingChat(true);
    setUrl(id);

    const { data } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (token !== loadToken.current) return; // user already moved on
    setMessages((data ?? []) as ChatMessage[]);
    setLoadingChat(false);
  }

  async function deleteConversation(id: string) {
    if (!window.confirm("Delete this chat? This can't be undone.")) return;
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) return;
    setConversations((list) => list.filter((c) => c.id !== id));
    if (id === activeId) newChat();
  }

  async function logOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, question, conversationId: activeId }),
      });
      const data = await res.json();

      if (data.conversationId) {
        const now = new Date().toISOString();
        setConversations((list) => {
          const rest = list.filter((c) => c.id !== data.conversationId);
          return [{ id: data.conversationId, title: data.title ?? "New chat", updated_at: now }, ...rest];
        });
        if (data.conversationId !== activeId) {
          setActiveId(data.conversationId);
          setUrl(data.conversationId);
        }
      }
      setMessages((m) => [...m, { role: "assistant", content: data.answer ?? "Something went wrong. Try again." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong reaching the study assistant. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-warm-parchment">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onNew={newChat}
        onSelect={selectConversation}
        onDelete={deleteConversation}
        profile={profile}
        hasMultipleProfiles={hasMultipleProfiles}
        userEmail={userEmail}
        onLogout={logOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="safe-top flex min-h-[64px] items-center gap-8 border-b border-soft-mist bg-warm-parchment/80 px-16 backdrop-blur-[12px]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="-ml-8 p-8 md:hidden"
          >
            <MenuIcon />
          </button>
          <p className="truncate text-body font-w540">{activeTitle ?? "Keralite AI"}</p>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 && !loadingChat && !loading ? (
            <div className="mx-auto max-w-[720px] px-16 pt-48 md:pt-80">
              <h1 className="text-[32px] font-w460 leading-[1.1] tracking-[-0.022em] md:text-[48px] md:leading-[0.96]">
                Hello, {profile.name}
              </h1>
              <p className="mt-16 max-w-[520px] text-label-bold leading-[1.4] text-stone-gray">
                Ask anything from your {CLASS_LABEL[profile.class_level] ?? profile.class_level}{" "}
                {profile.medium === "english" ? "English" : "Malayalam"}-medium textbooks.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-16 px-16 py-24">
              {loadingChat && <p className="text-body-sm text-stone-gray">Loading chat…</p>}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-floating-cards p-16 text-body leading-[1.5] ${
                    m.role === "user"
                      ? "self-end bg-lilac-mist"
                      : "self-start border border-soft-mist bg-paper-white"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="self-start rounded-floating-cards border border-soft-mist bg-paper-white p-16 text-body-sm text-stone-gray">
                  Thinking…
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="safe-bottom bg-warm-parchment">
          <div className="mx-auto max-w-[720px] px-16 pb-12 pt-8">
            <div className="flex gap-8 rounded-cards border border-soft-mist bg-paper-white p-8 focus-within:border-ink-charcoal">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about today's lesson…"
                className="h-[48px] min-w-0 flex-1 bg-transparent px-12 text-body outline-none"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                Ask
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
