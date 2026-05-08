"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function generatePickupCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createOrder(packageId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: pkg, error: pkgError } = await (supabase as any)
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (pkgError || !pkg) {
    redirect("/?error=Paket bulunamadı");
  }

  if (!pkg.is_active || (pkg.quantity ?? 0) <= 0) {
    redirect(`/paket/${packageId}?error=Bu kutu artık satın alınamaz`);
  }

  const newQuantity = Number(pkg.quantity) - 1;
  const pickupCode = generatePickupCode();

  const { data: order, error: orderError } = await (supabase as any)
  .from("orders")
  .insert({
    user_id: user.id,
    package_id: pkg.id,
    owner_id: pkg.owner_id,
    status: "pending",
    pickup_code: pickupCode,
  })
  .select()
  .single();

  if (orderError) {
    console.error("ORDER CREATE ERROR:", orderError);
    redirect(`/paket/${packageId}?error=Sipariş oluşturulamadı`);
  }

const { error: paymentError } = await (supabase as any).from("payments").insert({
  user_id: user.id,
  package_id: pkg.id,
  order_id: order.id,
  amount: pkg.price,
  status: "paid",
  provider: "mock",
});

if (paymentError) {
  console.error("PAYMENT INSERT ERROR:", paymentError);
}

  const { error: packageUpdateError } = await (supabase as any)
    .from("packages")
    .update({
      quantity: newQuantity,
      is_active: newQuantity > 0,
    })
    .eq("id", pkg.id);

  if (packageUpdateError) {
    console.error("PACKAGE QUANTITY UPDATE ERROR:", packageUpdateError);
    redirect(`/paket/${packageId}?error=Stok güncellenemedi`);
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/otel");
  revalidatePath("/otel/siparisler");
  revalidatePath(`/paket/${packageId}`);

  redirect("/dashboard?success=order_created");
}

export async function updateOrderStatus(orderId: string, nextStatus: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "ready",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(nextStatus)) {
    redirect("/otel/siparisler?error=Geçersiz durum");
  }

  const { error } = await (supabase as any)
    .from("orders")
    .update({ status: nextStatus })
    .eq("id", orderId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("ORDER STATUS UPDATE ERROR:", error);
    redirect("/otel/siparisler?error=Sipariş güncellenemedi");
  }

  revalidatePath("/otel/siparisler");
  revalidatePath("/dashboard");

  redirect("/otel/siparisler?success=updated");
}

export async function deliverOrderByQR(data: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Giriş yapmanız gerekiyor" };
  }

  try {
    const parsed = JSON.parse(data);
    const orderId = parsed.order_id;
    const code = parsed.code?.toString().trim().toUpperCase();

    if (!orderId || !code) {
      return { success: false, error: "QR bilgisi eksik" };
    }

    const { data: order } = await (supabase as any)
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("owner_id", user.id)
      .single();

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    if (order.status === "delivered") {
      return { success: false, error: "Bu sipariş zaten teslim edilmiş" };
    }

    if (order.status === "cancelled") {
      return { success: false, error: "İptal edilmiş sipariş teslim edilemez" };
    }

    if (order.pickup_code !== code) {
      return { success: false, error: "Kod eşleşmiyor" };
    }

    const { error } = await (supabase as any)
      .from("orders")
      .update({ status: "delivered" })
      .eq("id", order.id)
      .eq("owner_id", user.id);

    if (error) {
      return { success: false, error: "Teslim edilemedi" };
    }

    revalidatePath("/otel/siparisler");
    revalidatePath("/dashboard");

    return { success: true };
  } catch {
    return { success: false, error: "QR hatalı" };
  }
}

export async function deliverOrderByCode(code: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Giriş yapmanız gerekiyor" };
  }

  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { success: false, error: "Kod boş olamaz" };
  }

  const { data: order } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("pickup_code", cleanCode)
    .eq("owner_id", user.id)
    .single();

  if (!order) {
    return { success: false, error: "Sipariş bulunamadı" };
  }

  if (order.status === "delivered") {
    return { success: false, error: "Bu sipariş zaten teslim edilmiş" };
  }

  if (order.status === "cancelled") {
    return { success: false, error: "İptal edilmiş sipariş teslim edilemez" };
  }

  const { error } = await (supabase as any)
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", order.id)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, error: "Teslim edilemedi" };
  }

  revalidatePath("/otel/siparisler");
  revalidatePath("/dashboard");

  return { success: true };
}