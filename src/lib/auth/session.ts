/**
 * Server-side session helpers.
 *
 * `cache()` scopes the result to a single React render pass so a
 * layout + page + nav bar all see the same user with exactly one
 * round-trip to Supabase.
 */
import "server-only";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Role = Database["public"]["Enums"]["user_role"];

/**
 * Always use getUser() on the server — it cryptographically verifies
 * the JWT against Supabase. getSession() reads cookies without
 * verification and must not be trusted for authorization.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
});

export async function getSessionWithProfile() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);
  return { user, profile };
}