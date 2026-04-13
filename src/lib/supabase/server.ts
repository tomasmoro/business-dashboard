import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServerKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY: supabaseAdmin requires the service role key and must not use a NEXT_PUBLIC_* key fallback.",
  );
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServerKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
