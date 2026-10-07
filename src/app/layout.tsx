import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Keralite AI",
  description: "An AI study assistant for Kerala students.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Keralite AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2f0eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-warm-parchment text-ink-charcoal font-sans font-w460 antialiased">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
