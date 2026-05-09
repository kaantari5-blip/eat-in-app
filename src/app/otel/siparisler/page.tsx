import Link from "next/link";
import { requireHotelOwner } from "@/lib/auth/guards";
import { updateOrderStatus } from "@/lib/actions/order";
import SubmitButton from "@/components/SubmitButton";
import AutoRefreshOrders from "@/components/AutoRefreshOrders";
import QuickDeliverButton from "@/components/QuickDeliverButton";
import NewOrderHighlighter from "@/components/NewOrderHighlighter";

function translateStatus(status: string) {
  switch (status) {
    case "pending":
      return "Bekliyor";
    case "confirmed":
      return "Onaylandı";
    case "ready":
      return "Hazır";
    case "delivered":
      return "Teslim Edildi";
    case "cancelled":
      return "İptal Edildi";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-800 ring-amber-200/80";
    case "confirmed":
      return "bg-sky-50 text-sky-800 ring-sky-200/80";
    case "ready":
      return "bg-violet-50 text-violet-800 ring-violet-200/80";
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
      return "bg-violet-500";
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
      return "bg-gradient-to-b from-violet-300 to-violet-500";
    case "delivered":
      return "bg-gradient-to-b from-[#A8C2A6] to-[#48634C]";
    case "cancelled":
      return "bg-gradient-to-b from-rose-300 to-rose-500";
    default:
      return "bg-gradient-to-b from-slate-300 to-slate-400";
  }
}

function timeAgo(dateString: string) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default async function HotelOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { supabase, user } = await requireHotelOwner();

  const params = await searchParams;
  const selectedStatus = params?.status;

  const { data: myPackages } = await (supabase as any)
    .from("packages")
    .select("id")
    .eq("owner_id", user.id);

  const myPackageIds = (myPackages ?? []).map((p: any) => p.id);

  let orders: any[] = [];

  if (myPackageIds.length > 0) {
    const { data: ordersData } = await (supabase as any)
      .from("orders")
      .select("*")
      .in("package_id", myPackageIds)
      .order("created_at", { ascending: false });

    orders = ordersData ?? [];
  }

  const orderpackageIds = orders.map((o: any) => o.package_id);

  let packages: any[] = [];

  if (orderpackageIds.length > 0) {
    const { data } = await (supabase as any)
      .from("packages")
      .select("id,title,hotel_name,pickup_start,pickup_end,price")
      .in("id", orderpackageIds);

    packages = data ?? [];
  }

  const packageMap = new Map(packages.map((p: any) => [p.id, p]));

  const activeStatuses = ["pending", "confirmed", "ready"];

  const filteredOrders = selectedStatus
    ? orders.filter((o: any) => o.status === selectedStatus)
    : orders;

  // global counts (for filter chips - independent of selected filter)
  const allPendingCount = orders.filter(
    (o: any) => o.status === "pending"
  ).length;
  const allConfirmedCount = orders.filter(
    (o: any) => o.status === "confirmed"
  ).length;
  const allReadyCount = orders.filter(
    (o: any) => o.status === "ready"
  ).length;
  const allDeliveredCount = orders.filter(
    (o: any) => o.status === "delivered"
  ).length;
  const allTotalCount = orders.length;

  // visible counts for the current filter
  const totalOrders = filteredOrders.length;
  const pendingCount = filteredOrders.filter(
    (o: any) => o.status === "pending"
  ).length;
  const confirmedCount = filteredOrders.filter(
    (o: any) => o.status === "confirmed"
  ).length;
  const readyCount = filteredOrders.filter(
    (o: any) => o.status === "ready"
  ).length;
  const deliveredCount = filteredOrders.filter(
    (o: any) => o.status === "delivered"
  ).length;

  const activeOrders =
    filteredOrders
      .filter((o: any) => activeStatuses.includes(o.status))
      .sort((a: any, b: any) => {
        if (a.status === "ready" && b.status !== "ready") return -1;
        if (b.status === "ready" && a.status !== "ready") return 1;
        return 0;
      }) ?? [];

  const historyOrders =
    filteredOrders.filter((o: any) => !activeStatuses.includes(o.status)) ?? [];

  // ───── filter chip helper ─────
  const filterChips: {
    label: string;
    href: string;
    key: string | null;
    count: number;
    dot: string;
  }[] = [
    {
      label: "Tümü",
      href: "/otel/siparisler",
      key: null,
      count: allTotalCount,
      dot: "bg-[#C96C3A]",
    },
    {
      label: "Bekleyen",
      href: "/otel/siparisler?status=pending",
      key: "pending",
      count: allPendingCount,
      dot: "bg-amber-500",
    },
    {
      label: "Onaylı",
      href: "/otel/siparisler?status=confirmed",
      key: "confirmed",
      count: allConfirmedCount,
      dot: "bg-sky-500",
    },
    {
      label: "Hazır",
      href: "/otel/siparisler?status=ready",
      key: "ready",
      count: allReadyCount,
      dot: "bg-violet-500",
    },
    {
      label: "Teslim",
      href: "/otel/siparisler?status=delivered",
      key: "delivered",
      count: allDeliveredCount,
      dot: "bg-[#6B8B6E]",
    },
  ];

  const renderOrderCard = (order: any, isHistory: boolean = false) => {
    const pkg: any = packageMap.get(order.package_id);
    const shortId =
      order.id?.toString().replace(/-/g, "").slice(0, 6).toUpperCase() ?? "";
    const customerName = "Müşteri";
    const initial =
      customerName.toString().trim().charAt(0).toUpperCase() || "?";
    const isCancelled = order.status === "cancelled";

    return (
      <article
        key={order.id}
        className={`new-order-glow group relative isolate overflow-hidden rounded-3xl border bg-white transition-all duration-300 ease-out ${
          isHistory
            ? "border-[#EFE4D6]/80 shadow-[0_2px_10px_-6px_rgba(43,30,22,0.06)]"
            : "border-[#EFE4D6] shadow-[0_4px_18px_-8px_rgba(120,72,36,0.1)] hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_22px_44px_-18px_rgba(120,72,36,0.22)]"
        }`}
      >
        {/* accent bar */}
        <span
          className={`absolute inset-y-0 left-0 w-1.5 ${getAccentBar(
            order.status
          )}`}
          aria-hidden="true"
        />

        <div className="relative p-5 sm:p-6">
          {/* header row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.16em] text-[#2B1E16] ring-1 ring-[#EFE4D6]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
              />
              #{shortId}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${getStatusClass(
                order.status
              )}`}
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                {!isHistory && !isCancelled && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${getStatusDot(
                      order.status
                    )} opacity-70`}
                  />
                )}
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${getStatusDot(
                    order.status
                  )}`}
                />
              </span>
              {translateStatus(order.status)}
            </span>

            {/* pickup code */}
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#E7C4A6] bg-gradient-to-r from-[#FFF8F0] via-[#FFF1E1] to-[#FFF8F0] px-3 py-1.5">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-[#C96C3A]"
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Kod
              </span>
              <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-[#A24E22]">
                {order.pickup_code ?? "------"}
              </span>
            </div>

            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9B7E6A]">
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
              {timeAgo(order.created_at)}
            </span>
          </div>

          {/* title + price */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold tracking-tight text-[#2B1E16] transition-colors duration-200 group-hover:text-[#7A4526] sm:text-xl">
                {pkg?.title ?? "Kutu"}
              </h3>

              {pkg?.hotel_name && (
                <p className="mt-0.5 text-xs font-medium text-[#7A6355]">
                  {pkg.hotel_name}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-[11px] font-bold text-[#7A4526] ring-1 ring-[#F4D4B3]/60"
                  >
                    {initial}
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B7E6A]">
                      Müşteri
                    </p>
                    <p className="text-sm font-bold text-[#2B1E16]">
                      {customerName}
                    </p>
                  </div>
                </div>

                {pkg?.pickup_start && pkg?.pickup_end && (
                  <div className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
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
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B7E6A]">
                        Teslim
                      </p>
                      <p className="text-sm font-bold text-[#2B1E16]">
                        {pkg.pickup_start} – {pkg.pickup_end}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {pkg?.price !== undefined && pkg?.price !== null && (
              <div className="shrink-0 rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] px-4 py-3 text-right ring-1 ring-inset ring-[#F4D4B3]/60">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A24E22]">
                  Tutar
                </p>
                <p className="bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-2xl font-extrabold leading-none tracking-tight text-transparent">
                  {pkg.price}₺
                </p>
              </div>
            )}
          </div>

          {/* actions */}
          {!isHistory && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-[#EFE4D6] pt-4">
              {order.status === "pending" && (
                <form
                  action={updateOrderStatus.bind(null, order.id, "confirmed")}
                  className="flex-1 sm:flex-initial"
                >
                  <SubmitButton
                    pendingText="Güncelleniyor..."
                    className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_24px_-10px_rgba(166,76,30,0.78)] hover:brightness-[1.05] active:translate-y-px sm:w-auto"
                  >
                    Onayla
                  </SubmitButton>
                </form>
              )}

              {(order.status === "pending" ||
                order.status === "confirmed") && (
                <form
                  action={updateOrderStatus.bind(null, order.id, "ready")}
                  className="flex-1 sm:flex-initial"
                >
                  <SubmitButton
                    pendingText="Güncelleniyor..."
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition-all duration-200 hover:-translate-y-px hover:border-violet-300 hover:bg-violet-100 hover:shadow-[0_8px_18px_-10px_rgba(139,92,246,0.4)] active:translate-y-px sm:w-auto"
                  >
                    Hazır Yap
                  </SubmitButton>
                </form>
              )}

              {order.status !== "delivered" && order.status !== "cancelled" && (
                <>
                  <Link
                    href={`/otel/scan?code=${order.pickup_code}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#EFE0CC] bg-white px-4 py-2.5 text-sm font-bold text-[#7A4526] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF8F0] hover:text-[#C96C3A] hover:shadow-[0_8px_18px_-10px_rgba(201,108,58,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 active:translate-y-px"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                    Kodu Aç
                  </Link>

                  <QuickDeliverButton pickupCode={order.pickup_code} />

                  <form
                    action={updateOrderStatus.bind(
                      null,
                      order.id,
                      "delivered"
                    )}
                    className="flex-1 sm:flex-initial"
                  >
                    <SubmitButton
                      pendingText="Güncelleniyor..."
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all duration-200 hover:-translate-y-px hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-[0_8px_18px_-10px_rgba(72,99,76,0.4)] active:translate-y-px sm:w-auto"
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M5 12.5l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Teslim Edildi
                    </SubmitButton>
                  </form>
                </>
              )}

              {order.status !== "delivered" &&
                order.status !== "cancelled" && (
                  <form
                    action={updateOrderStatus.bind(
                      null,
                      order.id,
                      "cancelled"
                    )}
                    className="ml-auto"
                  >
                    <SubmitButton
                      pendingText="İptal ediliyor..."
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M18 6 6 18M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      İptal
                    </SubmitButton>
                  </form>
                )}
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FBF6EF] text-[#2B1E16] antialiased">
      <NewOrderHighlighter />

      {/* ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#F4D4B3] to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl space-y-7 px-4 py-8 sm:space-y-9 sm:px-6 sm:py-12">
        {/* ─────────── BACK ─────────── */}
        <Link
          href="/otel"
          className="group inline-flex items-center gap-1.5 rounded-full border border-[#EFE0CC] bg-white/80 px-3.5 py-2 text-sm font-semibold text-[#5A3A27] backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:border-[#D9B79C] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30"
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
          Panele dön
        </Link>

        {/* ─────────── HERO ─────────── */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-6 shadow-[0_18px_40px_-20px_rgba(120,72,36,0.18)] sm:p-8 lg:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-[#FFF3E6]/60 blur-3xl"
          />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm backdrop-blur">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                </span>
                Canlı Sipariş Paneli
              </span>
              <AutoRefreshOrders />
            </div>

            <div>
              <h1 className="text-[2.25rem] font-bold leading-[1.05] tracking-[-0.025em] text-[#2B1E16] sm:text-[2.75rem] lg:text-[3.25rem]">
                Gelen Siparişler
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#6E5A4A]">
                Mutfak ve teslimat akışını buradan yönet. Yeni siparişler
                geldikçe otomatik olarak güncellenir.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────── STATS STRIP ─────────── */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatTile
            label="Bekleyen"
            value={selectedStatus ? pendingCount : allPendingCount}
            tone="amber"
            icon={
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
            }
          />
          <StatTile
            label="Onaylı"
            value={selectedStatus ? confirmedCount : allConfirmedCount}
            tone="sky"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M5 12.5l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatTile
            label="Hazır"
            value={selectedStatus ? readyCount : allReadyCount}
            tone="violet"
            icon={
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
            }
          />
          <StatTile
            label="Teslim"
            value={selectedStatus ? deliveredCount : allDeliveredCount}
            tone="green"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m3.3 7 8.7 5 8.7-5M12 22V12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </section>

        {/* ─────────── FILTER CHIPS ─────────── */}
        <section>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
            Filtrele
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {filterChips.map((c) => {
              const active =
                c.key === null
                  ? !selectedStatus
                  : selectedStatus === c.key;
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 active:translate-y-px ${
                    active
                      ? "border-transparent bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_10px_24px_-10px_rgba(166,76,30,0.6)] ring-1 ring-white/30"
                      : "border-[#EFE0CC] bg-white text-[#5A3A27] hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_10px_22px_-12px_rgba(120,72,36,0.2)]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-white/80" : c.dot
                    }`}
                  />
                  {c.label}
                  <span
                    className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold ${
                      active
                        ? "bg-white/20 text-white ring-1 ring-white/30"
                        : "bg-[#FFF8F0] text-[#7A4526] ring-1 ring-[#EFE0CC]"
                    }`}
                  >
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─────────── BODY ─────────── */}
        {orders.length > 0 ? (
          <>
            {/* ── ACTIVE ── */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-[#A24E22] ring-1 ring-[#F4D4B3]/60">
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
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#C96C3A]">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
                      />
                      Aktif Siparişler
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                      Mutfakta
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] px-3 py-1.5 text-xs font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(166,76,30,0.55)]">
                  {activeOrders.length} aktif
                </span>
              </div>

              {activeOrders.length > 0 ? (
                <div className="grid gap-3 sm:gap-4">
                  {activeOrders.map((order: any) =>
                    renderOrderCard(order, false)
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#E7C4A6] bg-gradient-to-br from-white to-[#FCF8F3] px-6 py-12 text-center shadow-[0_2px_12px_rgba(120,72,36,0.04)]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-60 blur-3xl"
                  />
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60">
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                      <path
                        d="M5 12.5l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="relative mt-4 text-base font-bold text-[#2B1E16] sm:text-lg">
                    Tüm siparişler tamamlandı
                  </p>
                  <p className="relative mx-auto mt-1 max-w-xs text-xs text-[#7A6355]">
                    Şu anda mutfakta bekleyen sipariş yok. Yeni siparişler
                    geldikçe burada görünecek.
                  </p>
                </div>
              )}
            </section>

            {/* ── HISTORY ── */}
            {historyOrders.length > 0 && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-[#9B7E6A]"
                        />
                        Geçmiş
                      </p>
                      <h2 className="text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                        Sipariş geçmişi
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-[#EFE4D6] px-3 py-1.5 text-xs font-bold text-[#6E5A4A]">
                    {historyOrders.length} sipariş
                  </span>
                </div>

                <div className="grid gap-3 sm:gap-4">
                  {historyOrders.map((order: any) =>
                    renderOrderCard(order, true)
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          // ── EMPTY ──
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#E7C4A6] bg-gradient-to-br from-white to-[#FCF8F3] p-8 text-center shadow-[0_8px_24px_-12px_rgba(120,72,36,0.1)] sm:p-14">
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
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-9 w-9 text-[#C96C3A]"
                aria-hidden="true"
              >
                <path d="M3 7h18l-1.5 11a2 2 0 0 1-2 1.7H6.5A2 2 0 0 1 4.5 18L3 7z" />
                <path d="M8 7V5a4 4 0 0 1 8 0v2" />
              </svg>
            </div>
            <p className="relative mt-6 text-xl font-bold tracking-tight text-[#5A3A27] sm:text-2xl">
              Henüz sipariş yok
            </p>
            <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A6355]">
              Müşterilerin ilk siparişi geldiğinde burada listelenecek.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─────────── Stat Tile ─────────── */
function StatTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: "amber" | "sky" | "violet" | "green";
  icon: React.ReactNode;
}) {
  const toneMap = {
    amber: {
      iconBg:
        "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 ring-amber-200/70",
      value: "text-amber-700",
      hoverShadow:
        "hover:shadow-[0_14px_28px_-14px_rgba(245,158,11,0.35)]",
    },
    sky: {
      iconBg:
        "bg-gradient-to-br from-sky-50 to-sky-100 text-sky-700 ring-sky-200/70",
      value: "text-sky-700",
      hoverShadow: "hover:shadow-[0_14px_28px_-14px_rgba(14,165,233,0.35)]",
    },
    violet: {
      iconBg:
        "bg-gradient-to-br from-violet-50 to-violet-100 text-violet-700 ring-violet-200/70",
      value: "text-violet-700",
      hoverShadow:
        "hover:shadow-[0_14px_28px_-14px_rgba(139,92,246,0.35)]",
    },
    green: {
      iconBg:
        "bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-[#C9D9C6]/60",
      value: "text-[#48634C]",
      hoverShadow: "hover:shadow-[0_14px_28px_-14px_rgba(72,99,76,0.3)]",
    },
  };
  const t = toneMap[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[#EFE0CC] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 ${t.hoverShadow} sm:px-5 sm:py-4`}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${t.iconBg}`}>
          {icon}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B7E6A]">
          {label}
        </p>
      </div>
      <p className={`mt-2.5 text-2xl font-extrabold tracking-tight sm:text-[2rem] ${t.value}`}>
        {value}
      </p>
    </div>
  );
}