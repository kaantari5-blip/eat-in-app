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
  return await requireUser();
}

export async function requireHotelOwner() {
  return await requireUser();
}