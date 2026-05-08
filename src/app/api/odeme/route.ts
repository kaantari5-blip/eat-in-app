import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function generatePickupCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { packageId, amount } = body;

    if (!packageId || !amount) {
      return NextResponse.json(
        { ok: false, error: "Paket veya tutar eksik." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
    },
  }
);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    { ok: false, error: "Giriş yapmalısın." },
    { status: 401 }
  );
}

    const { data: pkg, error: pkgError } = await supabase
      .from("packages")
      .select("id, owner_id, quantity, price, is_active")
      .eq("id", packageId)
      .single();

    if (pkgError || !pkg) {
      return NextResponse.json(
        { ok: false, error: "Paket bulunamadı." },
        { status: 404 }
      );
    }

    if (!pkg.is_active) {
      return NextResponse.json(
        { ok: false, error: "Bu paket şu anda aktif değil." },
        { status: 400 }
      );
    }

    if ((pkg.quantity ?? 0) <= 0) {
      return NextResponse.json(
        { ok: false, error: "Stok kalmadı." },
        { status: 400 }
      );
    }

    if (Number(amount) !== Number(pkg.price)) {
      return NextResponse.json(
        { ok: false, error: "Tutar paket fiyatıyla uyuşmuyor." },
        { status: 400 }
      );
    }

    const pickupCode = generatePickupCode();

    const { data: order, error: orderError } = await supabase
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
      console.error("Order insert error:", JSON.stringify(orderError, null, 2));
      return NextResponse.json(
        { ok: false, error: "Sipariş oluşturulamadı." },
        { status: 500 }
      );
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      package_id: pkg.id,
      order_id: order.id,
      amount: Number(amount),
      status: "paid",
      provider: "mock",
    });

    if (paymentError) {
      console.error(
        "Payment insert error:",
        JSON.stringify(paymentError, null, 2)
      );
      return NextResponse.json(
        { ok: false, error: "Payment insert error" },
        { status: 500 }
      );
    }

    const { error: stockError } = await supabase.rpc(
      "decrease_package_quantity",
      {
        package_id_input: pkg.id,
      }
    );

    if (stockError) {
      console.error("Stock update error:", JSON.stringify(stockError, null, 2));
      return NextResponse.json(
        { ok: false, error: "Stok güncellenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Ödeme kaydedildi.",
      redirectUrl: `/odeme/basarili?packageId=${pkg.id}&amount=${amount}&code=${pickupCode}`,
    });
  } catch (error) {
    console.error("Ödeme hatası:", error);

    return NextResponse.json(
      { ok: false, error: "Ödeme başlatılamadı." },
      { status: 500 }
    );
  }
}