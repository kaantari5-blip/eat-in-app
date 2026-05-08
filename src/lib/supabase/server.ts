/**
 * Server Supabase client.
 * Used in Server Components, Route Handlers, and Server Actions.
 * Reads/writes auth cookies via Next's `cookies()`.
 */
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a pure RSC context — Next forbids cookie writes here.
            // The middleware will refresh the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}