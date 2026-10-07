import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

// Entry-point routing logic:
// - no profiles yet on this account -> onboarding
// - exactly one profile -> straight into chat with it pre-selected
// - two or more profiles -> the profile-select screen first
export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("account_id", user.id);

  if (!profiles || profiles.length === 0) redirect("/onboarding");
  if (profiles.length === 1) redirect(`/chat?profile=${profiles[0].id}`);
  redirect("/select");
}
