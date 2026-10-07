import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components. Reads the publishable anon key only —
// row-level security (RLS) policies in Supabase are what keep each
// family's profiles/resources private, not this key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
