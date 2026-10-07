"use client";

import { useState } from "react";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";

// Bot protection: Cloudflare Turnstile (pairs naturally with Cloudflare Pages —
// no reCAPTCHA dependency, and it's free). The token is verified server-side
// in /api/auth/verify-turnstile before we let Supabase create the account.
declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string;
    };
  }
}

export default function AuthPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!turnstileToken) {
      setError("Please complete the verification check.");
      return;
    }

    setLoading(true);
    const verify = await fetch("/api/auth/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken }),
    });

    if (!verify.ok) {
      setError("Verification failed — please try again.");
      setLoading(false);
      return;
    }

    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) setError(error.message);
    else window.location.href = "/";
  }

  async function handleGoogleAuth() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={() => {
          window.turnstile?.render("#turnstile-widget", {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => setTurnstileToken(token),
          });
        }}
      />
      <main className="min-h-screen flex items-center justify-center px-16 safe-top safe-bottom">
        <div className="w-full max-w-[400px] bg-paper-white rounded-cards p-24 border border-soft-mist">
          <h1 className="text-heading-sm font-w460 mb-8">
            {mode === "sign-in" ? "Log in to Keralite AI" : "Create your account"}
          </h1>
          <p className="text-body-sm text-stone-gray mb-24">
            One email covers your whole family — add a profile for each student after signing up.
          </p>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-12">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment focus:bg-paper-white outline-none"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment focus:bg-paper-white outline-none"
            />

            <div id="turnstile-widget" />

            {error && <p className="text-body-sm text-midnight-wine">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full mt-8">
              {loading ? "Please wait…" : mode === "sign-in" ? "Log in" : "Sign up"}
            </Button>
          </form>

          <div className="flex items-center gap-12 my-16 text-stone-gray text-body-sm">
            <div className="h-px bg-soft-mist flex-1" />
            or
            <div className="h-px bg-soft-mist flex-1" />
          </div>

          <Button variant="outlined" onClick={handleGoogleAuth} className="w-full">
            Continue with Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="text-body-sm text-royal-violet mt-24 block text-center w-full hover:underline"
          >
            {mode === "sign-in" ? "New here? Create an account" : "Already have an account? Log in"}
          </button>
        </div>
      </main>
    </>
  );
}
