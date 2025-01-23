import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Prevent sessions from being automatically persisted
      detectSessionInUrl: false, // Disable automatic session handling from URL
    },
  }
);
