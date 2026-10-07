import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Verifies the Turnstile token server-side before any sign-up/sign-in call
// reaches Supabase. Never trust the client-side widget alone — a bot can
// skip the widget entirely and hit this API, so this check is the real gate.
export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const outcome = await verifyRes.json();
  return NextResponse.json({ success: outcome.success }, { status: outcome.success ? 200 : 403 });
}
