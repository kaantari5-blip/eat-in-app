import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import { logout } from "../lib/actions/auth";
import SubmitButton from "./SubmitButton";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  const firstLetter = user?.email?.charAt(0).toUpperCase() ?? "?";
  const emailDisplay = user?.email ?? null;

  return (
    <>
      {/* keyframes — kept self-contained */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          50%      { opacity: 1; transform: scale(1.15) rotate(20deg); }
        }
      `}</style>

      {/* ── Sticky top bar ── */}
      <header
        className="sticky top-0 z-50 border-b border-[#F0E4D7]/80 bg-white/75 shadow-[0_1px_0_rgba(120,72,36,0.04),0_8px_24px_-12px_rgba(201,108,58,0.12)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/65"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">

          {/* ─────────── Logo ─────────── */}
          <Link
            href="/"
            className="group/logo relative flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md"
            aria-label="Eat In ana sayfa"
          >
            <img
              src="/logo.png"
              alt="Eat In"
              className="h-12 w-auto transition-transform duration-300 group-hover/logo:scale-[1.03] sm:h-14"
            />
          </Link>

          {/* ─────────── Desktop nav ─────────── */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/">Keşfet</NavLink>
            {user && <NavLink href="/dashboard">Siparişlerim</NavLink>}
            {user && <NavLink href="/favoriler">Favorilerim</NavLink>}
            {user && role === "hotel_owner" && (
              <NavLink href="/otel">İşletme Paneli</NavLink>
            )}

            {/* divider between nav links and account actions */}
            <span
              aria-hidden
              className="mx-2 hidden h-6 w-px bg-[#EFE4D6] lg:block"
            />

            {user ? (
              <>
                {/* Avatar + email pill (acts like an account chip) */}
                <div
                  className="group/user flex items-center gap-2 rounded-full border border-[#EFE4D6] bg-[#FDF8F3] px-2 py-1.5 transition-all duration-200 hover:-translate-y-px hover:border-[#E7C4A6] hover:bg-white hover:shadow-[0_8px_20px_-12px_rgba(120,72,36,0.25)]"
                  title={emailDisplay ?? undefined}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#A24E22] text-[11px] font-bold text-white shadow-[0_4px_10px_-2px_rgba(166,76,30,0.55)] ring-1 ring-white/40 transition group-hover/user:scale-105">
                    {firstLetter}
                  </span>
                  <span className="hidden max-w-[160px] truncate pr-1 text-xs font-medium text-[#7A6355] lg:inline">
                    {emailDisplay}
                  </span>
                </div>

                <form action={logout}>
                  <SubmitButton
                    pendingText="Çıkış..."
                    className="rounded-full border border-[#E7D4C4] bg-white px-4 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:text-[#C96C3A] hover:shadow-[0_8px_20px_-12px_rgba(201,108,58,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px active:scale-[0.98]"
                  >
                    Çıkış Yap
                  </SubmitButton>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-full border border-[#E7D4C4] bg-white px-5 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:text-[#C96C3A] hover:shadow-[0_8px_20px_-12px_rgba(201,108,58,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px active:scale-[0.98]"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-full bg-gradient-to-br from-[#D67742] to-[#A24E22] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_24px_-10px_rgba(166,76,30,0.75)] hover:brightness-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px active:scale-[0.98]"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

            {/* Business CTA */}
            <Link
              href="/isletme-kayit"
              className="group/biz relative ml-1 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#C96C3A] via-[#D67742] to-[#E8845A] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(201,108,58,0.55)] ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_14px_28px_-10px_rgba(201,108,58,0.65)] hover:brightness-[1.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#C96C3A] active:translate-y-px active:scale-[0.98]"
            >
              {/* sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/biz:translate-x-full"
              />
              <span className="relative">İşletmeler İçin</span>
              <span
                aria-hidden
                className="relative inline-block"
                style={{ animation: "sparkle 2.4s ease-in-out infinite" }}
              >
                ✦
              </span>
            </Link>
          </nav>

          {/* ─────────── Mobile hamburger ─────────── */}
          <MobileMenu
            user={user}
            role={role}
            firstLetter={firstLetter}
            emailDisplay={emailDisplay}
          />
        </div>
      </header>
    </>
  );
}

/* ───────────────── Shared desktop nav link ───────────────── */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 hover:bg-[#FFF4EA] hover:text-[#C96C3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D67742] to-[#A24E22] transition-all duration-300 ease-out group-hover:w-full"
        />
      </span>
    </Link>
  );
}

/* ───────────────── Mobile slide-down menu ───────────────── */
function MobileMenu({
  user,
  role,
  firstLetter,
  emailDisplay,
}: {
  user: any;
  role: string | null;
  firstLetter: string;
  emailDisplay: string | null;
}) {
  return (
    <details className="group relative md:hidden">
      {/* Trigger */}
      <summary
        aria-label="Menüyü aç"
        className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#E7D4C4] bg-white text-[#5A3A27] shadow-[0_4px_12px_-6px_rgba(120,72,36,0.25)] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:shadow-[0_10px_22px_-10px_rgba(201,108,58,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 group-open:border-[#C96C3A] group-open:bg-[#FFF4EA] group-open:text-[#C96C3A]"
      >
        {/* Hamburger → X */}
        <svg
          className="block group-open:hidden"
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          aria-hidden="true"
        >
          <rect y="0" width="18" height="2" rx="1" fill="currentColor" />
          <rect y="6" width="14" height="2" rx="1" fill="currentColor" />
          <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
        <svg
          className="hidden group-open:block"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </summary>

      {/* Dropdown panel */}
      <div
        className="absolute right-0 mt-3 w-[320px] max-w-[88vw] origin-top-right overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/95 shadow-[0_24px_60px_-18px_rgba(43,30,22,0.28),0_8px_24px_-12px_rgba(201,108,58,0.18)] backdrop-blur-2xl"
        style={{
          animation: "fadeSlideDown 220ms ease-out both",
        }}
      >
        {/* User identity strip */}
        <div className="relative overflow-hidden border-b border-[#F1E4D8] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] px-4 pb-4 pt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#A24E22] text-base font-bold text-white shadow-[0_8px_18px_-6px_rgba(166,76,30,0.55)] ring-2 ring-white">
              {firstLetter}
              {user && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#6B8B6E] ring-2 ring-white"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold tracking-tight text-[#2B1E16]">
                {user ? "Hoş geldin 👋" : "Merhaba 👋"}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#8A7768]">
                {emailDisplay ?? "Gezinmeye devam et"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="space-y-2 p-3">
          <MenuSection>
            <MenuItem href="/" icon="🔍">
              Keşfet
            </MenuItem>

            {user && (
              <MenuItem href="/dashboard" icon="📦" divider>
                Siparişlerim
              </MenuItem>
            )}
            {user && (
              <MenuItem href="/favoriler" icon="❤️" divider>
                Favorilerim
              </MenuItem>
            )}
            {user && role === "hotel_owner" && (
              <MenuItem href="/otel" icon="🏨" divider>
                İşletme Paneli
              </MenuItem>
            )}
          </MenuSection>

          {/* Business CTA */}
          <Link
            href="/isletme-kayit"
            className="group/bizm relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#C96C3A] via-[#D67742] to-[#E8845A] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_-8px_rgba(201,108,58,0.5)] ring-1 ring-white/25 transition-all duration-200 active:scale-[0.98]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/bizm:translate-x-full"
            />
            <span className="relative inline-flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30"
              >
                🏪
              </span>
              İşletmeler İçin
            </span>
            <span
              aria-hidden
              className="relative text-base"
              style={{ animation: "sparkle 2.4s ease-in-out infinite" }}
            >
              ✦
            </span>
          </Link>

          {/* Auth buttons */}
          {!user ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/giris"
                className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-3 text-center text-sm font-semibold text-[#5A3A27] transition-all duration-200 hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:text-[#C96C3A] active:scale-[0.97]"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(166,76,30,0.6)] ring-1 ring-white/30 transition-all duration-200 hover:brightness-[1.05] active:scale-[0.97]"
              >
                Kayıt Ol
              </Link>
            </div>
          ) : (
            <form action={logout} className="pt-1">
              <SubmitButton
                pendingText="Çıkış yapılıyor..."
                className="w-full rounded-2xl border border-[#F0E4D7] bg-[#FFF8F3] px-4 py-3 text-sm font-semibold text-[#C96C3A] transition-all duration-200 hover:border-[#E7C4A6] hover:bg-[#FFF1E5] active:scale-[0.97]"
              >
                Çıkış Yap
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </details>
  );
}

/* ───────────────── Mobile menu helpers ───────────────── */
function MenuSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EFE4D6] bg-white/80 shadow-[0_2px_10px_-6px_rgba(120,72,36,0.12)]">
      {children}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  divider,
  children,
}: {
  href: string;
  icon: string;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group/mi flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-[#FFF8F3] active:bg-[#FFF4EA] ${
        divider ? "border-t border-[#F1E4D8]" : ""
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9] text-base ring-1 ring-[#F4D4B3]/60 transition group-hover/mi:scale-105">
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-[#2B1E16]">
        {children}
      </span>
      <span
        aria-hidden
        className="text-lg leading-none text-[#C9B0A0] transition-transform duration-200 group-hover/mi:translate-x-0.5 group-hover/mi:text-[#C96C3A]"
      >
        ›
      </span>
    </Link>
  );
}