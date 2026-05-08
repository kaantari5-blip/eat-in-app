import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pickupCode } = body;

    if (!pickupCode) {
      return NextResponse.json(
        { ok: false, error: "Teslim kodu eksik." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("pickup_code", pickupCode)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { ok: false, error: "Sipariş bulunamadı." },
        { status: 404 }
      );
    }

    if (order.status === "delivered") {
      return NextResponse.json(
        { ok: false, error: "Bu sipariş zaten teslim edilmiş." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "delivered" })
      .eq("id", order.id);

    if (updateError) {
      console.error("Teslim update error:", JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { ok: false, error: "Sipariş teslim edilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Sipariş teslim edildi.",
    });
  } catch (error) {
    console.error("Teslim endpoint error:", error);
    return NextResponse.json(
      { ok: false, error: "Beklenmeyen hata oluştu." },
      { status: 500 }
    );
  }
}