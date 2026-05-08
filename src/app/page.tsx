import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PackageCard from "@/components/PackageCard";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{
    today?: string;
    max?: string;
    q?: string;
    category?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();

  let query = (supabase as any)
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .gt("quantity", 0)
    .order("created_at", { ascending: false });

  if (params.max) {
    query = query.lte("price", Number(params.max));
  }
  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,hotel_name.ilike.%${params.q}%`
    );
  }
  if (params.category) {
    query = query.eq("category", params.category);
  }

  const { data } = await query.limit(12);
  const packages: any[] = data ?? [];

  const hasFilters = Boolean(params.q || params.category || params.max);
  const isAllActive = !params.category && !params.max;

  const activePill =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#C96C3A]/25 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const idlePill =
    "inline-flex items-center gap-1.5 rounded-full border border-[#E7D4C4] bg-white px-3.5 py-2 text-sm font-medium text-[#5A3A27] transition hover:border-[#D9B79C] hover:bg-[#FFF8F3] hover:text-[#7A4526] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <main className="min-h-screen bg-[#FCF8F3] text-[#2B1E16]">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-6 sm:px-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#EFE4D6] bg-white shadow-[0_2px_12px_rgba(120,72,36,0.04)]">
          {/* decorative blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-gradient-to-br from-[#FFE8C9] to-[#F4D4B3] opacity-50 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#FFF3E6]/70 blur-3xl"
          />

          <div className="relative grid gap-10 px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-12 lg:gap-12">
            <div className="max-w-2xl">
              {/* Brand mark + eyebrow */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] text-white shadow-md shadow-[#C96C3A]/25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EFE4D6] bg-[#FCF8F3] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A5B3D]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                  </span>
                  Eat In · Canlı
                </span>
              </div>

              <h1 className="mt-6 text-[2rem] font-bold leading-[1.05] tracking-tight text-[#2B1E16] sm:text-5xl">
                Yakınındaki{" "}
                <span className="bg-gradient-to-br from-[#C96C3A] to-[#7A4526] bg-clip-text text-transparent">
                  sürpriz kutuları
                </span>{" "}
                keşfet.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#6B5B4D] sm:text-lg">
                Kafe, pastane ve fırınların gün sonunda kalan ürünlerini daha
                uygun fiyatla keşfet. İsrafı azalt, lezzeti kaçırma.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/kayit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#C96C3A]/25 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
                >
                  Hemen Başla
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/giris"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E7D4C4] bg-white px-5 py-3 text-sm font-semibold text-[#5A3A27] transition hover:bg-[#FFF8F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
                >
                  Giriş Yap
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-9 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-[#EFE4D6] bg-[#FCF8F3] px-3 py-3 sm:px-4">
                  <p className="text-xl font-bold text-[#7A4526] sm:text-2xl">%60+</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9B7E6A] sm:text-[11px]">
                    indirim
                  </p>
                </div>
                <div className="rounded-xl border border-[#EFE4D6] bg-[#FCF8F3] px-3 py-3 sm:px-4">
                  <p className="text-xl font-bold text-[#7A4526] sm:text-2xl">Aynı gün</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9B7E6A] sm:text-[11px]">
                    teslim
                  </p>
                </div>
                <div className="rounded-xl border border-[#DDE8D9] bg-[#F2F7F0] px-3 py-3 sm:px-4">
                  <p className="text-xl font-bold text-[#48634C] sm:text-2xl">−1.2k</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6E7A70] sm:text-[11px]">
                    kg israf
                  </p>
                </div>
              </div>
            </div>

            {/* 3-step card */}
            <div className="self-end">
              <div className="rounded-2xl border border-[#EFE4D6] bg-[#FCF8F3] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
                      Nasıl çalışır?
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-[#2B1E16]">
                      3 adımda kutunu al
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#C96C3A] shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                    </svg>
                  </span>
                </div>

                <ol className="mt-5 space-y-1">
                  <li className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C96C3A] text-xs font-bold text-white">
                      1
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-[#2B1E16]">
                        İşletme kutu oluşturur
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#7B6657]">
                        Gün sonunda kalan ürünler sürpriz kutu olarak listelenir.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7A4526] text-xs font-bold text-white">
                      2
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-[#2B1E16]">
                        Müşteri kutuyu seçer
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#7B6657]">
                        Uygun fiyatlı kutuyu seçer ve ayırtır.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#48634C] text-xs font-bold text-white">
                      3
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-[#2B1E16]">
                        Teslim alınır
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#7B6657]">
                        Belirtilen saat aralığında işletmeden teslim alınır.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative border-t border-[#EFE4D6] bg-[#FCF8F3]/50 px-6 py-5 md:px-10">
            <form
              action="/"
              className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7E6A]"
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="İşletme veya kutu ara..."
                  className="w-full rounded-xl border border-[#E7D4C4] bg-white px-4 py-3 pl-11 text-sm text-[#2B1E16] outline-none transition placeholder:text-[#A8937F] focus:border-[#C96C3A] focus:ring-2 focus:ring-[#C96C3A]/15"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#C96C3A]/25 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF8F3] active:translate-y-px"
              >
                Ara
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              {hasFilters && (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E7D4C4] bg-white px-4 py-3 text-sm font-semibold text-[#5A3A27] transition hover:bg-[#FFF8F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF8F3]"
                >
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
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  Temizle
                </Link>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#EFE4D6] bg-white p-3 shadow-[0_2px_8px_rgba(120,72,36,0.03)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A] sm:shrink-0">
              Filtrele
            </p>
            <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <Link href="/" className={`shrink-0 ${isAllActive ? activePill : idlePill}`}>
                <span aria-hidden="true">🧺</span>
                Tümü
              </Link>
              <Link
                href="/?category=tatli"
                className={`shrink-0 ${
                  params.category === "tatli" ? activePill : idlePill
                }`}
              >
                <span aria-hidden="true">🍰</span>
                Tatlı
              </Link>
              <Link
                href="/?category=firin"
                className={`shrink-0 ${
                  params.category === "firin" ? activePill : idlePill
                }`}
              >
                <span aria-hidden="true">🥐</span>
                Fırın
              </Link>
              <Link
                href="/?category=icecek"
                className={`shrink-0 ${
                  params.category === "icecek" ? activePill : idlePill
                }`}
              >
                <span aria-hidden="true">☕</span>
                İçecek
              </Link>
              <Link
                href="/?category=karisik"
                className={`shrink-0 ${
                  params.category === "karisik" ? activePill : idlePill
                }`}
              >
                <span aria-hidden="true">🎁</span>
                Karışık
              </Link>
              <span aria-hidden="true" className="mx-1 hidden h-9 w-px bg-[#EFE4D6] sm:block" />
              <Link
                href="/?max=100"
                className={`shrink-0 ${
                  params.max === "100" ? activePill : idlePill
                }`}
              >
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
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                100₺ altı
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C96C3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
              Sürpriz Kutular
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#2B1E16] sm:text-3xl">
              Bugünün fırsatları
            </h2>
            <p className="mt-1 text-sm text-[#7A6657]">
              Yakınında teslim alabileceğin güncel kutular.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE8D9] bg-[#F2F7F0] px-3 py-1.5 text-xs font-semibold text-[#48634C]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8B6E] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6B8B6E]" />
              </span>
              {packages.length} aktif kutu
            </span>
            {hasFilters && (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D4C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#7A4526] transition hover:bg-[#FFF8F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Filtreleri sıfırla
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {packages.length > 0 ? (
            packages.map((p: any) => <PackageCard key={p.id} p={p} />)
          ) : (
            <div className="col-span-full overflow-hidden rounded-2xl border border-dashed border-[#E7D4C4] bg-white p-10 text-center shadow-sm sm:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-3xl shadow-inner">
                🥐
              </div>
              <p className="mt-5 text-lg font-bold text-[#5A3A27] sm:text-xl">
                Sonuç bulunamadı
              </p>
              <p className="mt-1.5 text-sm text-[#8A7768]">
                Filtreleri değiştirip tekrar deneyebilirsin.
              </p>
              {hasFilters && (
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C96C3A]/25 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
                >
                  Tüm kutuları gör
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Business CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3B2215] via-[#7A4526] to-[#C96C3A] text-white shadow-[0_12px_32px_-12px_rgba(120,72,36,0.35)]">
          {/* decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#F4CDAA]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:18px_18px]"
          />

          <div className="relative flex flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                </svg>
                İşletmeler için
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                Gün sonu ürünlerini gelire dönüştür.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Kalan ürünlerini sürpriz kutu olarak listele, israfı azaltırken
                yeni müşterilere ulaş.
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {[
                  "Komisyonsuz başlangıç",
                  "Kolay kurulum",
                  "Yeni müşteriler",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-inset ring-white/15"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0">
              <Link
                href="/kayit"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#6C3E22] shadow-lg shadow-black/20 transition hover:bg-[#FFF3E6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7A4526] active:translate-y-px"
              >
                İşletme olarak katıl
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-2 text-center text-[11px] text-white/70">
                Dakikalar içinde yayında.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}