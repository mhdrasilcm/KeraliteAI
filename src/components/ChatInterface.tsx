"use client";

import { useRef, useState } from "react";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CLASS_LABEL: Record<string, string> = {
  "5": "Class 5", "6": "Class 6", "7": "Class 7", "8": "Class 8", "9": "Class 9",
};

export function ChatInterface({
  profile,
  hasMultipleProfiles,
}: {
  profile: Profile;
  hasMultipleProfiles: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // /api/chat filters textbook resources by this profile's class,
      // first_language and medium before handing context to the SLM.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, question, history: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong reaching the study assistant. Try again." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));
    }
  }

  return (
    <div className="h-screen flex flex-col bg-warm-parchment">
      <header className="safe-top sticky top-0 z-10 backdrop-blur-md bg-warm-parchment/80 border-b border-soft-mist">
        <div className="max-w-page mx-auto px-16 h-[64px] flex items-center justify-between">
          <div>
            <p className="text-body font-w540 leading-none">Keralite AI</p>
            <p className="text-caption text-stone-gray leading-none mt-4">
              {profile.name} · {CLASS_LABEL[profile.class_level] ?? profile.class_level}
            </p>
          </div>
          {hasMultipleProfiles && (
            <a href="/select">
              <Button variant="outlined" className="!h-auto text-body-sm">
                Switch account
              </Button>
            </a>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-page mx-auto px-16 py-24 flex flex-col gap-16">
          {messages.length === 0 && (
            <div className="bg-paper-white/85 border border-soft-mist rounded-floating-cards p-16 max-w-[520px]">
              <p className="text-body text-ink-charcoal">
                Ask anything from your {profile.medium === "english" ? "English" : "Malayalam"}-medium
                {" "}{CLASS_LABEL[profile.class_level] ?? profile.class_level} textbooks — Keralite AI only
                answers from resources loaded for your class.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-floating-cards p-16 text-body ${
                m.role === "user"
                  ? "self-end bg-lilac-mist text-ink-charcoal"
                  : "self-start bg-paper-white/85 border border-soft-mist text-ink-charcoal"
              }`}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="self-start bg-paper-white/85 border border-soft-mist rounded-floating-cards p-16 text-body-sm text-stone-gray">
              Thinking…
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={sendMessage}
        className="safe-bottom border-t border-soft-mist bg-warm-parchment"
      >
        <div className="max-w-page mx-auto px-16 py-12 flex gap-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about today's lesson…"
            className="flex-1 border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-paper-white outline-none focus:border-royal-violet"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Ask
          </Button>
        </div>
      </form>
    </div>
  );
}
