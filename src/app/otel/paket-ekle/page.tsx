import Link from "next/link";
import { createPackage } from "@/lib/actions/package";
import { requireHotelOwner } from "@/lib/auth/guards";
import SubmitButton from "@/components/SubmitButton";

export default async function AddPackagePage() {
  await requireHotelOwner();

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-6 py-10 text-[#2B1E16]">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/otel"
          className="inline-flex rounded-2xl border border-[#D9B79C] bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
        >
          ← Panele dön
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-8 shadow-[0_10px_40px_rgba(120,72,36,0.08)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9B7E6A]">
            İşletme paneli
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Sürpriz Kutu Ekle
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6B5B4D]">
            Gün sonunda kalan ürünlerini uygun fiyatlı sürpriz kutu olarak
            listeleyebilirsin.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[#E7D4C4] bg-[#FFFDF9] p-6 shadow-[0_8px_30px_rgba(120,72,36,0.08)] md:p-8">
          <form
  action={createPackage}
  encType="multipart/form-data"
  className="space-y-6"
>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                Paket Fotoğrafı
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[#C96C3A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#B85E2E]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                Paket Başlığı
              </label>
              <input
                name="title"
                required
                placeholder="Örn: Akşam Sürpriz Kutusu"
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                İşletme Adı
              </label>
              <input
                name="hotel_name"
                required
                placeholder="Örn: The Grand Bosphorus"
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                Kategori
              </label>
              <select
                name="category"
                required
                className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
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
                  placeholder="Örn: 300"
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
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
                  placeholder="Örn: 120"
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
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
                  placeholder="Örn: 18:00"
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5A3A27]">
                  Teslim Bitiş
                </label>
                <input
                  name="pickup_end"
                  required
                  placeholder="Örn: 21:30"
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
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
                  placeholder="Örn: 5"
                  className="w-full rounded-2xl border border-[#E3CBB7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C96C3A]"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[#FFF8F0] p-4 text-sm leading-6 text-[#6B5B4D]">
              Kutun, gün sonunda kalan veya son kullanma tarihi yaklaşan uygun
              ürünlerden oluşabilir. İçerik sürpriz olabilir ama kalite her
              zaman korunmalıdır.
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <SubmitButton
                pendingText="Ekleniyor..."
                className="rounded-2xl bg-[#C96C3A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B85E2E]"
              >
                Kutuyu Yayınla
              </SubmitButton>

              <Link
                href="/otel"
                className="rounded-2xl border border-[#D9B79C] bg-white px-5 py-3 text-center text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
              >
                Vazgeç
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}