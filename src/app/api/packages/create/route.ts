import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, quantity } = body;

    if (!title || !price || !quantity) {
      return NextResponse.json(
        { ok: false, error: "Eksik bilgi var." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
        { status: 401 }
      );
    }

    const { error } = await supabase.from("packages").insert({
      title,
      price: Number(price),
      original_price: Number(price) * 2,
      quantity: Number(quantity),
      hotel_name: "Test İşletme",
      category: "karisik",
      pickup_start: "21:00",
      pickup_end: "22:00",
      is_active: true,
      owner_id: user.id,
    });

    if (error) {
      console.error("Package create error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { ok: false, error: "Paket oluşturulamadı." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Paket oluşturuldu.",
    });
  } catch (error) {
    console.error("Package create endpoint error:", error);

    return NextResponse.json(
      { ok: false, error: "Beklenmeyen hata oluştu." },
      { status: 500 }
    );
  }
}