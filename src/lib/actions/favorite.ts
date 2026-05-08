"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(
  packageId: string,
  currentPath: string,
  isFavorite: boolean
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  if (isFavorite) {
    const { error } = await (supabase as any)
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("package_id", packageId);

    if (error) {
      console.error("FAVORITE DELETE ERROR:", error);
    }
  } else {
    const { error } = await (supabase as any)
      .from("favorites")
      .insert({
        user_id: user.id,
        package_id: packageId,
      });

    if (error) {
      console.error("FAVORITE INSERT ERROR:", error);
    }
  }

  revalidatePath(currentPath);
  revalidatePath("/");
  revalidatePath("/dashboard");
}