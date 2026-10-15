import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

// Where Google sign-in lands after Supabase. Supabase sends back a one-time
// `code`; this route swaps it for a real session (stored in cookies) and then
// sends the person on to "/", which routes them to onboarding, the student
// picker, or chat.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}/`);
    } catch {
      // fall through to the error redirect below
    }
  }

  // Cancelled, expired or invalid: back to the login page with a message.
  return NextResponse.redirect(`${origin}/auth?error=oauth`);
}
