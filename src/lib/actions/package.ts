"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPackage(formData: FormData) {
  const title = formData.get("title") as string;
  const hotelName = formData.get("hotel_name") as string;
  const originalPrice = Number(formData.get("original_price"));
  const price = Number(formData.get("price"));
  const pickupStart = formData.get("pickup_start") as string;
  const pickupEnd = formData.get("pickup_end") as string;
  const quantity = Number(formData.get("quantity"));
  const category = formData.get("category") as string;

  const file = formData.get("image") as File;

console.log("FILE:", file);
console.log("FILE SIZE:", file?.size);
console.log("FILE TYPE:", file?.type);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }
  let imageUrl: string | null = null;

if (file && file.size > 0) {
  const fileName = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("packages")
    .upload(fileName, file);

  if (uploadError) {
    console.error("UPLOAD ERROR:", uploadError);
  } else {
    const { data } = supabase.storage
      .from("packages")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }
}

  const { error } = await (supabase as any).from("packages").insert({
    owner_id: user.id,
    title,
    hotel_name: hotelName,
    original_price: originalPrice,
    price,
    pickup_start: pickupStart,
    pickup_end: pickupEnd,
    quantity,
    category,
    is_active: quantity > 0,
    image_url: imageUrl,
  });

  if (error) {
    console.error("PACKAGE CREATE ERROR:", error);
    redirect("/otel?error=Paket%20eklenemedi");
  }

  revalidatePath("/");
  revalidatePath("/otel");
  redirect("/otel?success=Paket%20eklendi");
}

export async function updatePackage(packageId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const hotelName = formData.get("hotel_name") as string;
  const originalPrice = Number(formData.get("original_price"));
  const price = Number(formData.get("price"));
  const pickupStart = formData.get("pickup_start") as string;
  const pickupEnd = formData.get("pickup_end") as string;
  const quantity = Number(formData.get("quantity"));
  const category = formData.get("category") as string;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { error } = await (supabase as any)
    .from("packages")
    .update({
      title,
      hotel_name: hotelName,
      original_price: originalPrice,
      price,
      pickup_start: pickupStart,
      pickup_end: pickupEnd,
      quantity,
      category,
      is_active: quantity > 0,
    })
    .eq("id", packageId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("PACKAGE UPDATE ERROR:", error);
    redirect("/otel?error=Paket%20guncellenemedi");
  }

  revalidatePath("/");
  revalidatePath("/otel");
  redirect("/otel?success=Paket%20guncellendi");
}

export async function deletePackage(packageId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { error } = await (supabase as any)
    .from("packages")
    .delete()
    .eq("id", packageId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("DELETE ERROR:", error);
    redirect("/otel?error=Paket%20silinemedi");
  }

  revalidatePath("/");
  revalidatePath("/otel");
  redirect("/otel?success=Paket%20silindi");
}

export async function togglePackageStatus(
  packageId: string,
  nextStatus: boolean
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { error } = await (supabase as any)
    .from("packages")
    .update({
      is_active: nextStatus,
    })
    .eq("id", packageId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("TOGGLE PACKAGE STATUS ERROR:", error);
    redirect("/otel?error=Durum%20guncellenemedi");
  }

  revalidatePath("/");
  revalidatePath("/otel");
  redirect(
  nextStatus
    ? "/otel?success=" + encodeURIComponent("Paket aktif edildi")
    : "/otel?success=" + encodeURIComponent("Paket pasife alındı")
);
}