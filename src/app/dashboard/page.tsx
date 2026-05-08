// app/dashboard/page.tsx
import Link from "next/link";
import { requireCustomer } from "@/lib/auth/guards";
import ToastMessage from "@/components/ToastMessage";
import OrderQrCode from "@/components/OrderQrCode";

// ─────────────────── display helpers ───────────────────
function translateStatus(status: string) {
  switch (status) {
    case "pending":
      return "Bekliyor";
    case "confirmed":
      return "Hazırlanıyor";
    case "ready":
      return "Hazır";
    case "delivered":
      return "Teslim Edildi";
    case "cancelled":
      return "İptal";
    default:
      return status;
  }
}

function getStatusEmoji(status: string) {
  switch (status) {
    case "pending":
      return "⏳";
    case "confirmed":
      return "👨‍🍳";
    case "ready":
      return "✅";
    case "delivered":
      return "🎉";
    case "cancelled":
      return "❌";
    default:
      return "•";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-800 ring-amber-200/80";
    case "confirmed":
      return "bg-sky-50 text-sky-800 ring-sky-200/80";
    case "ready":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/80";
    case "delivered":
      return "bg-[#F2F7F0] text-[#48634C] ring-[#DDE8D9]";
    case "cancelled":
      return "bg-rose-50 text-rose-700 ring-rose-200/80";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200/80";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-500";
    case "confirmed":
      return "bg-sky-500";
    case "ready":
      return "bg-emerald-500";
    case "delivered":
      return "bg-[#6B8B6E]";
    case "cancelled":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}

function getAccentBar(status: string) {
  switch (status) {
    case "pending":
      return "bg-gradient-to-b from-amber-300 to-amber-500";
    case "confirmed":
      return "bg-gradient-to-b from-sky-300 to-sky-500";
    case "ready":
      return "bg-gradient-to-b from-emerald-300 to-emerald-500";
    case "delivered":
      return "bg-gradient-to-b from-[#A8C2A6] to-[#48634C]";
    case "cancelled":
      return "bg-gradient-to-b from-rose-300 to-rose-500";
    default:
      return "bg-gradient-to-b from-slate-300 to-slate-400";
  }
}

function getStepIndex(status: string) {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "ready":
      return 2;
    case "delivered":
      return 3;
    default:
      return -1;
  }
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.max(1, Math.floor(diff / 60000));
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  const d = Math.floor(h / 24);
  return `${d} gün önce`;
}

// ─────────────────── timeline ───────────────────
function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Alındı" },
    { key: "confirmed", label: "Hazırlanıyor" },
    { key: "ready", label: "Hazır" },
    { key: "delivered", label: "Teslim" },
  ];
  const current = getStepIndex(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="relative">
      {/* track */}
      <div
        aria-hidden
        className="absolute left-[12.5%] right-[12.5%] top-[18px] h-[3px] rounded-full bg-[#EFE4D6]"
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isCancelled
              ? "bg-rose-300"
              : "bg-gradient-to-r from-[#E59A6F] via-[#D67742] to-[#A24E22]"
          }`}
          style={{
            width:
              isCancelled || current < 0
                ? "0%"
                : `${(current / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* steps */}
      <div className="relative flex items-start justify-between">
        {steps.map((step, i) => {
          const reached = !isCancelled && current >= i;
          const active = !isCancelled && current === i;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-4 transition duration-300 ${
                  reached
                    ? "bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white ring-[#FFF1E1] shadow-[0_8px_18px_-8px_rgba(166,76,30,0.55)]"
                    : "bg-white text-[#9B7E6A] ring-[#EFE4D6]"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full bg-[#C96C3A] opacity-30"
                  />
                )}
                {reached ? (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative h-4 w-4"
                  >
                    <path
                      d="M5 12.5l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="relative text-xs font-bold">{i + 1}</span>
                )}
              </div>
              <p
                className={`mt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[11px] ${
                  reached ? "text-[#2B1E16]" : "text-[#9B7E6A]"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────── page ───────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const { user, supabase } = await requireCustomer();

  const { data: orders } = await (supabase as any)
    .from("orders")
    .select(
      `
      *,
      packages (
        id,
        title,
        hotel_name,
        pickup_start,
        pickup_end,
        image_url,
        price
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const safeOrders = (orders ?? []) as any[];
  const activeOrders = safeOrders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );
  const historyOrders = safeOrders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );

  const totalCount = safeOrders.length;
  const activeCount = activeOrders.length;
  const deliveredCount = safeOrders.filter(
    (o) => o.status === "delivered"
  ).length;

  const renderOrderCard = (order: any, isHistory: boolean) => {
    const pkg = order.packages || {};
    const shortId = order.id
      ?.toString()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase();
    const pickupCode = order.pickup_code ?? "------";
    const totalPrice =
      order.total_price ?? order.price ?? order.packages?.price ?? 0;
    const isCancelled = order.status === "cancelled";
    const hotelInitial =
      (pkg.hotel_name ?? "")
        .toString()
        .trim()
        .charAt(0)
        .toUpperCase() || "?";

    return (
      <article
        key={order.id}
        className={`group relative isolate overflow-hidden rounded-3xl border bg-white transition-all duration-300 ease-out ${
          isHistory
            ? "border-[#EFE4D6]/80 shadow-[0_2px_10px_-6px_rgba(43,30,22,0.06)]"
            : "border-[#EFE4D6] shadow-[0_4px_18px_-8px_rgba(120,72,36,0.1)] hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_22px_44px_-18px_rgba(120,72,36,0.22)]"
        }`}
      >
        {/* colored accent bar */}
        <span
          aria-hidden
          className={`absolute left-0 top-0 h-full w-1.5 ${getAccentBar(
            order.status
          )}`}
        />

        <div className="relative p-5 sm:p-6">
          {/* header row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.16em] text-[#2B1E16] ring-1 ring-[#EFE4D6]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
              />
              #{shortId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClass(
                order.status
              )}`}
            >
              <span
                aria-hidden
                className={`relative flex h-1.5 w-1.5 ${getStatusDot(
                  order.status
                )} rounded-full`}
              >
                {!isHistory && !isCancelled && (
                  <span
                    aria-hidden
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${getStatusDot(
                      order.status
                    )} opacity-70`}
                  />
                )}
              </span>
              <span aria-hidden>{getStatusEmoji(order.status)}</span>
              {translateStatus(order.status)}
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#9B7E6A]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
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
              {timeAgo(order.created_at)}
            </span>
          </div>

          {/* title & venue */}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold tracking-tight text-[#2B1E16] transition-colors duration-200 group-hover:text-[#7A4526] sm:text-xl">
                {pkg.title ?? "Sürpriz Kutu"}
              </h3>
              <div className="mt-1.5 inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#A24E22] text-[10px] font-bold text-white shadow-sm"
                >
                  {hotelInitial}
                </span>
                <p className="truncate text-sm font-medium text-[#6E5A4A]">
                  {pkg.hotel_name ?? "—"}
                </p>
              </div>
              {(pkg.pickup_start || pkg.pickup_end) && (
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#F2F7F0] px-3 py-1 text-xs font-semibold text-[#48634C] ring-1 ring-[#DDE8D9]">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3 w-3"
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
                  Teslim alma: {pkg.pickup_start ?? "—"}
                  {pkg.pickup_end ? ` – ${pkg.pickup_end}` : ""}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Toplam
              </p>
              <p className="bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                ₺{totalPrice}
              </p>
            </div>
          </div>

          {/* timeline (active orders only) */}
          {!isHistory && (
            <div className="mt-6 rounded-2xl border border-[#EFE4D6] bg-gradient-to-br from-[#FFFBF5] to-[#FFF8F0] p-5">
              <StatusTimeline status={order.status} />
            </div>
          )}

          {/* premium pickup ticket */}
          {!isHistory && !isCancelled && (
            <div className="mt-4 overflow-hidden rounded-3xl border border-[#EFE0CC] bg-white shadow-[0_8px_24px_-12px_rgba(43,30,22,0.12)]">
              {/* eyebrow */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#FFF1E1] via-[#FFE3C2] to-[#FFF1E1] px-5 py-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#A24E22]">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  Teslim Alma Bileti
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A24E22]/80">
                  İşletmede göster
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-6">
                {/* left: pickup code */}
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9B7E6A]">
                    Teslim Kodu
                  </p>
                  <p
                    className="mt-2 break-all bg-gradient-to-br from-[#2B1E16] to-[#5A3A27] bg-clip-text font-mono text-3xl font-extrabold tracking-[0.3em] text-transparent sm:text-4xl"
                    aria-label={`Teslim kodu ${pickupCode}`}
                  >
                    {pickupCode}
                  </p>
                  <p className="mt-3 inline-flex items-start gap-1.5 text-xs leading-5 text-[#6E5A4A]">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C96C3A]"
                    >
                      <path
                        d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 14.77 7.06 17.4 8 11.9 4 8l5.61-1.16L12 2z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Bu kodu işletmeye söyleyin veya QR'ı okutun.
                  </p>
                </div>

                {/* right: QR */}
                <div className="flex items-center justify-center">
                  <div className="relative rounded-2xl border border-[#EFE4D6] bg-white p-3 shadow-[0_8px_20px_-10px_rgba(43,30,22,0.18)] transition group-hover:scale-[1.02]">
                    <OrderQrCode value={pickupCode} />
                    {/* corner brackets */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-1 -top-1 h-3.5 w-3.5 rounded-tl-md border-l-[2.5px] border-t-[2.5px] border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 rounded-tr-md border-r-[2.5px] border-t-[2.5px] border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-bl-md border-b-[2.5px] border-l-[2.5px] border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-br-md border-b-[2.5px] border-r-[2.5px] border-[#C96C3A]"
                    />
                  </div>
                </div>
              </div>

              {/* perforated divider */}
              <div className="relative h-3 border-t border-dashed border-[#EFE4D6]">
                <span
                  aria-hidden
                  className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#FCF8F3]"
                />
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-[#FCF8F3]"
                />
              </div>

              {/* ticket footer */}
              <div className="flex items-center justify-between bg-[#FFFBF5] px-5 py-3 text-[11px] text-[#9B7E6A]">
                <span className="inline-flex items-center gap-1.5 font-mono tracking-[0.16em]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
                  />
                  EAT IN · #{shortId}
                </span>
                <span className="truncate font-medium">
                  {pkg.hotel_name ?? "—"}
                </span>
              </div>
            </div>
          )}

          {/* cancelled banner */}
          {!isHistory && isCancelled && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 ring-1 ring-rose-200">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 8l8 8M16 8l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Bu sipariş iptal edildi.
            </div>
          )}

          {/* history footer */}
          {isHistory && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#FFF8F0] px-4 py-2.5 text-xs text-[#6E5A4A]">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M3 12a9 9 0 1 0 3-6.7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 4v5h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sipariş kapandı
              </span>
              <span className="font-mono tracking-wide">
                {timeAgo(order.created_at)}
              </span>
            </div>
          )}

          {/* detail link */}
          {pkg.id && (
            <div className="mt-4 flex justify-end">
              <Link
                href={`/paket/${pkg.id}`}
                className="group/det inline-flex items-center gap-1.5 rounded-full border border-[#E7D4C4] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#7A4526] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF8F0] hover:text-[#C96C3A] hover:shadow-[0_8px_18px_-10px_rgba(201,108,58,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40"
              >
                Detaya git
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3 w-3 transition-transform duration-200 group-hover/det:translate-x-0.5"
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
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FBF6EF] text-[#2B1E16] antialiased">
      {params.success === "order_created" && (
        <ToastMessage message="Siparişin başarıyla oluşturuldu!" />
      )}

      {/* ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#F4D4B3] to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ─────────── HEADER ─────────── */}
        <header className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
            </span>
            Müşteri Paneli
          </div>

          <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.05] tracking-[-0.025em] text-[#2B1E16] sm:text-[2.75rem] lg:text-[3.25rem]">
            Siparişlerim
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#6E5A4A]">
            Aktif siparişlerini takip et, teslim kodu ve QR ile kutunu kolayca
            al.
          </p>

          {/* success banner */}
          {params.success === "order_created" && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-[#F2F7F0] px-4 py-3.5 text-sm font-medium text-emerald-800 shadow-[0_8px_24px_-16px_rgba(72,99,76,0.4)]"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#48634C] text-white shadow-[0_6px_14px_-6px_rgba(72,99,76,0.6)]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    d="M5 12.5l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="leading-relaxed">
                Siparişin başarıyla oluşturuldu. Teslim kodunu işletmeye
                göstererek kutunu alabilirsin.
              </p>
            </div>
          )}

          {/* stat strip */}
          <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="group relative overflow-hidden rounded-2xl border border-[#EFE0CC] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.18)] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] ring-1 ring-[#F4D4B3]/60">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M3 7h18l-1.5 11a2 2 0 0 1-2 1.7H6.5A2 2 0 0 1 4.5 18L3 7z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7V5a4 4 0 0 1 8 0v2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                  Toplam
                </p>
              </div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#2B1E16] sm:text-3xl">
                {totalCount}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-[#EFE0CC] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.18)] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-white ring-1 ring-[#E59A6F]/60">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                  Aktif
                </p>
              </div>
              <p className="mt-2 bg-gradient-to-br from-[#D67742] to-[#A24E22] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                {activeCount}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-[#DDE8D9] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(72,99,76,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(72,99,76,0.16)] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M5 12.5l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F7262]">
                  Tamamlanan
                </p>
              </div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#48634C] sm:text-3xl">
                {deliveredCount}
              </p>
            </div>
          </div>
        </header>

        {/* ─────────── EMPTY STATE ─────────── */}
        {totalCount === 0 && (
          <section className="relative overflow-hidden rounded-3xl border border-[#EFE0CC] bg-gradient-to-br from-white to-[#FCF8F3] p-8 text-center shadow-[0_8px_24px_-12px_rgba(120,72,36,0.1)] sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-60 blur-3xl"
            />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFE3C2] to-[#F4D4B3] shadow-inner ring-1 ring-[#F4D4B3]/60">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-9 w-9 text-[#C96C3A]"
              >
                <path
                  d="M3 7h18l-1.5 11a2 2 0 0 1-2 1.7H6.5A2 2 0 0 1 4.5 18L3 7z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7V5a4 4 0 0 1 8 0v2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="relative mt-6 text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
              Henüz siparişin yok
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[#6E5A4A]">
              Yakındaki sürpriz kutuları keşfet, lezzetli ve uygun fiyatlı bir
              başlangıç yap.
            </p>
            <Link
              href="/"
              className="group relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(166,76,30,0.78)] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] active:translate-y-px"
            >
              Keşfetmeye git
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </section>
        )}

        {/* ─────────── ACTIVE ─────────── */}
        {activeOrders.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-[#A24E22] ring-1 ring-[#F4D4B3]/60">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
              <h2 className="text-lg font-bold tracking-tight text-[#2B1E16] sm:text-xl">
                Aktif siparişler
              </h2>
              <span className="inline-flex h-6 items-center justify-center rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] px-2 text-xs font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(166,76,30,0.55)]">
                {activeCount}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#F2F7F0] px-2.5 py-1 text-[11px] font-semibold text-[#48634C] ring-1 ring-[#DDE8D9]">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8B6E] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6B8B6E]" />
                </span>
                Canlı takip
              </span>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {activeOrders.map((o) => renderOrderCard(o, false))}
            </div>
          </section>
        )}

        {/* ─────────── HISTORY ─────────── */}
        {historyOrders.length > 0 && (
          <section>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M3 12a9 9 0 1 0 3-6.7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 4v5h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-bold tracking-tight text-[#2B1E16] sm:text-xl">
                Geçmiş
              </h2>
              <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#EFE4D6] px-2 text-xs font-bold text-[#6E5A4A]">
                {historyOrders.length}
              </span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {historyOrders.map((o) => renderOrderCard(o, true))}
            </div>
          </section>
        )}

        {/* ─────────── EXPLORE CTA ─────────── */}
        {totalCount > 0 && (
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-[#EFE0CC] bg-gradient-to-br from-white via-[#FCF8F3] to-[#FFE8C9]/40 p-6 shadow-[0_8px_24px_-12px_rgba(120,72,36,0.1)] sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_10px_24px_-10px_rgba(166,76,30,0.6)] ring-1 ring-white/30">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
                <div>
                  <p className="text-base font-bold tracking-tight text-[#2B1E16] sm:text-lg">
                    Yeni sürpriz kutular bekliyor
                  </p>
                  <p className="mt-0.5 text-sm text-[#6E5A4A]">
                    Yakındaki işletmelerden günün fırsatlarını keşfet.
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(166,76,30,0.75)] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
              >
                Keşfetmeye git
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}