import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outlined" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// Mirrors DESIGN.md's three button components exactly:
// - primary: Midnight Wine fill — the ONLY chromatic button fill, reserved for the main action
// - outlined: Lilac Mist fill with a charcoal border — secondary action
// - ghost: transparent, underline on hover — inline/tertiary
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-midnight-wine text-paper-white rounded-buttons px-16 h-[48px] hover:opacity-90 transition-opacity",
  outlined:
    "bg-lilac-mist text-ink-charcoal border border-ink-charcoal rounded-small-buttons px-16 py-8",
  ghost: "bg-transparent text-ink-charcoal underline-offset-4 hover:underline px-0",
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      className={`font-sans font-w460 text-body inline-flex items-center justify-center gap-8 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
