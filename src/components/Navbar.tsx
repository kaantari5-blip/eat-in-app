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

  const firstLetter = user?.email?.charAt(0).toUpperCase() ?? "E";

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7D4C4] bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center">
  <img
    src="/logo.png"
    alt="Eat In"
    className="h-16 w-auto"
  />
</Link>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
          >
            Keşfet
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-2xl px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
              >
                Siparişlerim
              </Link>

              <Link
                href="/favoriler"
                className="rounded-2xl px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
              >
                Favorilerim
              </Link>

              {role === "hotel_owner" && (
                <Link
                  href="/otel"
                  className="rounded-2xl px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
                >
                  İşletme Paneli
                </Link>
              )}

              <span className="rounded-2xl border border-[#E7D4C4] bg-white px-4 py-2 text-sm text-[#8A7768]">
                {user.email}
              </span>

              <form action={logout}>
                <SubmitButton
                  pendingText="Çıkış..."
                  className="rounded-2xl border border-[#D9B79C] bg-white px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
                >
                  Çıkış Yap
                </SubmitButton>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="rounded-2xl border border-[#D9B79C] bg-white px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
              >
                Giriş Yap
              </Link>

              <Link
                href="/kayit"
                className="rounded-2xl bg-[#C96C3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#B85E2E]"
              >
                Kayıt Ol
              </Link>
            </>
          )}
          <Link
  href="/isletme-kayit"
  className="rounded-full bg-[#C96C3A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B85E2E]"
>
  İşletmeler İçin
</Link>
        </nav>

        <details className="relative md:hidden">
  <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#E7D4C4] bg-white/80 text-[#5A3A27] shadow-sm backdrop-blur transition active:scale-95">
    <span className="text-xl leading-none">☰</span>
  </summary>

  <div className="absolute right-0 mt-3 w-[292px] max-w-[86vw] overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_20px_60px_rgba(43,30,22,0.18)] backdrop-blur-2xl animate-soft-fade-up">
    <div className="px-4 pb-3 pt-4">
      <div className="flex items-center gap-3 rounded-3xl bg-[#FCF8F3]/70 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C96C3A] text-sm font-bold text-white shadow-sm">
          {firstLetter}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2B1E16]">Merhaba</p>
          <p className="truncate text-xs text-[#8A7768]">
            {user ? user.email : "Gezinmeye devam et"}
          </p>
        </div>
      </div>
    </div>

    <div className="px-3 pb-3">
      <div className="overflow-hidden rounded-3xl border border-[#EFE4D6] bg-white/70">
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-3.5 transition active:bg-[#FFF4EA]"
        >
          <span className="text-sm font-medium text-[#2B1E16]">Keşfet</span>
          <span className="text-lg text-[#B39A87]">›</span>
        </Link>

        {user && (
          <Link
            href="/dashboard"
            className="flex items-center justify-between border-t border-[#F1E4D8] px-4 py-3.5 transition active:bg-[#FFF4EA]"
          >
            <span className="text-sm font-medium text-[#2B1E16]">
              Siparişlerim
            </span>
            <span className="text-lg text-[#B39A87]">›</span>
          </Link>
        )}

        {user && (
          <Link
            href="/favoriler"
            className="flex items-center justify-between border-t border-[#F1E4D8] px-4 py-3.5 transition active:bg-[#FFF4EA]"
          >
            <span className="text-sm font-medium text-[#2B1E16]">
              Favorilerim
            </span>
            <span className="text-lg text-[#B39A87]">›</span>
          </Link>
        )}

        {user && role === "hotel_owner" && (
          <Link
            href="/otel"
            className="flex items-center justify-between border-t border-[#F1E4D8] px-4 py-3.5 transition active:bg-[#FFF4EA]"
          >
            <span className="text-sm font-medium text-[#2B1E16]">
              İşletme Paneli
            </span>
            <span className="text-lg text-[#B39A87]">›</span>
          </Link>
        )}
      </div>

      {!user && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href="/giris"
            className="rounded-2xl border border-[#E7D4C4] bg-white/70 px-4 py-3 text-center text-sm font-semibold text-[#5A3A27]"
          >
            Giriş
          </Link>

          <Link
            href="/kayit"
            className="rounded-2xl bg-[#C96C3A] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
          >
            Kayıt
          </Link>
        </div>
      )}

      {user && (
        <form action={logout} className="mt-3">
          <SubmitButton
            pendingText="Çıkış..."
            className="w-full rounded-2xl bg-[#FFF4EA] px-4 py-3 text-sm font-semibold text-[#C96C3A] transition active:scale-[0.98]"
          >
            Çıkış Yap
          </SubmitButton>
        </form>
      )}
    </div>
  </div>
</details>
      </div>
    </header>
  );
}