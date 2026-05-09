import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PackageCard from "@/components/PackageCard";
import { requireCustomer } from "@/lib/auth/guards";

export default async function FavoritesPage() {
  const { supabase, user } = await requireCustomer();

  const { data: favorites } = await (supabase as any)
    .from("favorites")
    .select("package_id")
    .eq("user_id", user.id);

  const favoritePackageIds = (favorites ?? []).map((fav: any) => fav.package_id);

  let packages: any[] = [];

  if (favoritePackageIds.length > 0) {
    const { data } = await (supabase as any)
      .from("packages")
      .select("*")
      .in("id", favoritePackageIds)
      .order("created_at", { ascending: false });

    packages = data ?? [];
  }

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-6 py-10 text-[#2B1E16]">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-8 shadow-[0_10px_40px_rgba(120,72,36,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#9B7E6A]">
                Hesabım
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Favorilerim
              </h1>
              <p className="mt-3 text-sm text-[#6B5B4D]">
                Beğendiğin kutuları burada saklayabilirsin.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-2xl border border-[#D9B79C] bg-white/80 px-5 py-3 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#E8D7C7] bg-[#FFFDF9] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#8A7768]">Kaydedilen kutular</p>
              <p className="mt-2 text-3xl font-bold text-[#C96C3A]">
                {packages.length}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-[#D9B79C] bg-white px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section>
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p: any) => (
                <PackageCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
          <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-[#D9B79C] bg-white/80 p-10 text-center shadow-[0_8px_30px_rgba(120,72,36,0.06)] sm:p-14">
  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFE8C9]/50 blur-2xl" />
  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#EEF5ED]/70 blur-2xl" />

  <div className="relative mx-auto flex max-w-md flex-col items-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#FFF3E6] to-[#FFE1C7] text-4xl shadow-inner">
      ♡
    </div>

    <p className="mt-6 text-2xl font-bold text-[#2B1E16]">
      Henüz favori kutun yok
    </p>

    <p className="mt-3 text-sm leading-6 text-[#8A7768]">
      Beğendiğin sürpriz kutuları kalp ikonuna basarak kaydedebilirsin.
      Favorilerin burada hızlıca erişilebilir olur.
    </p>

    <Link
      href="/"
      className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C96C3A] to-[#B85E2E] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(201,108,58,0.25)] transition hover:shadow-[0_12px_28px_rgba(201,108,58,0.35)] active:scale-[0.98]"
    >
      Kutuları Keşfet
      <span aria-hidden="true">→</span>
    </Link>
  </div>
</div>
          )}
        </section>
      </div>
    </main>
  );
}