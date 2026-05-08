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
  <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-[#E7D4C4] bg-white text-[#5A3A27] shadow-sm transition hover:bg-[#FFF4EA]">
    <span className="text-xl leading-none">☰</span>
  </summary>

  <div className="absolute right-0 mt-3 w-[300px] max-w-[86vw] overflow-hidden rounded-[1.4rem] border border-[#E7D4C4] bg-white/95 shadow-[0_18px_44px_rgba(43,30,22,0.18)] backdrop-blur-xl">
    <div className="border-b border-[#F1E4D8] bg-gradient-to-br from-[#FFF8F0] to-[#FFFDF9] px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E89345] text-lg font-bold text-white">
          {firstLetter}
        </div>

        <div className="min-w-0">
          <p className="text-lg font-bold text-[#2B1E16]">Merhaba 👋</p>
          <p className="truncate text-xs text-[#8A7768]">
            {user ? user.email : "Gezinmeye devam et"}
          </p>
        </div>
      </div>
    </div>

    <div className="p-3">
      <div className="space-y-1">
        <Link
          href="/"
          className="flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-[#FFF4EA]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE4] text-lg">
              🏠
            </span>
            <span className="text-base font-semibold text-[#2B1E16]">
              Keşfet
            </span>
          </div>
          <span className="text-xl text-[#9F8877]">›</span>
        </Link>

        {user && (
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-[#FFF4EA]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE4] text-lg">
                🛍️
              </span>
              <span className="text-base font-semibold text-[#2B1E16]">
                Siparişlerim
              </span>
            </div>
            <span className="text-xl text-[#9F8877]">›</span>
          </Link>
        )}

        {user && (
          <Link
            href="/favoriler"
            className="flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-[#FFF4EA]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE4] text-lg">
                ❤️
              </span>
              <span className="text-base font-semibold text-[#2B1E16]">
                Favorilerim
              </span>
            </div>
            <span className="text-xl text-[#9F8877]">›</span>
          </Link>
        )}

        {user && role === "hotel_owner" && (
          <Link
            href="/otel"
            className="flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-[#FFF4EA]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE4] text-lg">
                🏪
              </span>
              <span className="text-base font-semibold text-[#2B1E16]">
                İşletme Paneli
              </span>
            </div>
            <span className="text-xl text-[#9F8877]">›</span>
          </Link>
        )}

        {!user && (
          <div className="space-y-2 pt-2">
            <Link
              href="/giris"
              className="block rounded-2xl border border-[#D9B79C] bg-white px-4 py-3 text-center text-sm font-semibold text-[#5A3A27] transition hover:bg-[#FFF4EA]"
            >
              Giriş Yap
            </Link>

            <Link
              href="/kayit"
              className="block rounded-2xl bg-[#C96C3A] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#B85E2E]"
            >
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </div>

    {user && (
      <div className="border-t border-[#F1E4D8] p-3">
        <form action={logout}>
          <SubmitButton
            pendingText="Çıkış..."
            className="w-full rounded-2xl border border-[#EACFB8] bg-[#FFF8F0] px-4 py-3 text-sm font-semibold text-[#C96C3A] transition hover:bg-[#FFF1E5]"
          >
            Çıkış Yap
          </SubmitButton>
        </form>
      </div>
    )}
  </div>
</details>
      </div>
    </header>
  );
}