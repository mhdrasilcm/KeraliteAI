import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatInterface } from "@/components/ChatInterface";
import type { Profile } from "@/lib/types";

export const runtime = "edge";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { profile?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at", { ascending: true });

  const list = (profiles ?? []) as Profile[];
  if (list.length === 0) redirect("/onboarding");

  const active = list.find((p) => p.id === searchParams.profile) ?? list[0];
  if (!active) redirect("/select");

  return <ChatInterface profile={active} hasMultipleProfiles={list.length > 1} />;
}
