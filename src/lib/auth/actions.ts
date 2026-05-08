/**
 * Auth server actions.
 *   - signInAction
 *   - signUpAction        (customer or hotel applicant)
 *   - signOutAction
 *   - forgotPasswordAction
 *
 * All return a FormState with Turkish messages so they plug into
 * useActionState() in the UI.
 */
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  loginSchema,
  customerRegisterSchema,
  hotelRegisterSchema,
  forgotPasswordSchema,
} from "@/lib/validation/auth";
import { tr } from "@/messages/tr/tr";

export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const ok: FormState = { ok: true };

function translateAuthError(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return tr.errors.wrongCredentials;
    case "email_not_confirmed":
      return "E-postanı henüz doğrulamadın. Gelen kutunu kontrol et.";
    case "user_already_exists":
    case "email_exists":
      return "Bu e-posta zaten kayıtlı.";
    case "weak_password":
      return "Şifre çok zayıf.";
    default:
      return tr.errors.serverError;
  }
}

// ---------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------
export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
 const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

console.log("SIGN IN DATA:", data);
console.error("SIGN IN ERROR:", error);

if (error) {
  return {
    ok: false,
    error: `${error.code ?? "unknown"} - ${error.message ?? "no message"}`,
  };
}


  revalidatePath("/", "layout");

  const next = (formData.get("next") as string) || "/";
  redirect("/dashboard");
}

// ---------------------------------------------------------------------
// Sign up (customer or hotel applicant)
// ---------------------------------------------------------------------
export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const as = (formData.get("as") as "customer" | "hotel") ?? "customer";
  const raw = Object.fromEntries(formData.entries()) as Record<string, unknown>;
  const normalized = { ...raw, termsAccept: raw.termsAccept === "on" };

  const parsed =
    as === "hotel"
      ? hotelRegisterSchema.safeParse(normalized)
      : customerRegisterSchema.safeParse(normalized);

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone || null,
        role: as,
       },
     },
  });
  if (error || !data.user) {
    return { ok: false, error: translateAuthError(error?.code) };
  }

  // For hotel applicants, create the pending hotel row.
  // We use the admin client because email confirmation may be on
  // (no active session yet) and RLS would otherwise reject the insert.
  if (as === "hotel") {
    const v = parsed.data as z.infer<typeof hotelRegisterSchema>;
    const admin = createAdminClient();
    const { error: insertError } = await admin.from("hotels").insert({
      owner_id: data.user.id,
      name: v.hotelName,
      city: v.city,
      address_line: v.addressLine,
      tax_number: v.taxNumber || null,
      status: "pending",
      slug: "", // filled by trigger
    });
    if (insertError) {
      return { ok: false, error: tr.errors.serverError };
    }
    redirect("/kayit/basvuru-alindi");
  }

  redirect("/giris?registered=1");
}

// ---------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/giris");
}

// ---------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------
export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/sifre-sifirla`,
  });

  // Always return success to avoid account enumeration.
  return ok;
}