import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Dynamic Expo config. Static fields live in app.json; this layer injects the
 * Supabase connection from the environment so the same build can target a local
 * stack (zero-config default) or a hosted project (set EXPO_PUBLIC_SUPABASE_*).
 *
 * EXPO_PUBLIC_ vars are inlined into the client bundle at build time — only the
 * public anon key belongs here, never the service-role key. The fallback is the
 * well-known Supabase local demo anon key (safe to commit). See DEPLOY.md.
 */

const LOCAL_SUPABASE_URL = "http://127.0.0.1:54321";
const LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "VITNESS",
  slug: config.slug ?? "vitness",
  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? LOCAL_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? LOCAL_ANON_KEY,
    mockPackCount: Number(
      process.env.EXPO_PUBLIC_MOCK_PACK_COUNT ?? config.extra?.mockPackCount ?? 20,
    ),
  },
});
