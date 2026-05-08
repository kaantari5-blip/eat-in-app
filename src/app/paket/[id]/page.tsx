import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FavoriteButton from "../../../components/FavoriteButton";

function getCategoryLabel(category: string) {
  switch (category) {
    case "tatli":
      return "Tatlı";
    case "firin":
      return "Fırın";
    case "icecek":
      return "İçecek";
    case "karisik":
      return "Karışık";
    default:
      return "Diğer";
  }
}

function getStockBadge(quantity: number) {
  if (quantity <= 0) {
    return {
      text: "Tükendi",
      className: "bg-red-100 text-red-600",
    };
  }

  if (quantity <= 3) {
    return {
      text: "Tükenmek Üzere",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    text: "Stokta",
    className: "bg-[#EEF5ED] text-[#48634C]",
  };
}

type PackageItem = {
  id: string;
  title: string;
  hotel_name: string;
  original_price: number;
  price: number;
  pickup_start: string;
  pickup_end: string;
  is_active: boolean;
  quantity: number;
  category: string;
  image_url?: string | null;
};

function getDiscountPercent(original: number, price: number) {
  if (!original || original <= 0) return 0;
  return Math.round(((original - price) / original) * 100);
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const result = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  const pkg = result.data as PackageItem | null;

  if (!pkg) {
    notFound();
  }

  const discount = getDiscountPercent(
    Number(pkg.original_price),
    Number(pkg.price)
  );

  const stockBadge = getStockBadge(pkg.quantity ?? 0);

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-6 py-10 text-[#2B1E16]">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/"
          className="inline-flex rounded-2xl border border-[#D9B79C] bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
        >
          ← Ana sayfaya dön
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FBE8D3] via-[#FFF8F0] to-[#EED7C0] shadow-[0_10px_40px_rgba(120,72,36,0.08)]">
              <div className="relative min-h-[360px] overflow-hidden">
  {pkg.image_url ? (
    <img
      src={pkg.image_url}
      alt={pkg.title}
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-[#FBE8D3] via-[#FFF8F0] to-[#EED7C0]" />
  )}

  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#7A4526] shadow-sm">
                  Sürpriz Kutu
                </div>

                <div className="absolute left-6 top-6 rounded-full bg-[#EEF5ED] px-3 py-1 text-xs font-medium text-[#48634C] shadow-sm">
                  Bugün teslim
                </div>

                {discount > 0 && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#C96C3A] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    %{discount} indirim
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D6E4D3] bg-[#EEF5ED] p-5 shadow-[0_8px_30px_rgba(80,120,80,0.06)]">
              <h2 className="text-lg font-semibold text-[#48634C]">
                Neden sürpriz kutu?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5F7262]">
                Her kutu, gün sonunda değerlendirilmesi gereken ürünleri daha
                uygun fiyatla müşteriye ulaştırır. Böylece hem işletme kazanır
                hem de gıda israfı azalır.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div
              className={`rounded-[2rem] border border-[#E8D7C7] bg-[#FFFDF9] p-6 shadow-[0_8px_30px_rgba(120,72,36,0.08)] ${
                (pkg.quantity ?? 0) <= 0 ? "opacity-90" : ""
              }`}
            >
              <p className="text-sm text-[#8A7768]">{pkg.hotel_name}</p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#2B1E16]">
                {pkg.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-lg text-[#A08B7C] line-through">
                  {pkg.original_price}₺
                </span>

                <span className="text-4xl font-bold text-[#7A4526]">
                  {pkg.price}₺
                </span>

                {discount > 0 && (
                  <span className="rounded-full bg-[#C96C3A] px-3 py-1 text-xs font-medium text-white">
                    %{discount} indirim
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EEF5ED] px-3 py-1 text-xs font-medium text-[#48634C]">
                  {getCategoryLabel(pkg.category)}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${stockBadge.className}`}
                >
                  {pkg.quantity ?? 0} adet • {stockBadge.text}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    pkg.is_active
                      ? "bg-[#EEF5ED] text-[#48634C]"
                      : "bg-[#FCE8E8] text-[#A04444]"
                  }`}
                >
                  {pkg.is_active ? "Aktif" : "Pasif"}
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-[#F7EEE4] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#A0826D]">
                  Teslim alma
                </p>
                <p className="mt-2 text-sm font-medium text-[#5A3A27]">
                  {pkg.pickup_start} - {pkg.pickup_end}
                </p>
              </div>

              <p className="mt-6 text-sm leading-7 text-[#6B5B4D]">
                Bu sürpriz kutu, işletmede gün sonunda kalan veya son kullanma
                tarihi yaklaşan uygun ürünlerden hazırlanır. İçeriği gün içinde
                değişebilir. Amaç, kaliteli ürünleri daha uygun fiyatla
                sunarken israfı azaltmaktır.
              </p>
{/* FAVORITE BUTTON */}
<div className="mt-6">
  <FavoriteButton packageId={pkg.id} currentPath={`/paket/${pkg.id}`} />
</div>

{/* SATIN AL */}
{/* SATIN AL */}
{pkg.quantity > 0 && pkg.is_active ? (
  <div>
    <Link
      href={`/odeme/${pkg.id}`}
      className="mt-4 block w-full rounded-2xl bg-[#C96C3A] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#B85E2E]"
    >
      Satın Al
    </Link>

    <p className="mt-3 text-center text-xs text-[#8A7768]">
      Ödeme sonrası teslim kodu verilecektir
    </p>
  </div>
) : (
  <div className="mt-4 rounded-2xl border border-[#F2C9C9] bg-[#FFF5F5] py-3.5 text-center text-sm font-medium text-[#A04444]">
    Bu kutu şu anda satın alınamaz
  </div>
)}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}