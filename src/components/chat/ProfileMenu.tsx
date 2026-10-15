"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/types";
import { ChevronIcon, LogoutIcon, SwitchIcon } from "./icons";

const CLASS_LABEL: Record<string, string> = {
  "5": "Class 5", "6": "Class 6", "7": "Class 7", "8": "Class 8", "9": "Class 9",
};

// Bottom-corner profile control, like Gemini: tap to open a small menu upwards.
export function ProfileMenu({
  profile,
  hasMultipleProfiles,
  userEmail,
  onLogout,
}: {
  profile: Profile;
  hasMultipleProfiles: boolean;
  userEmail: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = (profile.name.trim()[0] ?? "?").toUpperCase();

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-8 rounded-cards border border-soft-mist bg-paper-white p-8"
        >
          {userEmail && (
            <p className="truncate px-12 pb-8 pt-4 text-caption text-stone-gray">{userEmail}</p>
          )}
          {hasMultipleProfiles && (
            <a
              role="menuitem"
              href="/select"
              className="flex items-center gap-12 rounded-small-buttons px-12 py-12 text-body hover:bg-warm-parchment"
            >
              <SwitchIcon /> Switch student
            </a>
          )}
          <button
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-12 rounded-small-buttons px-12 py-12 text-left text-body hover:bg-warm-parchment"
          >
            <LogoutIcon /> Log out
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-12 rounded-cards p-8 text-left hover:bg-warm-parchment"
      >
        <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-pill bg-lilac-mist text-body font-w540">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-sm font-w540">{profile.name}</span>
          <span className="block truncate text-caption text-stone-gray">
            {CLASS_LABEL[profile.class_level] ?? profile.class_level} ·{" "}
            {profile.medium === "english" ? "English" : "Malayalam"} medium
          </span>
        </span>
        <ChevronIcon className={`h-16 w-16 shrink-0 text-stone-gray transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
