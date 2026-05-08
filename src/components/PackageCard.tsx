import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import CompletePaymentButton from "@/components/CompletePaymentButton";

function getCategoryEmoji(category?: string) {
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

function getCategoryLabel(category?: string) {
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

export default function PackageCard({ p }: { p: any }) {
  const discount = p.original_price
    ? Math.round((1 - p.price / p.original_price) * 100)
    : null;

  const isSoldOut = p.quantity <= 0 || !p.is_active;

  const savings =
    p.original_price && p.original_price > p.price
      ? Math.max(0, Math.round(Number(p.original_price) - Number(p.price)))
      : 0;

  const isLowStock = !isSoldOut && p.quantity > 0 && p.quantity <= 3;

  const hotelInitial =
    (p.hotel_name ?? "")
      .toString()
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  return (
    <article
      className={`group relative isolate flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 ease-out ${
        isSoldOut
          ? "border-[#EFE4D6] opacity-90"
          : "border-[#EFE4D6] shadow-[0_4px_18px_-8px_rgba(120,72,36,0.12)] hover:-translate-y-1.5 hover:border-[#E7C4A6] hover:shadow-[0_24px_48px_-18px_rgba(120,72,36,0.28)]"
      }`}
    >
      {/* ───────────────── COVER IMAGE ───────────────── */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#FFF8F0]">
        <Link
          href={`/paket/${p.id}`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label={p.title}
        >
          <img
            src={p.image_url || "/placeholder.jpg"}
            alt={p.title}
            className={`h-full w-full object-cover transition-transform duration-[700ms] ease-out ${
              isSoldOut
                ? "scale-100 grayscale saturate-50"
                : "group-hover:scale-[1.07]"
            }`}
          />

          {/* dual gradient overlays — subtle on top, deeper on bottom */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 via-black/5 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />
          {/* warm hover wash — only when not sold out */}
          {!isSoldOut && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7A4526]/0 via-transparent to-[#FFE3C2]/0 opacity-0 transition duration-500 group-hover:from-[#7A4526]/10 group-hover:to-[#FFE3C2]/15 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* TOP-LEFT — same-day chip */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#C96C3A] shadow-[0_6px_18px_-6px_rgba(43,30,22,0.35)] ring-1 ring-white/70 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
          </span>
          Bugün teslim
        </span>

        {/* TOP-RIGHT — favorite */}
        <div className="absolute right-3 top-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-[0_6px_18px_-6px_rgba(43,30,22,0.35)] ring-1 ring-white/70 backdrop-blur transition duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_22px_-8px_rgba(43,30,22,0.4)]">
            <FavoriteButton packageId={p.id} currentPath="/" />
          </div>
        </div>

        {/* BOTTOM-LEFT — discount call-out (big, gradient) */}
        {discount !== null && discount > 0 && !isSoldOut && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-3 py-1.5 text-white shadow-[0_10px_24px_-8px_rgba(166,76,30,0.7)] ring-1 ring-white/30 transition duration-300 group-hover:-rotate-1 group-hover:shadow-[0_14px_28px_-8px_rgba(166,76,30,0.85)]">
            <span className="text-[15px] font-extrabold leading-none tracking-tight">
              −%{discount}
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] opacity-90 sm:inline">
              indirim
            </span>
          </div>
        )}

        {/* BOTTOM-RIGHT — hotel chip with avatar */}
        {p.hotel_name && !isSoldOut && (
          <div className="absolute bottom-3 right-3 inline-flex max-w-[60%] items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 text-[11px] font-semibold text-[#2B1E16] shadow-[0_6px_18px_-6px_rgba(43,30,22,0.35)] ring-1 ring-white/70 backdrop-blur">
            <span
              aria-hidden
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] text-[10px] font-bold text-white shadow-inner"
            >
              {hotelInitial}
            </span>
            <span className="truncate">{p.hotel_name}</span>
          </div>
        )}

        {/* SOLD OUT overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/95 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#2B1E16] shadow-lg ring-1 ring-white/60">
              Tükendi
            </span>
          </div>
        )}
      </div>

      {/* ───────────────── CONTENT ───────────────── */}
      <div className="flex flex-1 flex-col p-5">
        {/* meta row — category · pickup · low-stock */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8F0] px-2 py-0.5 text-[10px] font-semibold text-[#7A4526] ring-1 ring-[#EFE0CC]">
            <span aria-hidden>{getCategoryEmoji(p.category)}</span>
            {getCategoryLabel(p.category)}
          </span>

          {(p.pickup_start || p.pickup_end) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FCF8F3] px-2 py-0.5 text-[10px] font-medium text-[#6B5B4D] ring-1 ring-[#EFE4D6]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-[#9B7E6A]"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 7v5l3 2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="truncate">
                {p.pickup_start ?? "—"}
                {p.pickup_end ? ` – ${p.pickup_end}` : ""}
              </span>
            </span>
          )}

          {isLowStock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[10px] font-bold text-[#B85E2E] ring-1 ring-[#F4D4B3]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
              </span>
              Son {p.quantity} kutu
            </span>
          )}
        </div>

        {/* title */}
        <Link
          href={`/paket/${p.id}`}
          className="mt-2.5 line-clamp-2 text-[1.05rem] font-bold leading-snug tracking-[-0.005em] text-[#2B1E16] transition-colors duration-200 group-hover:text-[#7A4526] focus-visible:outline-none focus-visible:underline sm:text-[1.125rem]"
        >
          {p.title}
        </Link>

        {/* spacer */}
        <div className="flex-1" />

        {/* price row */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-[#EFE4D6] pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-[1.625rem]">
                {p.price}₺
              </span>
              {p.original_price && p.original_price > p.price && (
                <span className="text-sm font-medium text-[#B8A593] line-through">
                  {p.original_price}₺
                </span>
              )}
            </div>
            {!isSoldOut && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8A7768]">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${
                    isLowStock ? "bg-[#C96C3A]" : "bg-[#6B8B6E]"
                  }`}
                />
                Stokta {p.quantity} adet
              </p>
            )}
          </div>

          {savings > 0 && !isSoldOut && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F2F7F0] px-2.5 py-1 text-[11px] font-bold text-[#48634C] ring-1 ring-[#DDE8D9] transition group-hover:bg-[#E8F1E5]">
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

        {/* primary CTA */}
        {!isSoldOut ? (
          <div
            className="mt-4
              [&>*]:!w-full
              [&_button]:!w-full
              [&_button]:!inline-flex
              [&_button]:!items-center
              [&_button]:!justify-center
              [&_button]:!gap-2
              [&_button]:!rounded-2xl
              [&_button]:!bg-gradient-to-br
              [&_button]:!from-[#D67742]
              [&_button]:!to-[#A24E22]
              [&_button]:!px-5
              [&_button]:!py-3.5
              [&_button]:!text-[13.5px]
              [&_button]:!font-bold
              [&_button]:!tracking-tight
              [&_button]:!text-white
              [&_button]:!shadow-[0_10px_24px_-10px_rgba(166,76,30,0.7)]
              [&_button]:!ring-1
              [&_button]:!ring-white/30
              [&_button]:!transition-all
              [&_button]:!duration-300
              hover:[&_button]:!brightness-[1.05]
              hover:[&_button]:!shadow-[0_16px_30px_-10px_rgba(166,76,30,0.8)]
              active:[&_button]:!translate-y-px"
          >
            <CompletePaymentButton
              amount={Number(p.price)}
              packageId={p.id}
            />
          </div>
        ) : (
          <button
            disabled
            className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-[#F4ECE2] px-5 py-3.5 text-[13.5px] font-bold tracking-tight text-[#9B7E6A] ring-1 ring-[#EFE0CC]"
          >
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
            Tükendi
          </button>
        )}

        {/* detail link */}
        <Link
          href={`/paket/${p.id}`}
          className="group/detail mt-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#9B7E6A] transition-colors duration-200 hover:text-[#7A4526] focus-visible:outline-none focus-visible:text-[#7A4526]"
        >
          Detayları gör
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="h-3 w-3 transition-transform duration-200 group-hover/detail:translate-x-0.5"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}