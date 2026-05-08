import Link from "next/link";

export default function BusinessSignupPage() {
  return (
    <main className="min-h-screen bg-[#FCF8F3] px-4 py-12 text-[#2B1E16]">
      <section className="mx-auto max-w-5xl rounded-3xl border border-[#EFE4D6] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C96C3A]">
          İşletmeler için Eat In
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
          Gün sonunda kalan ürünlerini çöpe değil, kazanca çevir.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-[#6B5B4D]">
          Eat In ile kafeler ve işletmeler, gün sonunda elde kalan ürünlerini
          sürpriz kutu olarak listeleyip hızlıca satışa çıkarabilir.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Kutu oluştur", "Kalan ürünlerini tek kutu olarak listele."],
            ["2", "Satış al", "Müşteriler uygulama üzerinden satın alsın."],
            ["3", "Teslim et", "QR kod veya teslim kodu ile güvenli teslim et."],
          ].map(([n, title, desc]) => (
            <div
              key={n}
              className="rounded-2xl border border-[#EFE4D6] bg-[#FFF8F0] p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C96C3A] font-bold text-white">
                {n}
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm text-[#6B5B4D]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
  href="/kayit?role=hotel_owner"
  className="rounded-xl bg-[#C96C3A] px-6 py-3 text-center font-semibold text-white"
>
  İşletme Hesabı Aç
</Link>

          <Link
            href="/otel"
            className="rounded-xl border border-[#D9B79C] px-6 py-3 text-center font-semibold text-[#5A3A27]"
          >
            İşletme Paneline Git
          </Link>
        </div>
      </section>
    </main>
  );
}