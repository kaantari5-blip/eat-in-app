import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/giris");
  }

  return { supabase, user };
}

export async function requireCustomer() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "customer") {
    redirect("/");
  }

  return { supabase, user, profile };
}

export async function requireHotelOwner() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "hotel_owner") {
    redirect("/");
  }

  return { supabase, user, profile };
}