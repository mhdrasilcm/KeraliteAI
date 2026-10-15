import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Landing } from "@/components/landing/Landing";

export const runtime = "edge";

// Entry-point routing logic:
// - signed out -> the public home page (sign in / sign up live there)
// - no profiles yet on this account -> onboarding
// - exactly one profile -> straight into chat with it pre-selected
// - two or more profiles -> the profile-select screen first
export default async function Home({ searchParams }: { searchParams: { code?: string } }) {
  // Safety net: if Supabase ever sends the sign-in code to "/" instead of the
  // callback route (e.g. a redirect-URL setting), finish the sign-in anyway.
  if (searchParams.code) redirect(`/auth/callback?code=${encodeURIComponent(searchParams.code)}`);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <Landing />;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("account_id", user.id);

  if (!profiles || profiles.length === 0) redirect("/onboarding");
  if (profiles.length === 1) redirect(`/chat?profile=${profiles[0].id}`);
  redirect("/select");
}
