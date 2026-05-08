import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePackage } from "@/lib/actions/package";
import { requireHotelOwner } from "@/lib/auth/guards";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "hotel_owner") {
    redirect("/dashboard");
  }

  const { data: pkg } = await (supabase as any)
    .from("packages")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!pkg) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-6 py-10 text-[#2B1E16]">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/otel"
          className="inline-flex rounded-2xl border border-[#D9B79C] bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
        >
          ← Panele dön
        </Link>

        <div className="rounded-[2rem] border border-[#E7D4C4] bg-[#FFFDF9] p-6 shadow-[0_8px_30px_rgba(120,72,36,0.08)]">
          <h1 className="text-3xl font-bold">Sürpriz Kutu Düzenle</h1>
          <p className="mt-2 text-sm text-[#6B5B4D]">
            Kutunun bilgilerini güncelleyebilirsin.
          </p>

          <form
            action={updatePackage.bind(null, pkg.id)}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                Paket Başlığı
              </label>
              <input
                name="title"
                required
                defaultValue={pkg.title}
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                İşletme Adı
              </label>
              <input
                name="hotel_name"
                required
                defaultValue={pkg.hotel_name}
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                Kategori
              </label>
              <select
                name="category"
                required
                defaultValue={pkg.category}
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3"
              >
                <option value="tatli">Tatlı</option>
                <option value="firin">Fırın</option>
                <option value="icecek">İçecek</option>
                <option value="karisik">Karışık</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Eski Fiyat
                </label>
                <input
                  name="original_price"
                  type="number"
                  min="0"
                  required
                  defaultValue={pkg.original_price}
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Satış Fiyatı
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  required
                  defaultValue={pkg.price}
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Teslim Başlangıç
                </label>
                <input
                  name="pickup_start"
                  required
                  defaultValue={pkg.pickup_start}
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Teslim Bitiş
                </label>
                <input
                  name="pickup_end"
                  required
                  defaultValue={pkg.pickup_end}
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Adet
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  required
                  defaultValue={pkg.quantity}
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 outline-none transition focus:border-[#C96C3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#C96C3A] py-3.5 text-sm font-medium text-white transition hover:bg-[#B85E2E]"
            >
              Değişiklikleri Kaydet
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}