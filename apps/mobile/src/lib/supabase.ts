import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

/**
 * The Supabase client for the mobile app. Uses the public anon key (safe to
 * ship) — the trusted service-role key lives only in edge functions and dev
 * tooling. URL + key come from app.json `extra` so they can be swapped per
 * environment. See docs/CONCEPT.md § Hosting and ticket VIT-2.
 */

const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl = extra.supabaseUrl as string | undefined;
const supabaseAnonKey = extra.supabaseAnonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing supabaseUrl / supabaseAnonKey in app.json `extra`. See ticket VIT-2.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
