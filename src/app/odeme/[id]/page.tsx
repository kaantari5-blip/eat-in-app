import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireCustomer } from "@/lib/auth/guards";
import { createOrder } from "@/lib/actions/order";
import SubmitOrderButton from "@/components/SubmitOrderButton";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCustomer();

  const { id } = await params;
  const supabase = await createClient();

  const { data: pkg } = await (supabase as any)
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  if (!pkg) {
    notFound();
  }

  const isSoldOut = (pkg.quantity ?? 0) <= 0;

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-6 py-10 text-[#2B1E16]">
      <div className="mx-auto max-w-2xl space-y-8">
        <Link
          href={`/paket/${pkg.id}`}
          className="inline-flex rounded-2xl border border-[#D9B79C] bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] transition hover:bg-[#FFF4EA]"
        >
          ← Pakete dön
        </Link>

        <section className="rounded-[2rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-8 shadow-[0_10px_40px_rgba(120,72,36,0.08)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9B7E6A]">
            Ödeme
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Siparişi tamamla
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6B5B4D]">
            Şu an demo ödeme akışı kullanılıyor. Butona bastığında ödeme başarılı
            kabul edilir ve sipariş oluşturulur.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[#E7D4C4] bg-[#FFFDF9] p-6 shadow-[0_8px_30px_rgba(120,72,36,0.08)]">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#8A7768]">{pkg.hotel_name}</p>
              <h2 className="mt-1 text-2xl font-semibold">{pkg.title}</h2>
            </div>

            <div className="rounded-2xl bg-[#FFF8F0] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B5B4D]">Teslim saati</span>
                <span className="font-medium text-[#2B1E16]">
                  {pkg.pickup_start} - {pkg.pickup_end}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between rounded-2xl bg-white p-4 ring-1 ring-[#EADACB]">
              <div>
                <p className="text-sm text-[#8A7768]">Ödenecek tutar</p>
                <p className="mt-2 text-3xl font-bold text-[#C96C3A]">
                  {pkg.price}₺
                </p>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  isSoldOut
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isSoldOut ? "Stok tükendi" : `Kalan stok: ${pkg.quantity}`}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[#E7D4C4] bg-[#FFF8F0] p-4 text-sm text-[#6B5B4D]">
              <p className="font-semibold text-[#2B1E16]">Demo ödeme notu</p>
              <p className="mt-1">
                Gerçek kart bilgisi alınmaz. MVP aşamasında bu buton ödeme
                başarılı gibi davranır.
              </p>
            </div>

            <form action={createOrder.bind(null, pkg.id)} className="pt-4">
<SubmitOrderButton isSoldOut={isSoldOut} />
</form>
          </div>
        </section>
      </div>
    </main>
  );
}