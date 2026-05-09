import { requireHotelOwner } from "@/lib/auth/guards";
import ScanClient from "./ScanClient";

export default async function ScanPage() {
  await requireHotelOwner();

  return (
    <main className="min-h-screen bg-[#FCF8F3] px-4 py-6 text-[#2B1E16] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] via-[#FFFDF9] to-[#F7E7D7] p-6 shadow-[0_10px_40px_rgba(120,72,36,0.08)] sm:p-8 lg:p-10">
          {/* blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F4D4B3]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#FFE8C9]/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D4C4] bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9B7E6A] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#48634C]" />
                QR Teslim Sistemi
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Sipariş Teslim Et
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6B5B4D] sm:text-base">
                QR kod okut veya teslim kodunu manuel girerek müşterinin
                siparişini saniyeler içinde teslim et.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] ring-1 ring-inset ring-[#E7D4C4]">
                  ⚡ Hızlı teslim
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] ring-1 ring-inset ring-[#E7D4C4]">
                  📷 QR okutma
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-sm font-medium text-[#5A3A27] ring-1 ring-inset ring-[#E7D4C4]">
                  🔐 Güvenli doğrulama
                </div>
              </div>
            </div>

            {/* right card */}
            <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(120,72,36,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF5ED] text-2xl">
                  📦
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768]">
                    Eat In
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Teslim Merkezi
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#F8F4EF] p-3">
                  <p className="text-xs text-[#8A7768]">
                    QR kod okut
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Kamerayı açarak hızlı teslim yap.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F4EF] p-3">
                  <p className="text-xs text-[#8A7768]">
                    Manuel kod gir
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    QR çalışmazsa teslim kodunu yaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scanner Area */}
        <section className="rounded-[2rem] border border-[#E8D7C7] bg-[#FFFDF9] p-4 shadow-[0_8px_30px_rgba(120,72,36,0.06)] sm:p-6">
          <ScanClient />
        </section>
      </div>
    </main>
  );
}