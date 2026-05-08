// app/dashboard/page.tsx
import Link from "next/link";
import { requireCustomer } from "@/lib/auth/guards";
import ToastMessage from "@/components/ToastMessage";
import OrderQrCode from "@/components/OrderQrCode";

// ---------- display-only helpers (no logic change) ----------
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
      return "bg-yellow-50 text-yellow-800 ring-yellow-200";
    case "confirmed":
      return "bg-blue-50 text-blue-800 ring-blue-200";
    case "ready":
      return "bg-green-50 text-green-800 ring-green-200";
    case "delivered":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "ready":
      return "bg-green-500";
    case "delivered":
      return "bg-emerald-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
}

function getAccentBar(status: string) {
  switch (status) {
    case "pending":
      return "bg-gradient-to-b from-yellow-300 to-yellow-500";
    case "confirmed":
      return "bg-gradient-to-b from-blue-300 to-blue-500";
    case "ready":
      return "bg-gradient-to-b from-green-300 to-green-500";
    case "delivered":
      return "bg-gradient-to-b from-emerald-300 to-emerald-500";
    case "cancelled":
      return "bg-gradient-to-b from-red-300 to-red-500";
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

// ---------- timeline component ----------
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
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const reached = !isCancelled && current >= i;
          const active = !isCancelled && current === i;
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-4 transition ${
                  reached
                    ? "bg-[#C96C3A] text-white ring-[#F4DCC8]"
                    : "bg-white text-[#9B7E6A] ring-[#EFE4D6]"
                }`}
              >
                {active && !isCancelled && (
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
                  <span className="relative text-xs font-semibold">
                    {i + 1}
                  </span>
                )}
              </div>
              <p
                className={`mt-2 text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] ${
                  reached ? "text-[#2B1E16]" : "text-[#9B7E6A]"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      <div className="absolute left-0 right-0 top-[18px] -z-0 mx-10 h-[3px] rounded-full bg-[#EFE4D6]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCancelled
              ? "bg-red-300"
              : "bg-gradient-to-r from-[#E59A6F] to-[#C96C3A]"
          }`}
          style={{
            width:
              isCancelled || current < 0
                ? "0%"
                : `${(current / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

// ---------- page ----------
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

    return (
      <article
        key={order.id}
        className={`group relative overflow-hidden rounded-3xl border bg-white transition ${
          isHistory
            ? "border-[#E7D4C4]/70 shadow-[0_2px_8px_-4px_rgba(43,30,22,0.05)]"
            : "border-[#E7D4C4] shadow-[0_8px_24px_-12px_rgba(43,30,22,0.08)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(43,30,22,0.16)]"
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
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#2B1E16] ring-1 ring-[#EFE4D6]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
              />
              #{shortId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(
                order.status
              )}`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                  order.status
                )}`}
              />
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

          {/* title & hotel */}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold text-[#2B1E16] sm:text-xl">
                {pkg.title ?? "Sürpriz Kutu"}
              </h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#6E5A4A]">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M4 21V8l8-5 8 5v13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21v-7h6v7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                {pkg.hotel_name ?? "—"}
              </p>
              {(pkg.pickup_start || pkg.pickup_end) && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F2F7F0] px-3 py-1 text-xs font-medium text-[#48634C] ring-1 ring-[#DDE8D9]">
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
                      strokeWidth="1.6"
                    />
                    <path
                      d="M12 7v5l3 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
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
              <p className="text-2xl font-extrabold text-[#C96C3A] sm:text-3xl">
                ₺{totalPrice}
              </p>
            </div>
          </div>

          {/* timeline (only active orders) */}
          {!isHistory && (
            <div className="mt-6 rounded-2xl border border-[#EFE4D6] bg-gradient-to-br from-[#FFFBF5] to-[#FFF8F0] p-5">
              <StatusTimeline status={order.status} />
            </div>
          )}

          {/* premium pickup card */}
          {!isHistory && !isCancelled && (
            <div className="mt-4 overflow-hidden rounded-3xl border border-[#E7D4C4] bg-white shadow-[0_4px_16px_-8px_rgba(43,30,22,0.08)]">
              {/* eyebrow */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#FFF1E1] via-[#FFE8D2] to-[#FFF1E1] px-5 py-2.5">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B85E2E]">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                  Teslim Alma Bileti
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85E2E]/70">
                  İşletmede göster
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                {/* left: pickup code */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
                    Teslim Kodu
                  </p>
                  <p
                    className="mt-2 break-all font-mono text-3xl font-extrabold tracking-[0.3em] text-[#2B1E16] sm:text-4xl"
                    aria-label={`Teslim kodu ${pickupCode}`}
                  >
                    {pickupCode}
                  </p>
                  <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-[#6E5A4A]">
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
                    Bu kodu işletmeye söyleyin veya QR’ı okutun.
                  </p>
                </div>

                {/* right: QR */}
                <div className="flex items-center justify-center">
                  <div className="relative rounded-2xl border border-[#EFE4D6] bg-white p-3 shadow-[0_2px_8px_-4px_rgba(43,30,22,0.08)]">
                    <OrderQrCode value={pickupCode} />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-[#C96C3A]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-[#C96C3A]"
                    />
                  </div>
                </div>
              </div>

              {/* perforated divider */}
              <div className="relative h-3 border-t border-dashed border-[#EFE4D6]">
                <span
                  aria-hidden
                  className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#FCF8F3]"
                />
                <span
                  aria-hidden
                  className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#FCF8F3]"
                />
              </div>

              {/* ticket footer */}
              <div className="flex items-center justify-between bg-[#FFFBF5] px-5 py-2.5 text-[11px] text-[#9B7E6A]">
                <span className="font-mono tracking-wider">
                  EAT IN · #{shortId}
                </span>
                <span className="truncate">{pkg.hotel_name ?? "—"}</span>
              </div>
            </div>
          )}

          {/* cancelled banner */}
          {!isHistory && isCancelled && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
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
                  strokeWidth="1.6"
                />
                <path
                  d="M8 8l8 8M16 8l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
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
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 4v5h5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sipariş kapandı
              </span>
              <span className="font-mono">{timeAgo(order.created_at)}</span>
            </div>
          )}

          {/* detail link */}
          {pkg.id && (
            <div className="mt-4 flex justify-end">
              <Link
                href={`/paket/${pkg.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D4C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#7A4526] transition hover:bg-[#FFF8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40"
              >
                Detaya Git
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
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCF8F3]">
      {params.success === "order_created" && (
        <ToastMessage message="Siparişin başarıyla oluşturuldu!" />
      )}

      {/* decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#F4DCC8] opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-[#DDE8D9] opacity-40 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
        {/* header */}
        <header className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B85E2E] ring-1 ring-[#EFE4D6] backdrop-blur">
            <span
              aria-hidden
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C96C3A]"
            />
            Müşteri Paneli
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#2B1E16] sm:text-4xl">
            Siparişlerim
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#6E5A4A]">
            Aktif siparişlerinizi takip edin, teslim kodu ve QR ile kutunuzu
            kolayca alın.
          </p>

          {params.success === "order_created" && (
            <div
              role="status"
              className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
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
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-3 shadow-[0_2px_8px_-4px_rgba(43,30,22,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Toplam
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#2B1E16]">
                {totalCount}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-3 shadow-[0_2px_8px_-4px_rgba(43,30,22,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Aktif
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#C96C3A]">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-3 shadow-[0_2px_8px_-4px_rgba(43,30,22,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Tamamlanan
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#48634C]">
                {deliveredCount}
              </p>
            </div>
          </div>
        </header>

        {/* empty state */}
        {totalCount === 0 && (
          <section className="relative overflow-hidden rounded-3xl border border-[#E7D4C4] bg-white p-8 text-center shadow-[0_8px_24px_-12px_rgba(43,30,22,0.08)] sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#FFE8D2] opacity-60 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#DDE8D9] opacity-60 blur-2xl"
            />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE8D2] to-[#F4DCC8] ring-1 ring-[#EFE4D6]">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-[#C96C3A]"
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
            <h2 className="relative mt-5 text-xl font-bold text-[#2B1E16]">
              Henüz siparişin yok
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-[#6E5A4A]">
              Yakındaki sürpriz kutuları keşfet, lezzetli ve uygun fiyatlı bir
              başlangıç yap.
            </p>
            <Link
              href="/"
              className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C96C3A] to-[#B85E2E] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(184,94,46,0.6)] transition hover:shadow-[0_12px_28px_-10px_rgba(184,94,46,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF8F3]"
            >
              Keşfetmeye Git
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </section>
        )}

        {/* active section */}
        {activeOrders.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#2B1E16]">
                Aktif siparişler
              </h2>
              <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#C96C3A] px-2 text-xs font-bold text-white">
                {activeCount}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-[#48634C]">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#48634C]"
                />
                Canlı takip
              </span>
            </div>
            <div className="space-y-4">
              {activeOrders.map((o) => renderOrderCard(o, false))}
            </div>
          </section>
        )}

        {/* history section */}
        {historyOrders.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#2B1E16]">Geçmiş</h2>
              <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#EFE4D6] px-2 text-xs font-bold text-[#6E5A4A]">
                {historyOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {historyOrders.map((o) => renderOrderCard(o, true))}
            </div>
          </section>
        )}

        {/* explore CTA when there are orders */}
        {totalCount > 0 && (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-[#E7D4C4] bg-white p-6 text-center shadow-[0_4px_16px_-8px_rgba(43,30,22,0.06)] sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-bold text-[#2B1E16]">
                Yeni sürpriz kutular bekliyor
              </p>
              <p className="mt-0.5 text-xs text-[#6E5A4A]">
                Yakındaki işletmelerden günün fırsatlarını keşfet.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C96C3A] to-[#B85E2E] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(184,94,46,0.6)] transition hover:shadow-[0_12px_28px_-10px_rgba(184,94,46,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Keşfetmeye Git
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}