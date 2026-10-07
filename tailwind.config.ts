import type { Config } from "tailwindcss";

// Tokens sourced from DESIGN.md — "Superhuman" style reference.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "midnight-wine": "#421d24",
        "royal-violet": "#714cb6",
        "lilac-mist": "#d4c7ff",
        "deep-lagoon": "#0c4243",
        "warm-parchment": "#f2f0eb",
        "soft-mist": "#e3e3e2",
        "ink-charcoal": "#292827",
        "stone-gray": "#666666",
        "paper-white": "#ffffff",
      },
      fontFamily: {
        sans: [
          "'Super Sans VF'",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      fontWeight: {
        w460: "460",
        w540: "540",
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.5" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.2" }],
        "label-bold": ["19px", { lineHeight: "1.5" }],
        subheading: ["26px", { lineHeight: "1.3" }],
        "heading-sm": ["28px", { lineHeight: "1.14", letterSpacing: "-0.62px" }],
        "heading-lg": ["49px", { lineHeight: "1.2", letterSpacing: "-1.32px" }],
        display: ["64px", { lineHeight: "0.96", letterSpacing: "-1.8px" }],
      },
      borderRadius: {
        tabs: "8px",
        cards: "16px",
        pill: "999px",
        buttons: "16px",
        "small-buttons": "8px",
      },
      spacing: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "28": "28px",
        "32": "32px",
        "36": "36px",
        "40": "40px",
        "48": "48px",
        "64": "64px",
        "80": "80px",
        "96": "96px",
      },
      boxShadow: {
        subtle: "inset 0 0 0 1px rgb(113, 76, 182)",
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
