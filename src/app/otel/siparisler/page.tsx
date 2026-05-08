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
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "ready":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "ready":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

function getAccentBar(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-400";
    case "confirmed":
      return "bg-blue-400";
    case "ready":
      return "bg-purple-400";
    case "delivered":
      return "bg-green-400";
    case "cancelled":
      return "bg-red-400";
    default:
      return "bg-gray-300";
  }
}

function timeAgo(dateString: string) {
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

  const renderOrderCard = (order: any, isHistory: boolean = false) => {
    const pkg = packageMap.get(order.package_id);
    const shortId =
      order.id?.toString().replace(/-/g, "").slice(0, 6).toUpperCase() ?? "";
    const customerName = "Müşteri";
    const initial = customerName.toString().trim().charAt(0).toUpperCase() || "?";

    return (
      <article
        key={order.id}
        className={`new-order-glow group relative overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-0.5 ${
          isHistory
            ? "border-[#EFE4D6] shadow-sm hover:shadow-md"
            : "border-[#E7D4C4] shadow-[0_2px_8px_rgba(120,72,36,0.04)] hover:border-[#D9B79C] hover:shadow-[0_8px_24px_rgba(120,72,36,0.08)]"
        }`}
      >
        <span
          className={`absolute inset-y-0 left-0 w-[3px] ${getAccentBar(
            order.status
          )}`}
          aria-hidden="true"
        />

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FCF8F3] px-2 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#7A4526]">
              #{shortId}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusClass(
                order.status
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                  order.status
                )}`}
              />
              {translateStatus(order.status)}
            </span>

            <div className="inline-flex rounded-2xl bg-[#FFF8F0] px-4 py-2">
              <span className="text-xs text-[#8A7768]">Teslim Kodu:</span>
              <span className="ml-2 text-xs font-bold tracking-widest text-[#C96C3A]">
                {order.pickup_code ?? "------"}
              </span>
            </div>

            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9B7E6A]">
              {timeAgo(order.created_at)}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[1.05rem] font-bold tracking-tight text-[#2B1E16] sm:text-lg">
                {pkg?.title ?? "Kutu"}
              </h3>

              {pkg?.hotel_name && (
                <p className="mt-0.5 text-xs text-[#8A7768]">
                  {pkg.hotel_name}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE8C9] to-[#F4D4B3] text-[11px] font-bold text-[#7A4526]">
                    {initial}
                  </span>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                      Müşteri
                    </p>
                    <p className="text-sm font-semibold text-[#2B1E16]">
                      {customerName}
                    </p>
                  </div>
                </div>

                {pkg?.pickup_start && pkg?.pickup_end && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                      Teslim
                    </p>
                    <p className="text-sm font-semibold text-[#2B1E16]">
                      {pkg.pickup_start} – {pkg.pickup_end}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {pkg?.price !== undefined && pkg?.price !== null && (
              <div className="shrink-0 rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E6] px-4 py-2.5 text-right ring-1 ring-inset ring-[#EADBCB]">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                  Tutar
                </p>
                <p className="text-xl font-bold leading-none text-[#7A4526]">
                  {pkg.price}₺
                </p>
              </div>
            )}
          </div>

          {!isHistory && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-[#E7D4C4] pt-4">
              {order.status === "pending" && (
                <form
                  action={updateOrderStatus.bind(null, order.id, "confirmed")}
                  className="flex-1 sm:flex-initial"
                >
                  <SubmitButton
                    pendingText="Güncelleniyor..."
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-4 py-2 text-sm font-semibold text-white sm:w-auto"
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
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 sm:w-auto"
                  >
                    Hazır Yap
                  </SubmitButton>
                </form>
              )}

              {order.status !== "delivered" &&
                order.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/otel/scan?code=${order.pickup_code}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#C96C3A] bg-[#FFF3E6] px-4 py-2 text-sm font-semibold text-[#C96C3A]"
                    >
                      📷 Kodu Aç
                    </Link>

                    <QuickDeliverButton pickupCode={order.pickup_code} />

                    <form
                      action={updateOrderStatus.bind(null, order.id, "delivered")}
                      className="flex-1 sm:flex-initial"
                    >
                      <SubmitButton
                        pendingText="Güncelleniyor..."
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 sm:w-auto"
                      >
                        Teslim Edildi
                      </SubmitButton>
                    </form>
                  </div>
                )}

              {order.status !== "delivered" &&
                order.status !== "cancelled" && (
                  <form
                    action={updateOrderStatus.bind(null, order.id, "cancelled")}
                    className="ml-auto"
                  >
                    <SubmitButton
                      pendingText="İptal ediliyor..."
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
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
    <main className="min-h-screen bg-[#FCF8F3] px-4 py-6 text-[#2B1E16] sm:px-6 sm:py-10">
      <NewOrderHighlighter />

      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <div className="rounded-xl border bg-white p-3 text-xs text-red-600">
  DEBUG: myPackageIds: {myPackageIds.length} | orders: {orders.length} | filtered: {filteredOrders.length}
</div>
        <Link
          href="/otel"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#9B7E6A] transition hover:text-[#C96C3A]"
        >
          ← Panele dön
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-[#EFE4D6] bg-white p-6 shadow-[0_2px_12px_rgba(120,72,36,0.04)] sm:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <Link
              href="/otel/siparisler"
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Tümü
            </Link>
            <Link
              href="/otel/siparisler?status=pending"
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Bekleyen
            </Link>
            <Link
              href="/otel/siparisler?status=confirmed"
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Onaylı
            </Link>
            <Link
              href="/otel/siparisler?status=ready"
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Hazır
            </Link>
            <Link
              href="/otel/siparisler?status=delivered"
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Teslim
            </Link>
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                Canlı sipariş paneli
              </span>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#2B1E16] sm:text-3xl lg:text-[2rem]">
                  Gelen Siparişler
                </h1>
                <AutoRefreshOrders />
              </div>

              <p className="mt-1 max-w-md text-sm text-[#6B5B4D]">
                Mutfak ve teslimat akışını buradan yönet.
              </p>
            </div>

            {totalOrders > 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50/60 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-800">
                    Bekleyen
                  </p>
                  <p className="mt-1 text-2xl font-bold text-yellow-700">
                    {pendingCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-800">
                    Onaylı
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {confirmedCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-800">
                    Hazır
                  </p>
                  <p className="mt-1 text-2xl font-bold text-purple-700">
                    {readyCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50/60 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-green-800">
                    Teslim
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-700">
                    {deliveredCount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {orders.length > 0 ? (
          <>
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C96C3A]">
                    Aktif siparişler
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                    Mutfakta
                  </h2>
                </div>

                <span className="rounded-full border border-[#E7D4C4] bg-white px-3 py-1 text-xs font-semibold text-[#7A4526] shadow-sm">
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
                <div className="rounded-2xl border border-dashed border-[#E7D4C4] bg-white/60 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-[#5A3A27]">
                    Tüm siparişler tamamlandı
                  </p>
                  <p className="mt-1 text-xs text-[#8A7768]">
                    Şu anda mutfakta bekleyen sipariş yok.
                  </p>
                </div>
              )}
            </section>

            {historyOrders.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                      Geçmiş
                    </p>
                    <h2 className="mt-1.5 text-xl font-bold tracking-tight text-[#2B1E16] sm:text-2xl">
                      Sipariş geçmişi
                    </h2>
                  </div>

                  <span className="rounded-full border border-[#E7D4C4] bg-white px-3 py-1 text-xs font-semibold text-[#6B5B4D] shadow-sm">
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
          <div className="rounded-3xl border border-[#EFE4D6] bg-white p-8 text-center shadow-sm sm:p-14">
            <p className="text-xl font-bold text-[#2B1E16] sm:text-2xl">
              Henüz sipariş yok
            </p>
            <p className="mt-2 text-sm text-[#8A7768]">
              Müşterilerin ilk siparişi geldiğinde burada listelenecek.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}