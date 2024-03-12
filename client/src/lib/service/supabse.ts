import { createClient } from "@supabase/supabase-js";

export type Database = Record<string, unknown>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl == null || supabaseAnonKey == null) {
  throw new Error("Missing env variables for Supabase");
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
