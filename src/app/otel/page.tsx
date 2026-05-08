import Link from "next/link";
import { deletePackage, togglePackageStatus } from "@/lib/actions/package";
import SubmitButton from "@/components/SubmitButton";
import ToastMessage from "@/components/ToastMessage";
import { requireHotelOwner } from "@/lib/auth/guards";
import SalesChart from "@/components/SalesChart";

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
      className: "bg-rose-50 text-rose-700 ring-rose-200/80",
      dot: "bg-rose-500",
    };
  }

  if (quantity <= 3) {
    return {
      text: "Az stok",
      className: "bg-amber-50 text-amber-700 ring-amber-200/80",
      dot: "bg-amber-500",
    };
  }

  return {
    text: "Stokta",
    className: "bg-[#F2F7F0] text-[#48634C] ring-[#DDE8D9]",
    dot: "bg-[#6B8B6E]",
  };
}

export default async function HotelPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const { supabase, user } = await requireHotelOwner();
  const params = (await searchParams) ?? {};

  const { data: packages } = await (supabase as any)
    .from("packages")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const totalPackages = packages?.length ?? 0;
  const activePackages =
    packages?.filter((pkg: any) => pkg.is_active && (pkg.quantity ?? 0) > 0)
      .length ?? 0;
  const packageIds = (packages ?? []).map((pkg: any) => pkg.id);

  let totalSales = 0;
  let totalRevenue = 0;
  let todaySales = 0;
  let todayRevenue = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (packageIds.length > 0) {
    const { data: deliveredOrders } = await (supabase as any)
      .from("orders")
      .select("package_id, created_at")
      .in("package_id", packageIds)
      .eq("status", "delivered");

    totalSales = deliveredOrders?.length ?? 0;

    const priceMap = new Map(
      (packages ?? []).map((p: any) => [p.id, p.price])
    );

    totalRevenue =
      deliveredOrders?.reduce((sum: number, order: any) => {
        return sum + Number(priceMap.get(order.package_id) ?? 0);
      }, 0) ?? 0;

    // BUGÜN
    const todayOrders = (deliveredOrders ?? []).filter((o: any) => {
      return new Date(o.created_at) >= today;
    });

    todaySales = todayOrders.length;

    todayRevenue = todayOrders.reduce((sum: number, order: any) => {
      return sum + Number(priceMap.get(order.package_id) ?? 0);
    }, 0);
  }

  const last7Days: {
    date: string;
    sales: number;
    revenue: number;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);

    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    let sales = 0;
    let revenue = 0;

    if (packageIds.length > 0) {
      const { data: dayOrders } = await (supabase as any)
        .from("orders")
        .select("package_id, created_at")
        .in("package_id", packageIds)
        .eq("status", "delivered")
        .gte("created_at", day.toISOString())
        .lt("created_at", nextDay.toISOString());

      sales = dayOrders?.length ?? 0;

      const priceMap = new Map(
        (packages ?? []).map((p: any) => [p.id, p.price])
      );

      revenue =
        dayOrders?.reduce((sum: number, order: any) => {
          return sum + Number(priceMap.get(order.package_id) ?? 0);
        }, 0) ?? 0;
    }

    last7Days.push({
      date: day.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      }),
      sales,
      revenue,
    });
  }

  const hotelInitial =
    (user.email ?? "")
      .toString()
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FBF6EF] text-[#2B1E16] antialiased">
      <ToastMessage message={params.success ?? ""} />

      {/* ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#F4D4B3] to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12">
        {/* ─────────── HERO ─────────── */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-6 shadow-[0_18px_40px_-20px_rgba(120,72,36,0.18)] sm:p-8 lg:p-10">
          {/* decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-[#FFF3E6]/60 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(166,76,30,0.5)_1px,transparent_1px)] [background-size:20px_20px]"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                  </span>
                  İşletme Hesabı
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2F7F0] px-3 py-1.5 text-[11px] font-semibold text-[#48634C] ring-1 ring-[#DDE8D9]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[#6B8B6E]"
                  />
                  Tüm sistemler çevrimiçi
                </span>
              </div>

              <h1 className="mt-5 text-[2.25rem] font-bold leading-[1.05] tracking-[-0.025em] text-[#2B1E16] sm:text-[2.75rem] lg:text-[3.25rem]">
                İşletme Paneli
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#6E5A4A]">
                Kutularını yönet, siparişleri takip et, gün sonu performansını
                tek panelden gör.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/80 px-2 py-1 backdrop-blur">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#A24E22] text-[11px] font-bold text-white shadow-sm">
                  {hotelInitial}
                </span>
                <span className="truncate pr-2 text-xs font-medium text-[#7A6355]">
                  {user.email}
                </span>
              </div>
            </div>

            {/* CTA cluster */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href="/otel/scan"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#6B8B6E] to-[#3E5442] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(72,99,76,0.6)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(72,99,76,0.75)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48634C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M7 12h10" />
                </svg>
                Sipariş Teslim Et
              </Link>

              <Link
                href="/otel/paket-ekle"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(166,76,30,0.78)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition group-hover:rotate-90"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Sürpriz Kutu Ekle
              </Link>

              <Link
                href="/otel/siparisler"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D4C4] bg-white/80 px-5 py-3 text-sm font-bold text-[#5A3A27] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C96C3A] hover:bg-white hover:text-[#C96C3A] hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Siparişleri Gör
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────── TODAY featured ─────────── */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-[#A24E22] ring-1 ring-[#F4D4B3]/60">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <h2 className="text-lg font-bold tracking-tight text-[#2B1E16] sm:text-xl">
              Bugün
            </h2>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#F2F7F0] px-2.5 py-1 text-[11px] font-semibold text-[#48634C] ring-1 ring-[#DDE8D9]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8B6E] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6B8B6E]" />
              </span>
              Canlı
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Today revenue */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#EFE0CC] bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF1E1] p-5 shadow-[0_8px_24px_-12px_rgba(120,72,36,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-14px_rgba(120,72,36,0.22)] sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-2xl"
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A24E22]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
                    />
                    Bugünkü Gelir
                  </p>
                  <p className="mt-3 bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-[2.75rem]">
                    {todayRevenue ?? 0}₺
                  </p>
                  <p className="mt-1 text-xs text-[#7A6355]">
                    teslim edilenlerden
                  </p>
                </div>
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_10px_22px_-8px_rgba(166,76,30,0.6)] ring-1 ring-white/30 transition group-hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Today sales */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#DDE8D9] bg-gradient-to-br from-white via-[#FFFDF9] to-[#F2F7F0] p-5 shadow-[0_8px_24px_-12px_rgba(72,99,76,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-14px_rgba(72,99,76,0.2)] sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-70 blur-2xl"
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#48634C]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[#6B8B6E]"
                    />
                    Bugünkü Satış
                  </p>
                  <p className="mt-3 bg-gradient-to-br from-[#48634C] to-[#2F4632] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-[2.75rem]">
                    {todaySales ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-[#5F7262]">
                    teslim edilen sipariş
                  </p>
                </div>
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B8B6E] to-[#3E5442] text-white shadow-[0_10px_22px_-8px_rgba(72,99,76,0.55)] ring-1 ring-white/30 transition group-hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── TOTAL stats ─────────── */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-1 ring-[#C9D9C6]/60">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M3 3v18h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="m7 14 4-4 4 4 5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="text-lg font-bold tracking-tight text-[#2B1E16] sm:text-xl">
              Toplam Performans
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <StatTile
              label="Toplam Gelir"
              value={`${totalRevenue}₺`}
              hint="tüm zamanlar"
              accent="orange"
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <StatTile
              label="Toplam Satış"
              value={`${totalSales}`}
              hint="teslim edilen"
              accent="neutral"
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
              label="Toplam Kutu"
              value={`${totalPackages}`}
              hint="listelenen"
              accent="neutral"
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
            <StatTile
              label="Aktif Kutular"
              value={`${activePackages}`}
              hint="satışa hazır"
              accent="green"
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
          </div>
        </section>

        {/* ─────────── CHART ─────────── */}
        <section className="overflow-hidden rounded-3xl border border-[#EFE0CC] bg-white p-5 shadow-[0_8px_24px_-12px_rgba(120,72,36,0.1)] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] ring-1 ring-[#F4D4B3]/60">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M3 3v18h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M7 14l3-3 3 3 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold tracking-tight text-[#2B1E16] sm:text-lg">
                Son 7 Gün
              </h2>
              <p className="text-xs text-[#7A6355]">
                Günlük satış ve gelir trendi
              </p>
            </div>
          </div>
          <SalesChart data={last7Days} />
        </section>

        {/* ─────────── PACKAGES ─────────── */}
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#C96C3A]">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
                />
                Kutular
              </p>
              <h2 className="mt-2 text-[1.75rem] font-bold tracking-[-0.02em] text-[#2B1E16] sm:text-[2.25rem]">
                Benim Kutularım
              </h2>
              <p className="mt-1.5 text-sm text-[#7A6355] sm:text-[15px]">
                Listelediğin sürpriz kutuları yönet ve düzenle.
              </p>
            </div>
            {packages && packages.length > 0 && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EFE0CC] bg-white px-3 py-1.5 text-xs font-semibold text-[#5A3A27] shadow-sm">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]"
                />
                {totalPackages} kutu listeleniyor
              </span>
            )}
          </div>

          {packages && packages.length > 0 ? (
            <div className="grid gap-4 sm:gap-5">
              {packages.map((pkg: any) => {
                const stockBadge = getStockBadge(pkg.quantity ?? 0);
                const discount =
                  pkg.original_price && Number(pkg.original_price) > 0
                    ? Math.round(
                        (1 - Number(pkg.price) / Number(pkg.original_price)) *
                          100
                      )
                    : 0;

                return (
                  <article
                    key={pkg.id}
                    className="group relative isolate overflow-hidden rounded-3xl border border-[#EFE0CC] bg-white p-4 shadow-[0_4px_18px_-8px_rgba(120,72,36,0.1)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_22px_44px_-18px_rgba(120,72,36,0.22)] sm:p-5"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-1.5 ${
                        pkg.is_active
                          ? "bg-gradient-to-b from-[#D67742] to-[#A24E22]"
                          : "bg-gradient-to-b from-[#D9C7B6] to-[#B58A6B]"
                      }`}
                    />

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
                      {/* IMAGE */}
                      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-2xl bg-[#FFF8F0] lg:aspect-auto lg:h-auto lg:w-[42%]">
                        <img
                          src={pkg.image_url || "/placeholder.jpg"}
                          alt={pkg.title}
                          className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 via-black/5 to-transparent"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
                        />

                        {/* discount sticker */}
                        {discount > 0 && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-2.5 py-1 text-white shadow-[0_10px_24px_-8px_rgba(166,76,30,0.7)] ring-1 ring-white/30">
                            <span className="text-[13px] font-extrabold leading-none tracking-tight">
                              −%{discount}
                            </span>
                          </div>
                        )}

                        {/* status sticker */}
                        <span
                          className={`pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-[0_6px_18px_-6px_rgba(43,30,22,0.35)] ring-1 backdrop-blur ${
                            pkg.is_active
                              ? "bg-white/95 text-[#48634C] ring-white/70"
                              : "bg-white/95 text-[#8A5B3D] ring-white/70"
                          }`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            {pkg.is_active && (
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8B6E] opacity-70" />
                            )}
                            <span
                              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                                pkg.is_active ? "bg-[#6B8B6E]" : "bg-[#B58A6B]"
                              }`}
                            />
                          </span>
                          {pkg.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 py-1 lg:py-3">
                        <div>
                          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A6355]">
                            <span
                              aria-hidden
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#A24E22] text-[9px] font-bold text-white shadow-sm"
                            >
                              {(pkg.hotel_name ?? "?")
                                .toString()
                                .trim()
                                .charAt(0)
                                .toUpperCase() || "?"}
                            </span>
                            {pkg.hotel_name}
                          </p>

                          <h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-[#2B1E16] transition-colors duration-200 group-hover:text-[#7A4526] sm:text-2xl">
                            {pkg.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F0] px-2.5 py-1 text-[11px] font-semibold text-[#7A4526] ring-1 ring-[#EFE0CC]">
                            <span aria-hidden>
                              {getCategoryEmoji(pkg.category)}
                            </span>
                            {getCategoryLabel(pkg.category)}
                          </span>

                          {(pkg.pickup_start || pkg.pickup_end) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCF8F3] px-2.5 py-1 text-[11px] font-medium text-[#6B5B4D] ring-1 ring-[#EFE4D6]">
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
                              {pkg.pickup_start} – {pkg.pickup_end}
                            </span>
                          )}

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${stockBadge.className}`}
                          >
                            <span
                              aria-hidden
                              className={`h-1.5 w-1.5 rounded-full ${stockBadge.dot}`}
                            />
                            {stockBadge.text}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] px-2.5 py-1 text-[11px] font-bold text-[#7A4526] ring-1 ring-[#F4D4B3]">
                            Stok: {pkg.quantity ?? 0}
                          </span>
                        </div>

                        <p className="hidden border-t border-dashed border-[#EFE4D6] pt-4 text-sm leading-6 text-[#6B5B4D] lg:block">
                          Gün sonunda değerlendirilecek ürünlerden hazırlanan
                          sürpriz kutu.
                        </p>
                      </div>

                      {/* PRICE + ACTIONS */}
                      <div className="flex w-full flex-col justify-center gap-4 border-t border-dashed border-[#EFE4D6] pt-4 lg:w-[220px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <div className="text-left lg:text-right">
                          {pkg.original_price &&
                            Number(pkg.original_price) > Number(pkg.price) && (
                              <p className="text-sm font-medium text-[#B8A593] line-through">
                                {pkg.original_price}₺
                              </p>
                            )}
                          <p className="bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                            {pkg.price}₺
                          </p>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-1">
                          <Link
                            href={`/otel/duzenle/${pkg.id}`}
                            className="group/btn col-span-2 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#E7D4C4] bg-white px-4 py-2.5 text-sm font-bold text-[#5A3A27] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF8F0] hover:text-[#C96C3A] hover:shadow-[0_8px_18px_-10px_rgba(201,108,58,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 active:translate-y-px lg:col-span-1"
                          >
                            <svg
                              aria-hidden
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-3.5 w-3.5"
                            >
                              <path
                                d="M12 20h9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Düzenle
                          </Link>

                          <form
                            action={togglePackageStatus.bind(
                              null,
                              pkg.id,
                              !pkg.is_active
                            )}
                            className="w-full"
                          >
                            <SubmitButton
                              pendingText="..."
                              className={`w-full rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-px ${
                                pkg.is_active
                                  ? "border border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 hover:shadow-[0_8px_18px_-10px_rgba(244,63,94,0.4)]"
                                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-[0_8px_18px_-10px_rgba(72,99,76,0.4)]"
                              }`}
                            >
                              {pkg.is_active ? "Pasife Al" : "Aktif Et"}
                            </SubmitButton>
                          </form>

                          <form
                            action={deletePackage.bind(null, pkg.id)}
                            className="w-full"
                          >
                            <SubmitButton
                              pendingText="..."
                              className="w-full rounded-2xl border border-[#F2C9C9] bg-white px-4 py-2.5 text-sm font-bold text-[#C45A5A] transition-all duration-200 hover:-translate-y-px hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_8px_18px_-10px_rgba(196,90,90,0.4)] active:translate-y-px"
                            >
                              Sil
                            </SubmitButton>
                          </form>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            // ─────────── EMPTY STATE ───────────
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#E7C4A6] bg-gradient-to-br from-white to-[#FCF8F3] p-8 text-center shadow-[0_8px_24px_-12px_rgba(120,72,36,0.1)] sm:p-14">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-60 blur-3xl"
              />

              <div className="relative mx-auto flex max-w-md flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFE3C2] to-[#F4D4B3] shadow-inner ring-1 ring-[#F4D4B3]/60">
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
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <p className="mt-6 text-xl font-bold tracking-tight text-[#5A3A27] sm:text-2xl">
                  Henüz eklenmiş bir sürpriz kutu yok
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A6355]">
                  İlk kutunu ekleyerek işletme panelini kullanmaya başlayabilirsin.
                </p>
                <Link
                  href="/otel/paket-ekle"
                  className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(166,76,30,0.78)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition group-hover:rotate-90"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  İlk Kutuyu Ekle
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ─────────── Stat tile helper ─────────── */
function StatTile({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "orange" | "green" | "neutral";
  icon: React.ReactNode;
}) {
  const accentMap = {
    orange: {
      iconBg:
        "bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] ring-[#F4D4B3]/60",
      value:
        "bg-gradient-to-br from-[#7A4526] to-[#3F2618] bg-clip-text text-transparent",
    },
    green: {
      iconBg:
        "bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] text-[#48634C] ring-[#C9D9C6]/60",
      value: "text-[#48634C]",
    },
    neutral: {
      iconBg:
        "bg-gradient-to-br from-[#FCF8F3] to-[#FFF8F0] text-[#7A6355] ring-[#EFE4D6]",
      value: "text-[#2B1E16]",
    },
  };
  const a = accentMap[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#EFE0CC] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(120,72,36,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(120,72,36,0.2)] sm:px-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${a.iconBg}`}
        >
          {icon}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B7E6A]">
          {label}
        </p>
      </div>
      <p
        className={`mt-3 text-3xl font-extrabold tracking-tight ${a.value} sm:text-[2rem]`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[#9B7E6A]">{hint}</p>
    </div>
  );
}