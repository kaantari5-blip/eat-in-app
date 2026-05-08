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

  const categories = [
    { key: null as string | null, label: "Tümü", icon: "🧺", href: "/" },
    { key: "tatli", label: "Tatlı", icon: "🍰", href: "/?category=tatli" },
    { key: "firin", label: "Fırın", icon: "🥐", href: "/?category=firin" },
    { key: "icecek", label: "İçecek", icon: "☕", href: "/?category=icecek" },
    { key: "karisik", label: "Karışık", icon: "🎁", href: "/?category=karisik" },
  ];

  return (
    <main className="min-h-screen bg-[#FBF6EF] text-[#2B1E16] antialiased selection:bg-[#FFD9B8] selection:text-[#5A3A27]">
      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative">
        {/* ambient gradient mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[640px] overflow-hidden"
        >
          <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#FFD0A5] to-transparent opacity-70 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[24rem] w-[24rem] rounded-full bg-gradient-to-br from-[#FFEFD9] to-transparent opacity-80 blur-3xl" />
          <div className="absolute left-1/3 top-40 h-[18rem] w-[18rem] rounded-full bg-[#F8E5CF]/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:pt-16">
          {/* brand row */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition active:translate-y-px"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_8px_20px_-8px_rgba(166,76,30,0.55)] ring-1 ring-white/40 transition group-hover:scale-[1.04]">
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
              </span>
              <span className="text-[15px] font-bold tracking-tight text-[#2B1E16]">
                Eat<span className="text-[#C96C3A]">In</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/giris"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#5A3A27] transition hover:bg-white/70 sm:inline-flex"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2B1E16] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A281E] active:translate-y-px"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>

          {/* headline */}
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.2fr_0.8fr] md:gap-14 lg:mt-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A5B3D] shadow-sm backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
                </span>
                Eat In · Canlı
              </span>

              <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.02] tracking-[-0.025em] text-[#2B1E16] sm:text-[3.5rem] lg:text-[4.25rem]">
                Yakınındaki{" "}
                <span className="relative inline-block">
                  <span className="relative bg-gradient-to-br from-[#D67742] via-[#C96C3A] to-[#7A4526] bg-clip-text text-transparent">
                    sürpriz kutuları
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    className="absolute -bottom-1 left-0 h-2 w-full text-[#F0B886]/70 sm:-bottom-2 sm:h-3"
                    fill="none"
                  >
                    <path
                      d="M2 8 C 60 2, 140 2, 198 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                keşfet.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#6B5B4D] sm:text-lg">
                Kafe, pastane ve fırınların gün sonunda kalan ürünlerini daha
                uygun fiyatla keşfet. İsrafı azalt, lezzeti kaçırma.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/kayit"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition hover:shadow-[0_16px_30px_-10px_rgba(166,76,30,0.7)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] active:translate-y-px"
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
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="#kutular"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#E7D4C4] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#5A3A27] backdrop-blur transition hover:border-[#D9B79C] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] active:translate-y-px"
                >
                  Kutuları Gör
                </Link>
              </div>

              {/* trust strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#7B6657]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="h-7 w-7 rounded-full border-2 border-[#FBF6EF] bg-gradient-to-br from-[#FFD9B8] to-[#F0B886]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#FBF6EF] bg-gradient-to-br from-[#F4D4B3] to-[#D9A074]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#FBF6EF] bg-gradient-to-br from-[#E8C7A4] to-[#B88858]" />
                  </div>
                  <span className="font-medium text-[#5A3A27]">12k+ kullanıcı</span>
                </div>
                <span className="hidden h-4 w-px bg-[#E7D4C4] sm:block" />
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-[#E8A845]">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium text-[#5A3A27]">4.8</span>
                  <span className="text-[#9B7E6A]">(2.3k yorum)</span>
                </div>
              </div>
            </div>

            {/* ── floating "how it works" card ── */}
            <div className="relative md:self-end">
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-br from-white/60 to-[#FFE8C9]/30 blur-2xl" />
              <div className="relative rounded-3xl border border-[#EFE4D6] bg-white/90 p-5 shadow-[0_24px_50px_-24px_rgba(120,72,36,0.18)] backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9B7E6A]">
                      Nasıl çalışır?
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-[#2B1E16]">
                      3 adımda kutunu al
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-[#C96C3A] shadow-inner ring-1 ring-[#F4D4B3]/50">
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

                <ol className="mt-5 space-y-1.5">
                  {[
                    {
                      n: 1,
                      title: "İşletme kutu oluşturur",
                      desc: "Gün sonunda kalan ürünler sürpriz kutu olarak listelenir.",
                      bg: "from-[#D67742] to-[#A24E22]",
                    },
                    {
                      n: 2,
                      title: "Müşteri kutuyu seçer",
                      desc: "Uygun fiyatlı kutuyu seçer ve ayırtır.",
                      bg: "from-[#8A5B3D] to-[#5A3A27]",
                    },
                    {
                      n: 3,
                      title: "Teslim alınır",
                      desc: "Belirtilen saat aralığında işletmeden teslim alınır.",
                      bg: "from-[#6E8A6E] to-[#48634C]",
                    },
                  ].map((s) => (
                    <li
                      key={s.n}
                      className="group flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-[#FCF8F3]"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${s.bg} text-xs font-bold text-white shadow-sm transition group-hover:scale-105`}
                      >
                        {s.n}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-semibold text-[#2B1E16]">
                          {s.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-[#7B6657]">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* mini-stats inside card */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#EFE4D6] pt-4">
                  <div>
                    <p className="text-base font-bold text-[#7A4526]">%60+</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                      indirim
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#7A4526]">Aynı gün</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                      teslim
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#48634C]">−1.2k</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B7E6A]">
                      kg israf
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── prominent search bar ── */}
          <div className="mt-10 sm:mt-14">
            <form
              action="/"
              className="group relative flex flex-col gap-2 rounded-2xl border border-[#EFE0CC] bg-white p-2 shadow-[0_18px_40px_-20px_rgba(120,72,36,0.25)] transition focus-within:shadow-[0_22px_50px_-18px_rgba(120,72,36,0.32)] sm:flex-row sm:items-stretch sm:rounded-full sm:p-1.5 sm:pl-2"
            >
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C96C3A]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Restoran, fırın veya kutu ara..."
                  className="w-full rounded-xl bg-transparent px-4 py-3.5 pl-12 text-[15px] text-[#2B1E16] outline-none placeholder:text-[#A8937F] sm:rounded-full sm:py-3"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-1.5">
                {hasFilters && (
                  <Link
                    href="/"
                    aria-label="Filtreleri temizle"
                    className="inline-flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-medium text-[#7A6657] transition hover:bg-[#FCF8F3] hover:text-[#2B1E16] sm:rounded-full sm:px-4"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="hidden sm:inline">Temizle</span>
                  </Link>
                )}
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px sm:flex-none sm:rounded-full sm:py-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:hidden"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Ara
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ─────────────────── CATEGORIES ─────────────────── */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8A5B3D]">
            Kategoriler
          </h2>
          {!isAllActive && (
            <Link
              href="/"
              className="text-xs font-semibold text-[#C96C3A] underline-offset-4 transition hover:underline"
            >
              Tümünü göster
            </Link>
          )}
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => {
            const active = c.key === null ? isAllActive : params.category === c.key;
            return (
              <Link
                key={c.label}
                href={c.href}
                className={`group flex min-w-[6.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border px-4 py-3 transition active:translate-y-px ${
                  active
                    ? "border-transparent bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_10px_24px_-10px_rgba(166,76,30,0.55)]"
                    : "border-[#EFE0CC] bg-white text-[#5A3A27] shadow-[0_2px_10px_rgba(120,72,36,0.04)] hover:-translate-y-0.5 hover:border-[#E7C4A6] hover:shadow-[0_10px_22px_-12px_rgba(120,72,36,0.2)]"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xl transition group-hover:scale-110 ${
                    active
                      ? "bg-white/20 ring-1 ring-white/30"
                      : "bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] ring-1 ring-[#F4D4B3]/60"
                  }`}
                  aria-hidden="true"
                >
                  {c.icon}
                </span>
                <span
                  className={`text-xs font-semibold tracking-tight ${
                    active ? "text-white" : "text-[#5A3A27]"
                  }`}
                >
                  {c.label}
                </span>
              </Link>
            );
          })}

          <span aria-hidden="true" className="mx-1 hidden h-[72px] w-px self-center bg-[#EFE0CC] sm:block" />

          <Link
            href="/?max=100"
            className={`group flex min-w-[6.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border px-4 py-3 transition active:translate-y-px ${
              params.max === "100"
                ? "border-transparent bg-gradient-to-br from-[#48634C] to-[#2F4632] text-white shadow-[0_10px_24px_-10px_rgba(72,99,76,0.55)]"
                : "border-[#DDE8D9] bg-white text-[#48634C] shadow-[0_2px_10px_rgba(72,99,76,0.05)] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-12px_rgba(72,99,76,0.2)]"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold transition group-hover:scale-110 ${
                params.max === "100"
                  ? "bg-white/20 ring-1 ring-white/30"
                  : "bg-gradient-to-br from-[#F2F7F0] to-[#DDE8D9] ring-1 ring-[#C9D9C6]/60"
              }`}
              aria-hidden="true"
            >
              ₺
            </span>
            <span className="text-xs font-semibold tracking-tight">100₺ altı</span>
          </Link>
        </div>
      </section>

      {/* ─────────────────── GRID ─────────────────── */}
      <section
        id="kutular"
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C96C3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
              Sürpriz Kutular
            </p>
            <h2 className="mt-1.5 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-[#2B1E16] sm:text-[2.25rem]">
              Bugünün fırsatları
            </h2>
            <p className="mt-1.5 text-sm text-[#7A6657] sm:text-[15px]">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D4C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#7A4526] transition hover:-translate-y-0.5 hover:border-[#D9B79C] hover:bg-[#FFF8F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30"
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {packages.length > 0 ? (
            packages.map((p: any) => (
              <div
                key={p.id}
                className="group relative transition duration-300 ease-out hover:-translate-y-1"
              >
                <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-[#FFE3C2]/0 to-[#FFE3C2]/0 opacity-0 blur-xl transition group-hover:from-[#FFE3C2]/40 group-hover:to-[#F0B886]/30 group-hover:opacity-100" />
                <PackageCard p={p} />
              </div>
            ))
          ) : (
            <div className="col-span-full overflow-hidden rounded-3xl border border-dashed border-[#E7D4C4] bg-gradient-to-br from-white to-[#FCF8F3] p-10 text-center shadow-[0_2px_12px_rgba(120,72,36,0.04)] sm:p-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-4xl shadow-inner ring-1 ring-[#F4D4B3]/50">
                🥐
              </div>
              <p className="mt-6 text-xl font-bold tracking-tight text-[#5A3A27] sm:text-2xl">
                Sonuç bulunamadı
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#8A7768]">
                Aradığın kriterlere uygun kutu yok. Filtreleri değiştirip tekrar
                deneyebilirsin.
              </p>
              {hasFilters && (
                <Link
                  href="/"
                  className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(166,76,30,0.6)] ring-1 ring-white/30 transition hover:shadow-[0_14px_28px_-10px_rgba(166,76,30,0.7)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
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
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
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

      {/* ─────────────────── BUSINESS CTA ─────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2B1810] via-[#7A4526] to-[#C96C3A] text-white shadow-[0_30px_60px_-24px_rgba(120,72,36,0.45)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F4CDAA]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:18px_18px]"
          />

          <div className="relative grid gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-12 md:px-12 md:py-16">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur">
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
              <h2 className="mt-4 text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
                Gün sonu ürünlerini{" "}
                <span className="bg-gradient-to-r from-[#FFE3C2] to-[#FFD0A5] bg-clip-text text-transparent">
                  gelire
                </span>{" "}
                dönüştür.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Kalan ürünlerini sürpriz kutu olarak listele, israfı azaltırken
                yeni müşterilere ulaş.
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                {[
                  "Komisyonsuz başlangıç",
                  "Kolay kurulum",
                  "Yeni müşteriler",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/95 ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-white/15"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/kayit"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#6C3E22] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.4)] ring-1 ring-white/40 transition hover:shadow-[0_22px_36px_-12px_rgba(0,0,0,0.5)] hover:brightness-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7A4526] active:translate-y-px"
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
                <p className="text-xs text-white/70">Dakikalar içinde yayında.</p>
              </div>
            </div>

            {/* mock dashboard tile */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
              <div className="relative rotate-[-1.5deg] rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-md transition hover:rotate-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      Bu hafta
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      ₺ 4.820
                    </p>
                    <p className="mt-0.5 text-xs text-white/70">
                      kutu satışından
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#A8D5A8]/30 px-2.5 py-1 text-xs font-semibold text-[#E0F3E0] ring-1 ring-inset ring-white/20">
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
                      <path d="m6 9 6-6 6 6" />
                      <path d="M12 3v18" />
                    </svg>
                    +18%
                  </span>
                </div>
                <div className="mt-5 flex items-end gap-1.5">
                  {[40, 65, 50, 78, 60, 85, 95].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#FFD0A5]/40 to-[#FFE3C2]/80"
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-white/60">
                  <span>Pzt</span>
                  <span>Sal</span>
                  <span>Çar</span>
                  <span>Per</span>
                  <span>Cum</span>
                  <span>Cmt</span>
                  <span>Paz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}