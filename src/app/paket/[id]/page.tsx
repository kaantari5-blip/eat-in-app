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

function getCategoryEmoji(category: string) {
  switch (category) {
    case "tatli":
      return "🍰";
    case "firin":
      return "🥐";
    case "icecek":
      return "☕";
    case "karisik":
      return "🎁";
    default:
      return "🧺";
  }
}

function getStockBadge(quantity: number) {
  if (quantity <= 0) {
    return {
      text: "Tükendi",
      className: "bg-[#FCE8E8] text-[#A04444] ring-[#F2C9C9]",
      dot: "bg-[#A04444]",
    };
  }

  if (quantity <= 3) {
    return {
      text: "Tükenmek üzere",
      className: "bg-[#FFF1E6] text-[#B85E2E] ring-[#F4D4B3]",
      dot: "bg-[#C96C3A]",
    };
  }

  return {
    text: "Stokta",
    className: "bg-[#F2F7F0] text-[#48634C] ring-[#DDE8D9]",
    dot: "bg-[#6B8B6E]",
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

  const original = Number(pkg.original_price);
  const price = Number(pkg.price);
  const discount = getDiscountPercent(original, price);
  const savings =
    original > price ? Math.max(0, Math.round(original - price)) : 0;

  const stockBadge = getStockBadge(pkg.quantity ?? 0);
  const isPurchasable = (pkg.quantity ?? 0) > 0 && pkg.is_active;
  const hotelInitial =
    (pkg.hotel_name ?? "")
      .toString()
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  // ───────────────────── PURCHASE PANEL (shared mobile + desktop) ─────────────────────
  const purchasePanel = (
    <div className="relative overflow-hidden rounded-3xl border border-[#EFE0CC] bg-white p-5 shadow-[0_24px_50px_-24px_rgba(120,72,36,0.18)] sm:p-6">
      {/* warm mesh accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-2xl"
      />

      {/* price block */}
      <div className="relative">
        <div className="flex items-baseline gap-3">
          <span className="bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-[2.5rem] font-extrabold leading-none tracking-tight text-transparent">
            {price}₺
          </span>
          {original > price && (
            <span className="text-base font-medium text-[#B8A593] line-through">
              {original}₺
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-[0_6px_16px_-6px_rgba(166,76,30,0.65)] ring-1 ring-white/30">
              −%{discount} indirim
            </span>
          )}
          {savings > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F7F0] px-2.5 py-1 text-[11px] font-bold text-[#48634C] ring-1 ring-[#DDE8D9]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3"
              >
                <path
                  d="M20 7L9 18l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {savings}₺ tasarruf
            </span>
          )}
        </div>
      </div>

      {/* pickup + stock summary */}
      <div className="relative mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-[#EFE4D6] bg-[#FCF8F3] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7E6A]">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className="h-3 w-3 text-[#C96C3A]"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 7v5l3 2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Teslim
          </div>
          <p className="mt-1.5 text-sm font-bold leading-tight text-[#2B1E16]">
            {pkg.pickup_start ?? "—"}
            {pkg.pickup_end ? ` – ${pkg.pickup_end}` : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-[#7B6657]">Bugün</p>
        </div>

        <div className="rounded-2xl border border-[#EFE4D6] bg-[#FCF8F3] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7E6A]">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className="h-3 w-3 text-[#C96C3A]"
            >
              <path
                d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m3.3 7 8.7 5 8.7-5M12 22V12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Stok
          </div>
          <p className="mt-1.5 text-sm font-bold leading-tight text-[#2B1E16]">
            {pkg.quantity ?? 0} adet
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#7B6657]">
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${stockBadge.dot}`} />
            {stockBadge.text}
          </p>
        </div>
      </div>

      {/* CTA */}
      {isPurchasable ? (
        <Link
          href={`/odeme/${pkg.id}`}
          className="group relative mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-3.5 text-sm font-bold tracking-tight text-white shadow-[0_14px_30px_-12px_rgba(166,76,30,0.7)] ring-1 ring-white/30 transition duration-300 hover:brightness-[1.05] hover:shadow-[0_18px_36px_-12px_rgba(166,76,30,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
        >
          Satın Al
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition group-hover:translate-x-0.5"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F2C9C9] bg-[#FFF5F5] px-5 py-3.5 text-sm font-semibold text-[#A04444]">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Bu kutu şu anda satın alınamaz
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-[#9B7E6A]">
        Ödeme sonrası teslim kodu verilecektir
      </p>

      {/* trust features */}
      <ul className="mt-5 space-y-2 border-t border-dashed border-[#EFE4D6] pt-4 text-[12px] text-[#5A3A27]">
        {[
          "Aynı gün teslim alma",
          "Kutu garantili — kalan ürünlere uygulanır",
          "Gıda israfını azaltırsın",
        ].map((feat) => (
          <li key={feat} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F2F7F0] text-[#48634C] ring-1 ring-[#DDE8D9]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                <path
                  d="M20 7L9 18l-5-5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FBF6EF] pb-32 text-[#2B1E16] antialiased lg:pb-16">
      {/* ─────────────── TOP NAV ─────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#EFE0CC] bg-white/80 px-3.5 py-2 text-sm font-semibold text-[#5A3A27] backdrop-blur transition hover:-translate-x-0.5 hover:border-[#D9B79C] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 transition group-hover:-translate-x-0.5"
            >
              <path
                d="M19 12H5m7-7-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Ana sayfa
          </Link>

          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-1.5 text-xs font-medium text-[#9B7E6A] sm:flex"
          >
            <Link
              href="/"
              className="rounded-full px-2 py-1 transition hover:bg-white/60 hover:text-[#5A3A27]"
            >
              Kutular
            </Link>
            <span aria-hidden className="text-[#D9B79C]">
              /
            </span>
            <span className="rounded-full bg-white/60 px-2 py-1 font-semibold text-[#5A3A27]">
              {getCategoryLabel(pkg.category)}
            </span>
          </nav>
        </div>
      </div>

      {/* ─────────────── BODY GRID ─────────────── */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:mt-8 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10 xl:gap-14">
          {/* ─── MAIN COLUMN ─── */}
          <div className="space-y-8 lg:space-y-10">
            {/* HERO IMAGE */}
            <section>
              <div className="group relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-gradient-to-br from-[#FBE8D3] via-[#FFF8F0] to-[#EED7C0] shadow-[0_30px_60px_-24px_rgba(120,72,36,0.25)]">
                <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9]">
                  {pkg.image_url ? (
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FBE8D3] via-[#FFF8F0] to-[#EED7C0] text-7xl">
                      <span aria-hidden>{getCategoryEmoji(pkg.category)}</span>
                    </div>
                  )}

                  {/* dual gradients */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 via-black/5 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                  />

                  {/* TOP-LEFT same-day chip */}
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#C96C3A] shadow-[0_6px_18px_-6px_rgba(43,30,22,0.35)] ring-1 ring-white/70 backdrop-blur sm:left-5 sm:top-5">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                    </span>
                    Bugün teslim
                  </span>

                  {/* TOP-RIGHT favorite */}
                  <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_20px_-6px_rgba(43,30,22,0.4)] ring-1 ring-white/70 backdrop-blur transition duration-300 hover:scale-105">
                      <FavoriteButton
                        packageId={pkg.id}
                        currentPath={`/paket/${pkg.id}`}
                      />
                    </div>
                  </div>

                  {/* BOTTOM-LEFT discount */}
                  {discount > 0 && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-3 py-1.5 text-white shadow-[0_12px_28px_-8px_rgba(166,76,30,0.7)] ring-1 ring-white/30 sm:bottom-5 sm:left-5">
                      <span className="text-[15px] font-extrabold leading-none tracking-tight sm:text-base">
                        −%{discount}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-90">
                        indirim
                      </span>
                    </div>
                  )}

                  {/* BOTTOM-RIGHT venue chip */}
                  {pkg.hotel_name && (
                    <div className="absolute bottom-4 right-4 inline-flex max-w-[60%] items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-3 text-[12px] font-semibold text-[#2B1E16] shadow-[0_8px_20px_-6px_rgba(43,30,22,0.4)] ring-1 ring-white/70 backdrop-blur sm:bottom-5 sm:right-5">
                      <span
                        aria-hidden
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] text-[11px] font-bold text-white shadow-inner"
                      >
                        {hotelInitial}
                      </span>
                      <span className="truncate">{pkg.hotel_name}</span>
                    </div>
                  )}

                  {/* sold-out scrim */}
                  {!isPurchasable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                      <span className="rounded-full bg-white/95 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#2B1E16] shadow-lg ring-1 ring-white/60">
                        {(pkg.quantity ?? 0) <= 0 ? "Tükendi" : "Pasif"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* TITLE BLOCK */}
            <section>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F0] px-2.5 py-1 text-[11px] font-semibold text-[#7A4526] ring-1 ring-[#EFE0CC]">
                  <span aria-hidden>{getCategoryEmoji(pkg.category)}</span>
                  {getCategoryLabel(pkg.category)}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${stockBadge.className}`}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${stockBadge.dot}`} />
                  {pkg.quantity ?? 0} adet • {stockBadge.text}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                    pkg.is_active
                      ? "bg-[#F2F7F0] text-[#48634C] ring-[#DDE8D9]"
                      : "bg-[#FCE8E8] text-[#A04444] ring-[#F2C9C9]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      pkg.is_active ? "bg-[#6B8B6E]" : "bg-[#A04444]"
                    }`}
                  />
                  {pkg.is_active ? "Aktif" : "Pasif"}
                </span>
              </div>

              <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.05] tracking-[-0.025em] text-[#2B1E16] sm:text-[2.75rem] lg:text-[3.25rem]">
                {pkg.title}
              </h1>

              <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#7B6657]">
                <span
                  aria-hidden
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] text-[11px] font-bold text-white shadow-sm"
                >
                  {hotelInitial}
                </span>
                <span>
                  <span className="font-semibold text-[#5A3A27]">
                    {pkg.hotel_name}
                  </span>{" "}
                  · {getCategoryLabel(pkg.category)}
                </span>
              </p>
            </section>

            {/* MOBILE PURCHASE PANEL — appears below title on mobile */}
            <section className="lg:hidden">{purchasePanel}</section>

            {/* QUICK STAT CARDS */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#EFE0CC] bg-white p-4 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.2)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] ring-1 ring-[#F4D4B3]/60">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M12 7v5l3 2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7E6A]">
                    Teslim saati
                  </p>
                </div>
                <p className="mt-3 text-base font-bold text-[#2B1E16]">
                  {pkg.pickup_start ?? "—"}
                  {pkg.pickup_end ? ` – ${pkg.pickup_end}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-[#7B6657]">Bugün</p>
              </div>

              <div className="rounded-2xl border border-[#EFE0CC] bg-white p-4 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.2)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m3.3 7 8.7 5 8.7-5M12 22V12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7E6A]">
                    Mevcut stok
                  </p>
                </div>
                <p className="mt-3 text-base font-bold text-[#2B1E16]">
                  {pkg.quantity ?? 0} adet
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#7B6657]">
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${stockBadge.dot}`} />
                  {stockBadge.text}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EFE0CC] bg-white p-4 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.2)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] ring-1 ring-[#F4D4B3]/60">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7E6A]">
                    Tasarruf
                  </p>
                </div>
                <p className="mt-3 text-base font-bold text-[#48634C]">
                  {savings > 0 ? `${savings}₺` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-[#7B6657]">
                  {discount > 0 ? `%${discount} indirim` : "Sabit fiyat"}
                </p>
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="rounded-3xl border border-[#EFE0CC] bg-white p-6 shadow-[0_2px_12px_rgba(120,72,36,0.04)] sm:p-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96C3A]">
                Açıklama
              </h2>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                Bu kutuda ne var?
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[#5A3A27]">
                Bu sürpriz kutu, işletmede gün sonunda kalan veya son kullanma
                tarihi yaklaşan uygun ürünlerden hazırlanır. İçeriği gün içinde
                değişebilir. Amaç, kaliteli ürünleri daha uygun fiyatla
                sunarken israfı azaltmaktır.
              </p>
            </section>

            {/* WHY SURPRISE BOX */}
            <section className="relative overflow-hidden rounded-3xl border border-[#DDE8D9] bg-gradient-to-br from-[#F2F7F0] to-[#E8F1E5] p-6 shadow-[0_8px_30px_-12px_rgba(80,120,80,0.18)] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#C9D9C6]/40 blur-3xl"
              />
              <div className="relative flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B8B6E] to-[#48634C] text-white shadow-[0_10px_24px_-10px_rgba(72,99,76,0.6)] ring-1 ring-white/30"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#48634C]">
                    Etki
                  </h2>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-[#2B4628] sm:text-2xl">
                    Neden sürpriz kutu?
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#3F5742]">
                    Her kutu, gün sonunda değerlendirilmesi gereken ürünleri
                    daha uygun fiyatla müşteriye ulaştırır. Böylece hem işletme
                    kazanır hem de gıda israfı azalır.
                  </p>
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-[#C9D9C6]/60 pt-5">
                {[
                  { stat: "%60+", label: "indirim" },
                  { stat: "−1.2k", label: "kg israf" },
                  { stat: "Aynı gün", label: "teslim" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-base font-bold text-[#2B4628] sm:text-lg">
                      {s.stat}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5F7262]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="rounded-3xl border border-[#EFE0CC] bg-white p-6 shadow-[0_2px_12px_rgba(120,72,36,0.04)] sm:p-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96C3A]">
                Nasıl alırım?
              </h2>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                3 adımda kutunu teslim al
              </h3>

              <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    n: 1,
                    title: "Satın al",
                    desc: "Güvenli ödeme ile kutunu ayırt.",
                    bg: "from-[#D67742] to-[#A24E22]",
                  },
                  {
                    n: 2,
                    title: "Kodunu al",
                    desc: "Ödeme sonrası teslim kodun gönderilir.",
                    bg: "from-[#8A5B3D] to-[#5A3A27]",
                  },
                  {
                    n: 3,
                    title: "Teslim al",
                    desc: `${pkg.pickup_start ?? "—"}${
                      pkg.pickup_end ? ` – ${pkg.pickup_end}` : ""
                    } arasında işletmeden teslim al.`,
                    bg: "from-[#6B8B6E] to-[#48634C]",
                  },
                ].map((step) => (
                  <li
                    key={step.n}
                    className="group relative rounded-2xl border border-[#EFE4D6] bg-[#FCF8F3] p-4 transition hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_10px_22px_-12px_rgba(120,72,36,0.2)]"
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${step.bg} text-sm font-bold text-white shadow-sm transition group-hover:scale-105`}
                    >
                      {step.n}
                    </span>
                    <p className="mt-3 text-sm font-bold text-[#2B1E16]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#7B6657]">
                      {step.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ─── DESKTOP ASIDE — sticky ─── */}
          <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
            {purchasePanel}
          </aside>
        </div>
      </div>

      {/* ─────────────── MOBILE STICKY BOTTOM CTA ─────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EFE0CC] bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-12px_rgba(120,72,36,0.2)] backdrop-blur lg:hidden"
        aria-label="Satın alma çubuğu"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#7A4526]">
                {price}₺
              </span>
              {original > price && (
                <span className="text-xs font-medium text-[#B8A593] line-through">
                  {original}₺
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  −%{discount}
                </span>
              )}
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-[#7B6657]">
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${stockBadge.dot}`} />
              {pkg.quantity ?? 0} adet · {pkg.pickup_start ?? "—"}
              {pkg.pickup_end ? `–${pkg.pickup_end}` : ""}
            </p>
          </div>

          {isPurchasable ? (
            <Link
              href={`/odeme/${pkg.id}`}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(166,76,30,0.7)] ring-1 ring-white/30 transition hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 active:translate-y-px"
            >
              Satın Al
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-2xl border border-[#F2C9C9] bg-[#FFF5F5] px-4 py-3 text-xs font-semibold text-[#A04444]">
              Satın alınamaz
            </span>
          )}
        </div>
      </div>
    </main>
  );
}