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
      {/* ── Desktop & tablet nav ── */}
      <header className="sticky top-0 z-50 border-b border-[#F0E4D7] bg-white/80 backdrop-blur-xl shadow-[0_1px_24px_rgba(201,108,58,0.06)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">

          {/* Logo */}
          <Link href="/" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
            <img src="/logo.png" alt="Eat In" className="h-14 w-auto" />
          </Link>

          {/* Center nav links — desktop only */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/">Keşfet</NavLink>

            {user && <NavLink href="/dashboard">Siparişlerim</NavLink>}
            {user && <NavLink href="/favoriler">Favorilerim</NavLink>}
            {user && role === "hotel_owner" && (
              <NavLink href="/otel">İşletme Paneli</NavLink>
            )}
          </nav>

          {/* Right-side actions — desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {/* Avatar + email pill */}
                <div className="flex items-center gap-2 rounded-full border border-[#EFE4D6] bg-[#FDF8F3] px-3 py-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#C96C3A] text-xs font-bold text-white shadow-sm">
                    {firstLetter}
                  </span>
                  <span className="max-w-[140px] truncate text-xs font-medium text-[#7A6355]">
                    {emailDisplay}
                  </span>
                </div>

                <form action={logout}>
                  <SubmitButton
                    pendingText="Çıkış..."
                    className="rounded-full border border-[#E7D4C4] bg-white px-4 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:text-[#C96C3A] active:scale-[0.97]"
                  >
                    Çıkış Yap
                  </SubmitButton>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-full border border-[#E7D4C4] bg-white px-5 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 hover:border-[#C96C3A] hover:bg-[#FFF4EA] hover:text-[#C96C3A] active:scale-[0.97]"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-full bg-[#C96C3A] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(201,108,58,0.35)] transition-all duration-200 hover:bg-[#B85E2E] hover:shadow-[0_4px_18px_rgba(201,108,58,0.45)] active:scale-[0.97]"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

            {/* Business CTA — always visible */}
            <Link
              href="/isletme-kayit"
              className="ml-1 rounded-full bg-gradient-to-r from-[#C96C3A] to-[#E8845A] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_14px_rgba(201,108,58,0.30)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(201,108,58,0.45)] hover:brightness-105 active:scale-[0.97]"
            >
              İşletmeler İçin ✦
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
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

/* ─── Shared desktop nav link ─── */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative rounded-full px-4 py-2 text-sm font-medium text-[#5A3A27] transition-all duration-200 after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-[#C96C3A] after:transition-all after:duration-200 hover:bg-[#FFF4EA] hover:text-[#C96C3A] hover:after:w-4/5"
    >
      {children}
    </Link>
  );
}

/* ─── Mobile slide-down menu ─── */
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
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#E7D4C4] bg-white text-[#5A3A27] shadow-sm transition-all duration-200 active:scale-95 group-open:border-[#C96C3A] group-open:bg-[#FFF4EA]">
        {/* Hamburger → X via CSS sibling trick */}
        <svg
          className="block group-open:hidden"
          width="18" height="14" viewBox="0 0 18 14" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect y="0"  width="18" height="2" rx="1" fill="#5A3A27"/>
          <rect y="6"  width="18" height="2" rx="1" fill="#5A3A27"/>
          <rect y="12" width="18" height="2" rx="1" fill="#5A3A27"/>
        </svg>
        <svg
          className="hidden group-open:block"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M1 1l12 12M13 1L1 13" stroke="#C96C3A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </summary>

      {/* Dropdown panel */}
      <div
        className="absolute right-0 mt-3 w-[300px] max-w-[88vw] origin-top-right animate-[fadeSlideDown_180ms_ease-out] overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(43,30,22,0.18)] backdrop-blur-2xl"
        style={{ animationFillMode: "both" }}
      >
        {/* User identity strip */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#FDF8F3] to-[#FAF0E6] p-3 shadow-inner">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8845A] to-[#C96C3A] text-sm font-bold text-white shadow-md">
              {firstLetter}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2B1E16]">Merhaba 👋</p>
              <p className="truncate text-xs text-[#8A7768]">
                {emailDisplay ?? "Gezinmeye devam et"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="px-3 pb-3 space-y-1.5">
          <MenuSection>
            <MenuItem href="/" icon="🔍">Keşfet</MenuItem>

            {user && <MenuItem href="/dashboard" icon="📦" divider>Siparişlerim</MenuItem>}
            {user && <MenuItem href="/favoriler" icon="❤️" divider>Favorilerim</MenuItem>}
            {user && role === "hotel_owner" && (
              <MenuItem href="/otel" icon="🏨" divider>İşletme Paneli</MenuItem>
            )}
          </MenuSection>

          {/* Business CTA */}
          <Link
            href="/isletme-kayit"
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#C96C3A] to-[#E8845A] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(201,108,58,0.35)] transition-all duration-200 active:scale-[0.98]"
          >
            <span>İşletmeler İçin</span>
            <span className="text-base">✦</span>
          </Link>

          {/* Auth buttons */}
          {!user ? (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <Link
                href="/giris"
                className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-3 text-center text-sm font-semibold text-[#5A3A27] transition-all duration-200 active:scale-[0.97]"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-2xl bg-[#C96C3A] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.97]"
              >
                Kayıt Ol
              </Link>
            </div>
          ) : (
            <form action={logout}>
              <SubmitButton
                pendingText="Çıkış yapılıyor..."
                className="w-full rounded-2xl border border-[#F0E4D7] bg-[#FFF8F3] px-4 py-3 text-sm font-semibold text-[#C96C3A] transition-all duration-200 active:scale-[0.97]"
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

/* ─── Mobile menu helpers ─── */
function MenuSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EFE4D6] bg-white/70">
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
      className={`flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 active:bg-[#FFF4EA] ${
        divider ? "border-t border-[#F1E4D8]" : ""
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF4EA] text-base">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium text-[#2B1E16]">{children}</span>
      <span className="text-[#C9B0A0] text-lg leading-none">›</span>
    </Link>
  );
}