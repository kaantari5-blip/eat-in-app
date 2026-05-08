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

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
        isSoldOut
          ? "border-[#EFE4D6] opacity-90"
          : "border-[#EFE4D6] shadow-[0_8px_24px_rgba(120,72,36,0.06)] hover:-translate-y-1 hover:border-[#D9B79C] hover:shadow-[0_18px_40px_rgba(120,72,36,0.14)]"
      }`}
    >
      {/* COVER IMAGE */}
      <div className="relative h-44 w-full overflow-hidden bg-[#FFF8F0]">
        <Link
          href={`/paket/${p.id}`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]"
          aria-label={p.title}
        >
          <img
            src={p.image_url || "/placeholder.jpg"}
            alt={p.title}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isSoldOut ? "grayscale saturate-50" : "group-hover:scale-105"
            }`}
          />
          {/* gradient overlay (bottom dark → top transparent) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
          />
        </Link>

        {/* TOP-LEFT: bugün teslim badge */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#C96C3A] shadow-[0_4px_12px_-4px_rgba(43,30,22,0.25)] ring-1 ring-white/60 backdrop-blur">
          <span aria-hidden>🔥</span>
          Bugün teslim
        </span>

        {/* TOP-RIGHT: discount + favorite */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {discount && discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#C96C3A] to-[#B85E2E] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-[0_4px_12px_-4px_rgba(184,94,46,0.6)] ring-1 ring-white/30">
              %{discount}
            </span>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_12px_-4px_rgba(43,30,22,0.25)] ring-1 ring-white/60 backdrop-blur transition group-hover:scale-105">
            <FavoriteButton packageId={p.id} currentPath="/" />
          </div>
        </div>

        {/* low-stock floating chip */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#B85E2E] shadow-[0_4px_12px_-4px_rgba(43,30,22,0.25)] ring-1 ring-white/60 backdrop-blur">
            <span
              aria-hidden
              className="relative flex h-1.5 w-1.5"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
            </span>
            Son {p.quantity} kutu
          </span>
        )}

        {/* sold-out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#2B1E16] shadow-md">
              Tükendi
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        {/* hotel + category */}
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-[#8A7768]">
            {p.hotel_name}
          </p>
          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#FFF8F0] px-2 py-0.5 text-[10px] font-semibold text-[#6B5B4D] ring-1 ring-[#EFE4D6]">
            <span aria-hidden>{getCategoryEmoji(p.category)}</span>
            {getCategoryLabel(p.category)}
          </span>
        </div>

        {/* title */}
        <Link
          href={`/paket/${p.id}`}
          className="mt-1.5 line-clamp-2 text-lg font-bold leading-tight text-[#2B1E16] transition group-hover:text-[#7A4526] focus-visible:outline-none focus-visible:underline"
        >
          {p.title}
        </Link>

        {/* pickup hint */}
        {(p.pickup_start || p.pickup_end) && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#6B5B4D]">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 text-[#9B7E6A]"
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
          </p>
        )}

        {/* price row */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#7A4526]">
              {p.price}₺
            </span>
            {p.original_price && p.original_price > p.price && (
              <span className="text-sm font-medium text-gray-400 line-through">
                {p.original_price}₺
              </span>
            )}
          </div>
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

        {/* stock pill */}
        {!isSoldOut && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8A7768]">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                isLowStock ? "bg-[#C96C3A]" : "bg-[#48634C]"
              }`}
            />
            Stokta {p.quantity} adet
          </p>
        )}

        {/* spacer to push CTA to bottom */}
        <div className="flex-1" />

        {/* primary CTA */}
        {!isSoldOut ? (
          <div className="mt-4 [&>*]:!w-full [&_button]:!w-full [&_button]:!rounded-2xl [&_button]:!bg-gradient-to-r [&_button]:!from-[#C96C3A] [&_button]:!to-[#B85E2E] [&_button]:!px-5 [&_button]:!py-3 [&_button]:!text-sm [&_button]:!font-bold [&_button]:!text-white [&_button]:!shadow-[0_8px_20px_-8px_rgba(184,94,46,0.6)] [&_button]:!transition hover:[&_button]:!from-[#B85E2E] hover:[&_button]:!to-[#A14F22] hover:[&_button]:!shadow-[0_12px_28px_-10px_rgba(184,94,46,0.7)]">
            <CompletePaymentButton
              amount={Number(p.price)}
              packageId={p.id}
            />
          </div>
        ) : (
          <button
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-400"
          >
            Tükendi
          </button>
        )}

        {/* detail link */}
        <Link
          href={`/paket/${p.id}`}
          className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#9B7E6A] transition hover:text-[#7A4526]"
        >
          Detayları gör
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="h-3 w-3"
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