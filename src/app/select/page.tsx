import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const runtime = "edge";

const CLASS_LABEL: Record<string, string> = {
  "5": "Class 5", "6": "Class 6", "7": "Class 7", "8": "Class 8", "9": "Class 9",
};

export default async function SelectPage() {
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
  if (list.length === 1) redirect(`/chat?profile=${list[0].id}`);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-16 safe-top safe-bottom">
      <h1 className="text-heading-sm mb-24">Who's studying today?</h1>
      <div className="w-full max-w-[440px] flex flex-col gap-12">
        {list.map((p) => (
          <a
            key={p.id}
            href={`/chat?profile=${p.id}`}
            className="flex items-center justify-between bg-paper-white border border-soft-mist rounded-cards p-16 hover:border-royal-violet transition-colors"
          >
            <div>
              <p className="text-label-bold font-w540">{p.name}</p>
              <p className="text-body-sm text-stone-gray">
                {CLASS_LABEL[p.class_level] ?? p.class_level} · {p.medium === "english" ? "English medium" : "Malayalam medium"}
              </p>
            </div>
            <span className="text-royal-violet text-body">Open →</span>
          </a>
        ))}
        <a
          href="/onboarding"
          className="text-center text-body-sm text-royal-violet mt-8 hover:underline"
        >
          + Add another student
        </a>
      </div>
    </main>
  );
}
