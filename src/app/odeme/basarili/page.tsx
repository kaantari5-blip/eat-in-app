import Link from "next/link";
import { requireCustomer } from "@/lib/auth/guards";
import { createClient } from "@supabase/supabase-js";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { packageId?: string; amount?: string; code?: string };
}) {
  await requireCustomer();

  const packageId = searchParams.packageId;
  const amount = searchParams.amount;
  const code = searchParams.code;

  if (packageId && amount) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase.from("payments").insert({
      package_id: packageId,
      amount: Number(amount),
      status: "paid",
    });
  }

  const shortPackageId = packageId
    ? packageId.toString().replace(/-/g, "").slice(0, 8).toUpperCase()
    : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCF8F3] px-4 py-10 text-[#2B1E16] sm:px-6">
      {/* decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE8C9] to-[#F4D4B3] opacity-40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#DDE8D9]/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(122,69,38,0.5)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#EFE4D6] bg-white p-6 text-center shadow-[0_8px_28px_-12px_rgba(120,72,36,0.18)] sm:p-10">
        {/* Top accent bar */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-[#C96C3A] to-green-400"
        />

        {/* Success icon with concentric rings */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute h-24 w-24 animate-ping rounded-full bg-green-200/40"
          />
          <span
            aria-hidden="true"
            className="absolute h-20 w-20 rounded-full bg-green-100/80"
          />
          <span
            aria-hidden="true"
            className="absolute h-16 w-16 rounded-full bg-green-200/70"
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/30 ring-4 ring-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </div>

        {/* Eyebrow */}
        <p className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Sipariş tamamlandı
        </p>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#2B1E16] sm:text-4xl">
          Siparişin Alındı!
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B5B4D] sm:text-[15px]">
          Teslim saatinde işletmeye giderek kodunu göster.
        </p>

        {/* Pickup code — hero block */}
        {code && (
          <div className="relative mt-7 overflow-hidden rounded-2xl border-2 border-dashed border-[#C96C3A]/40 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6] p-6 shadow-[0_4px_20px_-8px_rgba(201,108,58,0.25)]">
            <span
              aria-hidden="true"
              className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#FCF8F3]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#FCF8F3]"
            />

            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#C96C3A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B85E2E]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3"
              >
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              Teslim Kodun
            </p>

            <p className="mt-4 break-all font-mono text-4xl font-extrabold tracking-[0.3em] text-[#2B1E16] sm:text-5xl sm:tracking-[0.4em]">
              {code}
            </p>

            <p className="mt-4 text-xs leading-5 text-[#7B6657] sm:text-sm">
              Bu kodu işletmede göstererek siparişini teslim alabilirsin.
            </p>
          </div>
        )}

        {/* Payment summary */}
        {(shortPackageId || amount) && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#EFE4D6] bg-white text-left shadow-[0_4px_16px_-8px_rgba(120,72,36,0.1)]">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#FFF1E1] via-[#FFE8D2] to-[#FFF1E1] px-5 py-2.5">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B85E2E]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M3 10h18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Ödeme Özeti
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85E2E]/70">
                Onaylandı
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              {shortPackageId && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
                    Sipariş No
                  </p>
                  <p className="mt-1 font-mono text-sm font-extrabold tracking-wider text-[#2B1E16]">
                    #{shortPackageId}
                  </p>
                </div>
              )}
              {amount && (
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
                    Tutar
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#C96C3A]">
                    {amount}₺
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mini progress timeline */}
        <div className="mt-4 rounded-2xl border border-[#EFE4D6] bg-[#FCF8F3] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
            Siparişin yolculuğu
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[
              { label: "Alındı", active: true },
              { label: "Hazırlanıyor", active: false },
              { label: "Hazır", active: false },
              { label: "Teslim", active: false },
            ].map((step, index, arr) => (
              <div key={step.label} className="flex flex-col items-start gap-1.5">
                <div className="relative flex w-full items-center">
                  <div
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.active
                        ? "border-[#C96C3A] bg-[#C96C3A] text-white"
                        : "border-[#EADACB] bg-white text-[#A08B7C]"
                    }`}
                  >
                    {step.active ? (
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
                    ) : (
                      <span className="text-[10px] font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < arr.length - 1 && (
                    <div className="ml-1 h-0.5 flex-1 rounded-full bg-[#EADACB]" />
                  )}
                </div>
                <p
                  className={`text-[10px] font-medium leading-tight sm:text-[11px] ${
                    step.active ? "font-semibold text-[#7A4526]" : "text-[#A08B7C]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next step */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E7D4C4] bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E6] p-4 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#C96C3A] shadow-sm ring-1 ring-inset ring-[#EADBCB]">
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
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7E6A]">
              Sonraki adım
            </p>
            <p className="mt-1 text-sm font-semibold text-[#5A3A27]">
              Teslim saatinde işletmeye git
            </p>
            <p className="mt-1 text-xs leading-5 text-[#7B6657] sm:text-sm">
              Belirtilen teslim saatinde işletmeye git ve teslim kodunu
              gösterip siparişini al.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          <Link
            href="/dashboard"
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#C96C3A] to-[#B85E2E] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#C96C3A]/25 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
          >
            Siparişlerime Git
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
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E7D4C4] bg-white px-5 py-3 text-sm font-semibold text-[#5A3A27] transition hover:bg-[#FFF8F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
          >
            Keşfetmeye Devam Et
          </Link>
        </div>

        {/* Subtle reassurance */}
        <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-[#9B7E6A]">
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
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
          Ödemen güvenle alındı · Bilgilerin korunur
        </p>
      </section>
    </main>
  );
}