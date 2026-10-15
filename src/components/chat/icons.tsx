// Minimal single-weight line icons (DESIGN.md: ~16-20px monochrome strokes).
type P = { className?: string };

function Svg({ className = "h-20 w-20", children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const PlusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const TrashIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
  </Svg>
);
export const LogoutIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M15 8l4 4-4 4M19 12H9" />
  </Svg>
);
export const SwitchIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 7h11l-3-3M17 17H6l3 3" />
  </Svg>
);
export const ChevronIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 14l5-5 5 5" />
  </Svg>
);
