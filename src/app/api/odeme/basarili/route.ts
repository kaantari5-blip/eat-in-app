import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { packageId, amount } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("payments").insert({
      package_id: packageId,
      amount: amount,
      status: "paid",
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { ok: false, error: "DB kayıt hatası" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Hata oluştu" },
      { status: 500 }
    );
  }
}