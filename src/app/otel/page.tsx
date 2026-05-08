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

function getStockBadge(quantity: number) {
  if (quantity <= 0) {
    return {
      text: "Tükendi",
      className: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/70",
      dot: "bg-red-500",
    };
  }

  if (quantity <= 3) {
    return {
      text: "Az stok",
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70",
      dot: "bg-amber-500",
    };
  }

  return {
    text: "Stokta",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70",
    dot: "bg-emerald-500",
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

  const priceMap = new Map((packages ?? []).map((p: any) => [p.id, p.price]));

  totalRevenue =
    deliveredOrders?.reduce((sum: number, order: any) => {
      return sum + Number(priceMap.get(order.package_id) ?? 0);
    }, 0) ?? 0;

  // BUGÜN
  const todayOrders = (deliveredOrders ?? []).filter((o: any) => {
    return new Date(o.created_at) >= today;
  });

  todaySales = todayOrders.length;

  todayRevenue =
    todayOrders.reduce((sum: number, order: any) => {
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

    const priceMap = new Map((packages ?? []).map((p: any) => [p.id, p.price]));

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

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-4 py-6 text-[#2B1E16] sm:px-6 sm:py-10">
      <ToastMessage message={params.success ?? ""} />

      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        {/* Hero / Header */}
        <section className="relative overflow-hidden rounded-[1.5rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-6 shadow-[0_10px_40px_rgba(120,72,36,0.08)] sm:rounded-[2rem] sm:p-8 lg:p-10">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F4D4B3]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#FFE8C9]/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D4C4] bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9B7E6A] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                İşletme hesabı
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                İşletme Paneli
              </h1>
              <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-sm text-[#6B5B4D] ring-1 ring-inset ring-[#E7D4C4]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 shrink-0 text-[#9B7E6A]"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{user.email}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
  href="/otel/scan"
  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#48634C] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#48634C]/20 transition hover:bg-[#3E5442] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48634C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
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
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C96C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#C96C3A]/20 transition hover:bg-[#B85E2E] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Sürpriz Kutu Ekle
              </Link>

              <Link
                href="/otel/siparisler"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D9B79C] bg-white/80 px-5 py-3 text-sm font-semibold text-[#5A3A27] backdrop-blur transition hover:bg-[#FFF4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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

  {/* Stats */}
<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
  <div className="rounded-[1.5rem] border border-[#E8D7C7] bg-[#FFFDF9] p-5 shadow">
    <p className="text-xs font-medium uppercase tracking-wider text-[#8A7768]">
      Toplam kutu
    </p>
    <p className="mt-3 text-3xl font-bold">{totalPackages}</p>
    <p className="mt-1 text-xs text-[#A08B7C]">tüm zamanlar</p>
  </div>

  <div className="rounded-[1.5rem] border border-[#E8D7C7] bg-[#FFF3E6] p-5 shadow">
    <p className="text-xs font-medium uppercase tracking-wider text-[#8A7768]">
      Aktif kutular
    </p>
    <p className="mt-3 text-3xl font-bold text-[#7A4526]">
      {activePackages}
    </p>
    <p className="mt-1 text-xs text-[#A08B7C]">satışa hazır</p>
  </div>

  <div className="rounded-[1.5rem] border border-[#E8D7C7] bg-white p-5 shadow">
    <p className="text-xs font-medium uppercase tracking-wider text-[#8A7768]">
      Toplam satış
    </p>
    <p className="mt-3 text-3xl font-bold">{totalSales}</p>
    <p className="mt-1 text-xs text-[#A08B7C]">teslim edilen</p>
  </div>

  <div className="rounded-[1.5rem] border border-[#D6E4D3] bg-[#EEF5ED] p-5 shadow">
    <p className="text-xs font-medium uppercase tracking-wider text-[#6E7A70]">
      Toplam gelir
    </p>
    <p className="mt-3 text-3xl font-bold text-[#48634C]">
      {totalRevenue}₺
    </p>
    <p className="mt-1 text-xs text-[#7A8A7C]">teslim edilenlerden</p>
  </div>

 <div className="rounded-[1.5rem] border border-[#E8D7C7] bg-white p-5 shadow">
  <p className="text-xs font-medium uppercase tracking-wider text-[#8A7768]">
    Bugünkü satış
  </p>
  <p className="mt-3 text-3xl font-bold">
    {todaySales ?? 0}
  </p>
  <p className="mt-1 text-xs text-[#A08B7C]">bugün</p>
</div>

<div className="rounded-[1.5rem] border border-[#D6E4D3] bg-[#EEF5ED] p-5 shadow">
  <p className="text-xs font-medium uppercase tracking-wider text-[#6E7A70]">
    Bugünkü gelir
  </p>
  <p className="mt-3 text-3xl font-bold text-[#48634C]">
    {(todayRevenue ?? 0)}₺
  </p>
  <p className="mt-1 text-xs text-[#7A8A7C]">bugün</p>
</div>

  <div className="rounded-[1.5rem] border border-[#D6E4D3] bg-[#E2EEDF] p-5 shadow">
    <p className="text-xs font-medium uppercase tracking-wider text-[#6E7A70]">
      Panel durumu
    </p>
    <p className="mt-3 text-2xl font-semibold text-[#48634C]">Hazır</p>
    <p className="mt-1 text-xs text-[#7A8A7C]">tüm sistemler çevrimiçi</p>
  </div>
</section>

<SalesChart data={last7Days} />

        {/* Packages */}
        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9B7E6A]">
                Kutular
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Benim Kutularım
              </h2>
            </div>
            {packages && packages.length > 0 && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E7D4C4] bg-white/70 px-3 py-1 text-xs font-medium text-[#6B5B4D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                {totalPackages} kutu listeleniyor
              </span>
            )}
          </div>

          {packages && packages.length > 0 ? (
            <div className="grid gap-4 sm:gap-5">
              {packages.map((pkg: any) => {
                const stockBadge = getStockBadge(pkg.quantity ?? 0);

                return (
                  <article
  key={pkg.id}
  className="group relative overflow-hidden rounded-[1.75rem] border border-[#E8D7C7] bg-[#FFFDF9] p-4 shadow-[0_8px_30px_rgba(120,72,36,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#D9B79C] hover:shadow-[0_14px_36px_rgba(120,72,36,0.12)] sm:p-5"
>
  <span
    className={`absolute inset-y-0 left-0 w-1 ${
      pkg.is_active ? "bg-[#C96C3A]" : "bg-[#D9C7B6]"
    }`}
    aria-hidden="true"
  />

  <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
    <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[1.4rem] lg:h-auto lg:w-[42%]">
      <img
        src={pkg.image_url || "/placeholder.jpg"}
        alt={pkg.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 py-1 lg:py-4">
      <div>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8A7768]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
          </svg>
          {pkg.hotel_name}
        </p>

        <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#2B1E16] sm:text-3xl">
          {pkg.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7EEE4] px-3 py-1 text-xs font-medium text-[#7A5D49]">
          Teslim alma: {pkg.pickup_start} - {pkg.pickup_end}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF5ED] px-3 py-1 text-xs font-medium text-[#48634C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#48634C]" />
          {getCategoryLabel(pkg.category)}
        </span>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${stockBadge.className}`}
        >
          <span className={`h-2 w-2 rounded-full ${stockBadge.dot}`} />
          {stockBadge.text}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] px-3 py-1 text-xs font-medium text-[#7A4526]">
          Stok: {pkg.quantity ?? 0}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            pkg.is_active
              ? "bg-[#EEF5ED] text-[#48634C]"
              : "bg-[#F6EFE7] text-[#8A5B3D]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              pkg.is_active ? "bg-[#48634C]" : "bg-[#B58A6B]"
            }`}
          />
          {pkg.is_active ? "Aktif" : "Pasif"}
        </span>
      </div>

      <div className="hidden border-t border-[#EFE4D6] pt-5 text-sm leading-7 text-[#6B5B4D] lg:block">
        Gün sonunda değerlendirilecek ürünlerden hazırlanan sürpriz kutu.
      </div>
    </div>

    <div className="flex w-full flex-col justify-center gap-4 border-t border-dashed border-[#E8D7C7] pt-4 lg:w-[210px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <div className="text-left lg:text-right">
        <p className="text-sm text-[#A08B7C] line-through">
          {pkg.original_price}₺
        </p>
        <p className="text-4xl font-extrabold tracking-tight text-[#7A4526]">
          {pkg.price}₺
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-1">
        <Link
          href={`/otel/duzenle/${pkg.id}`}
          className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#D9B79C] bg-white px-4 py-3 text-sm font-semibold text-[#5A3A27] transition hover:bg-[#FFF4EA] lg:col-span-1"
        >
          Düzenle
        </Link>

        <form
          action={togglePackageStatus.bind(null, pkg.id, !pkg.is_active)}
          className="w-full"
        >
          <SubmitButton
            pendingText="Güncelleniyor..."
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              pkg.is_active
                ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {pkg.is_active ? "Pasife Al" : "Aktif Et"}
          </SubmitButton>
        </form>

        <form action={deletePackage.bind(null, pkg.id)} className="w-full">
          <SubmitButton
            pendingText="Siliniyor..."
            className="w-full rounded-2xl border border-[#F2C9C9] bg-white px-4 py-3 text-sm font-semibold text-[#C45A5A] transition hover:bg-[#FFF5F5]"
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
            <div className="relative overflow-hidden rounded-[1.5rem] border border-dashed border-[#D9B79C] bg-gradient-to-br from-white/80 to-[#FFF6EC]/80 p-8 text-center sm:p-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFE8C9]/40 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F4D4B3]/30 blur-2xl" />

              <div className="relative mx-auto flex max-w-md flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7D4C4] bg-white shadow-[0_8px_24px_rgba(120,72,36,0.08)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-[#C96C3A]"
                    aria-hidden="true"
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <p className="mt-5 text-lg font-semibold text-[#5A3A27] sm:text-xl">
                  Henüz eklenmiş bir sürpriz kutu yok
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#8A7768]">
                  İlk kutunu ekleyerek işletme panelini kullanmaya başlayabilirsin.
                </p>
                <Link
                  href="/otel/paket-ekle"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C96C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#C96C3A]/20 transition hover:bg-[#B85E2E] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] active:translate-y-px"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
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