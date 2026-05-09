import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FBF6EF] px-4 py-10 text-[#2B1E16] antialiased sm:px-6">
      {/* ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#F4D4B3] to-transparent opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-[#FFF3E6]/60 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* halo glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-[#FFE3C2]/60 via-[#F4D4B3]/30 to-[#DDE8D9]/40 blur-2xl"
        />

        <div className="relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(120,72,36,0.28)] sm:p-8">
          {/* warm mesh accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-[#FFF3E6]/70 blur-2xl"
          />

          {/* ─── brand mark ─── */}
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] text-white shadow-[0_10px_22px_-8px_rgba(166,76,30,0.55)] ring-1 ring-white/40">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m3.3 7 8.7 5 8.7-5M12 22V12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-[15px] font-bold tracking-tight text-[#2B1E16]">
              Eat<span className="text-[#C96C3A]">In</span>
            </span>
          </div>

          {/* ─── header ─── */}
          <div className="relative mt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm backdrop-blur">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
              </span>
              Tekrar Hoş Geldin
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-[#2B1E16] sm:text-[2.25rem]">
              Giriş Yap
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6E5A4A]">
              Hesabına giriş yap ve yakındaki{" "}
              <span className="font-semibold text-[#7A4526]">
                sürpriz kutuları
              </span>{" "}
              keşfet.
            </p>
          </div>

          {/* ─── form ─── */}
          <form action={login} className="relative mt-7 space-y-4">
            {/* email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute -top-2 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-white px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]"
              >
                Email
              </label>
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C96C3A]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="ornek@eposta.com"
                className="w-full rounded-2xl border border-[#EFE0CC] bg-[#FCF8F3] px-4 py-3.5 pl-11 text-sm text-[#2B1E16] outline-none transition placeholder:text-[#C9B0A0] focus:border-[#C96C3A] focus:bg-white focus:ring-2 focus:ring-[#C96C3A]/20"
              />
            </div>

            {/* password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-white px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]"
              >
                Şifre
              </label>
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C96C3A]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#EFE0CC] bg-[#FCF8F3] px-4 py-3.5 pl-11 text-sm text-[#2B1E16] outline-none transition placeholder:text-[#C9B0A0] focus:border-[#C96C3A] focus:bg-white focus:ring-2 focus:ring-[#C96C3A]/20"
              />
            </div>

            {/* submit */}
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.05] hover:shadow-[0_18px_36px_-12px_rgba(166,76,30,0.78)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
            >
              Giriş Yap
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* ─── trust strip ─── */}
          <ul className="relative mt-5 flex items-center justify-center gap-4 text-[11px] font-medium text-[#7B6657]">
            <li className="inline-flex items-center gap-1.5">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-[#48634C]"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Güvenli bağlantı
            </li>
            <span aria-hidden className="h-3 w-px bg-[#EFE4D6]" />
            <li className="inline-flex items-center gap-1.5">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-[#C96C3A]"
              >
                <path
                  d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Saniyeler içinde
            </li>
          </ul>

          {/* ─── divider ─── */}
          <div className="relative my-6 flex items-center gap-3">
            <span aria-hidden className="h-px flex-1 bg-[#EFE4D6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
              Yeni misin?
            </span>
            <span aria-hidden className="h-px flex-1 bg-[#EFE4D6]" />
          </div>

          {/* ─── signup card ─── */}
          <Link
            href="/kayit"
            className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#EFE0CC] bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E1] px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C96C3A] hover:bg-white hover:shadow-[0_12px_24px_-12px_rgba(120,72,36,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE3C2] to-[#F0B886] text-[#A24E22] ring-1 ring-[#F4D4B3]/60 transition group-hover:scale-105"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 21a8 8 0 0 1 16 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 4v4M21 6h-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#2B1E16]">
                  Hesabın yok mu?
                </p>
                <p className="text-xs text-[#7A6657]">
                  Saniyeler içinde hesap oluştur
                </p>
              </div>
            </div>
            <span
              aria-hidden
              className="text-lg leading-none text-[#C96C3A] transition-transform duration-200 group-hover:translate-x-0.5"
            >
              ›
            </span>
          </Link>
        </div>

        {/* ─── footer note ─── */}
        <p className="relative mx-auto mt-5 max-w-xs text-center text-[11px] leading-5 text-[#7A6657]">
          Devam ederek{" "}
          <span className="font-semibold text-[#5A3A27]">Kullanım Şartları</span>{" "}
          ve{" "}
          <span className="font-semibold text-[#5A3A27]">Gizlilik Politikası</span>
          'nı kabul etmiş olursun.
        </p>
      </div>
    </main>
  );
}