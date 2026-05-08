"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* ================= LOGIN ================= */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("LOGIN ERROR:", error);
    redirect("/giris?error=Giris%20basarisiz");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris?error=User%20bulunamadi");
  }

  const { data: profile, error: profileError } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    console.error("PROFILE ERROR:", profileError);
    redirect("/giris?error=Profil%20bulunamadi");
  }

  if (profile.role === "hotel_owner") {
    redirect("/otel");
  } else {
    redirect("/");
  }
}

/* ================= REGISTER ================= */
export async function register(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "customer";

  if (!email || !password || !fullName) {
    redirect("/kayit?error=Eksik%20bilgi");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    console.error("REGISTER ERROR:", error);
    redirect("/kayit?error=Kayit%20basarisiz");
  }

  const user = data.user;

  if (user) {
    await (supabase as any).from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      role,
    });
  }

  redirect("/giris?success=Kayit%20basarili");
}

/* ================= LOGOUT ================= */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}