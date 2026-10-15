"use client";

import type { Conversation, Profile } from "@/lib/types";
import { CloseIcon, PlusIcon, TrashIcon } from "./icons";
import { ProfileMenu } from "./ProfileMenu";

export function Sidebar({
  open,
  onClose,
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  profile,
  hasMultipleProfiles,
  userEmail,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  profile: Profile;
  hasMultipleProfiles: boolean;
  userEmail: string;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Phone: dim the page behind the drawer. No shadows anywhere (DESIGN.md). */}
      {open && (
        <div className="fixed inset-0 z-30 bg-ink-charcoal/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        aria-label="Chats"
        className={`fixed inset-y-0 left-0 z-40 flex w-[288px] max-w-[85vw] flex-col border-r border-soft-mist bg-paper-white transition-transform duration-200 md:static md:z-auto md:w-[280px] md:max-w-none md:shrink-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="safe-top flex min-h-[64px] items-center justify-between px-16">
          <span className="text-label-bold font-w540 tracking-[-0.01em]">Keralite AI</span>
          <button onClick={onClose} aria-label="Close menu" className="-mr-8 p-8 md:hidden">
            <CloseIcon />
          </button>
        </div>

        <div className="px-12">
          <button
            onClick={onNew}
            className="flex w-full items-center justify-center gap-8 rounded-small-buttons border border-ink-charcoal bg-lilac-mist px-16 py-12 text-body font-w460"
          >
            <PlusIcon className="h-16 w-16" /> New chat
          </button>
        </div>

        <p className="px-16 pb-8 pt-24 text-caption text-stone-gray">Recent</p>

        <nav className="flex-1 overflow-y-auto px-8">
          {conversations.length === 0 ? (
            <p className="px-8 text-body-sm leading-[1.5] text-stone-gray">
              No chats yet. Ask a question and it will appear here.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {conversations.map((c) => {
                const active = c.id === activeId;
                return (
                  <li key={c.id} className="group relative">
                    <button
                      onClick={() => onSelect(c.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center rounded-small-buttons px-12 py-12 pr-40 text-left text-body-sm ${
                        active ? "bg-lilac-mist" : "hover:bg-warm-parchment"
                      }`}
                    >
                      <span className="truncate">{c.title}</span>
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      aria-label={`Delete chat: ${c.title}`}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-small-buttons p-8 text-stone-gray hover:text-midnight-wine"
                    >
                      <TrashIcon className="h-16 w-16" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <div className="safe-bottom border-t border-soft-mist p-8">
          <ProfileMenu
            profile={profile}
            hasMultipleProfiles={hasMultipleProfiles}
            userEmail={userEmail}
            onLogout={onLogout}
          />
        </div>
      </aside>
    </>
  );
}
