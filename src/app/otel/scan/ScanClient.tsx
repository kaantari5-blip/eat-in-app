"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useSearchParams } from "next/navigation";

function ScanPageInner() {
  const params = useSearchParams();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastCodeRef = useRef("");

  useEffect(() => {
    const codeFromUrl = params.get("code");
    if (codeFromUrl) setCode(codeFromUrl);
  }, [params]);

  async function deliverOrder(pickupCode: string) {
    const cleanCode = pickupCode.trim().toUpperCase();

    if (!cleanCode || loading) return;
    if (lastCodeRef.current === cleanCode) return;

    lastCodeRef.current = cleanCode;
    setCode(cleanCode);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders/teslim-et", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickupCode: cleanCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setMessage(`❌ ${data.error || "Teslim edilemedi."}`);
        lastCodeRef.current = "";
        return;
      }

      setMessage("✅ Sipariş teslim edildi!");
      setCode("");
      lastCodeRef.current = "";
      await stopCamera();
    } catch (err) {
      console.error(err);
      setMessage("❌ Hata oluştu.");
      lastCodeRef.current = "";
    } finally {
      setLoading(false);
    }
  }

  async function stopCamera() {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current?.clear();
    } catch (err) {
      console.warn("Camera stop error:", err);
    } finally {
      scannerRef.current = null;
      setCameraOn(false);
    }
  }

  async function startCamera() {
    setMessage("");

    try {
      await stopCamera();

      setCameraOn(true);

      setTimeout(async () => {
        try {
          const qr = new Html5Qrcode("qr-reader");
          scannerRef.current = qr;

          await qr.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
              aspectRatio: 1,
            },
            async (decodedText) => {
              await deliverOrder(decodedText);
            },
            () => {}
          );
        } catch (err) {
          console.error("Camera start error:", err);
          setMessage(
            "❌ Kamera başlatılamadı. İzni kontrol et veya fotoğraf yükle."
          );
          setCameraOn(false);
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setMessage("❌ Kamera açılamadı.");
      setCameraOn(false);
    }
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code.trim()) {
      setMessage("❌ Kod gir.");
      return;
    }

    await deliverOrder(code);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");

    try {
      await stopCamera();

      const qr = new Html5Qrcode("qr-reader");
      scannerRef.current = qr;

      const result = await qr.scanFile(file, true);
      await qr.clear();

      await deliverOrder(result);
    } catch (err) {
      console.error(err);
      setMessage("❌ QR okunamadı.");
    } finally {
      scannerRef.current = null;
      e.target.value = "";
    }
  }

  // ── derive message variant + clean text ──
  const isSuccess = message.startsWith("✅");
  const isError = message.startsWith("❌");
  const messageText = message.replace(/^[✅❌]\s?/, "");

  return (
    <div className="relative w-full max-w-md">
      {/* halo glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-[#FFE3C2]/60 via-[#F4D4B3]/30 to-[#DDE8D9]/40 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-white p-5 shadow-[0_24px_60px_-24px_rgba(120,72,36,0.28)] sm:p-7">
        {/* warm mesh accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#FFE3C2] to-transparent opacity-70 blur-2xl"
        />

        {/* ── HEADER ── */}
        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C96C3A] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C96C3A]" />
            </span>
            Teslim Tarayıcı
          </span>

          <h1 className="mt-4 text-2xl font-bold leading-[1.1] tracking-[-0.02em] text-[#2B1E16] sm:text-[1.75rem]">
            Sipariş Teslim Et
          </h1>

          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6E5A4A]">
            QR'ı okut, fotoğraf yükle veya teslim kodunu manuel gir.
          </p>
        </div>

        {/* ── MESSAGE ── */}
        {message && (
          <div
            role="status"
            className={`relative mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium ring-1 ring-inset ${
              isSuccess
                ? "bg-gradient-to-br from-emerald-50 to-[#F2F7F0] text-emerald-800 ring-emerald-200/70"
                : isError
                  ? "bg-gradient-to-br from-rose-50 to-rose-100/60 text-rose-700 ring-rose-200/80"
                  : "bg-[#FFF8F0] text-[#5A3A27] ring-[#EFE4D6]"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                isSuccess
                  ? "bg-gradient-to-br from-emerald-500 to-[#48634C] text-white shadow-[0_4px_10px_-2px_rgba(72,99,76,0.55)]"
                  : isError
                    ? "bg-rose-500 text-white shadow-[0_4px_10px_-2px_rgba(244,63,94,0.55)]"
                    : "bg-[#C96C3A] text-white"
              }`}
              aria-hidden
            >
              {isSuccess ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                  <path
                    d="M5 12.5l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : isError ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : null}
            </span>
            <p className="leading-5">{messageText || message}</p>
          </div>
        )}

        {/* ── SCANNER VIEWPORT ── */}
        <div className="relative mt-5">
          <div
            className={`relative aspect-square w-full overflow-hidden rounded-3xl border ${
              cameraOn
                ? "border-[#C96C3A] bg-black shadow-[0_10px_30px_-12px_rgba(166,76,30,0.5)]"
                : "border-dashed border-[#E7C4A6] bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9]"
            }`}
          >
            {/* qr-reader is always mounted so html5-qrcode can attach to it */}
            <div
              id="qr-reader"
              className={`h-full w-full ${cameraOn ? "block" : "invisible absolute inset-0"}`}
            />

            {/* off-state placeholder */}
            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-[#C96C3A] shadow-inner ring-1 ring-[#F4D4B3]/60 backdrop-blur">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                    <path
                      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="13"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
                <p className="px-6 text-sm font-bold text-[#5A3A27]">
                  Kamerayı aç ve QR'ı kareye getir
                </p>
                <p className="text-[11px] text-[#9B7E6A]">
                  Otomatik olarak teslim alır
                </p>
              </div>
            )}

            {/* on-state corner brackets + scanline */}
            {cameraOn && (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-4 h-8 w-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-[#FFD0A5]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-tr-2xl border-r-[3px] border-t-[3px] border-[#FFD0A5]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 rounded-bl-2xl border-b-[3px] border-l-[3px] border-[#FFD0A5]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-[#FFD0A5]"
                />

                {/* scanline */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[#FFD0A5] to-transparent shadow-[0_0_18px_rgba(255,208,165,0.8)] animate-pulse"
                />

                {/* live pill */}
                <span className="pointer-events-none absolute left-1/2 top-3 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD0A5] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FFD0A5]" />
                  </span>
                  Tarıyor
                </span>
              </>
            )}
          </div>

          {/* camera controls */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={startCamera}
              disabled={loading || cameraOn}
              className="group inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#D67742] to-[#A24E22] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(166,76,30,0.65)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.05] hover:shadow-[0_14px_28px_-10px_rgba(166,76,30,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_24px_-10px_rgba(166,76,30,0.65)]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              {cameraOn ? "Kamera Açık" : "Kamerayı Aç"}
            </button>

            <button
              type="button"
              onClick={stopCamera}
              disabled={loading || !cameraOn}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#EFE0CC] bg-white px-4 py-3 text-sm font-bold text-[#5A3A27] transition-all duration-200 hover:-translate-y-px hover:border-[#D9B79C] hover:bg-[#FFF8F0] hover:shadow-[0_10px_22px_-12px_rgba(120,72,36,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96C3A]/30 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Kapat
            </button>
          </div>

          {/* photo upload */}
          <label className="mt-2 block w-full">
            <span className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E7C4A6] bg-gradient-to-br from-[#FFF8F0] to-[#FFF1E1] px-4 py-3 text-sm font-bold text-[#7A4526] transition-all duration-200 hover:-translate-y-px hover:border-[#C96C3A] hover:bg-white hover:shadow-[0_10px_22px_-12px_rgba(120,72,36,0.25)] active:translate-y-px">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="9"
                  cy="9"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m21 15-5-5L5 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Galeriden Fotoğraf Yükle
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>

        {/* ── tips ── */}
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[11px] leading-5 text-amber-800">
            Kamera siyah görünürse sayfayı yenileyip tekrar açın veya fotoğraf
            yükleme seçeneğini kullanın.
          </p>
        </div>

        {/* ── divider ── */}
        <div className="my-5 flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-[#EFE4D6]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]">
            veya kodu gir
          </span>
          <span aria-hidden className="h-px flex-1 bg-[#EFE4D6]" />
        </div>

        {/* ── manual entry form ── */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <label
              htmlFor="pickup-code"
              className="absolute -top-2 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-white px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9B7E6A]"
            >
              Teslim Kodu
            </label>
            <input
              id="pickup-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              autoComplete="off"
              autoCapitalize="characters"
              inputMode="text"
              spellCheck={false}
              className="w-full rounded-2xl border border-[#EFE0CC] bg-[#FCF8F3] px-4 py-4 text-center font-mono text-xl font-extrabold tracking-[0.4em] text-[#2B1E16] outline-none transition placeholder:text-[#C9B0A0] focus:border-[#C96C3A] focus:bg-white focus:ring-2 focus:ring-[#C96C3A]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#6B8B6E] to-[#3E5442] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(72,99,76,0.6)] ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-px hover:brightness-[1.05] hover:shadow-[0_16px_32px_-12px_rgba(72,99,76,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48634C] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 animate-spin"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="40"
                    strokeDashoffset="20"
                  />
                </svg>
                Teslim ediliyor...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M5 12.5l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Teslim Et
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ScanPageFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#EFE0CC] bg-white p-7 shadow-[0_24px_60px_-24px_rgba(120,72,36,0.28)]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0CC] bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A24E22] shadow-sm">
            Teslim Tarayıcı
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#2B1E16]">
            Sipariş Teslim Et
          </h1>
          <p className="mt-2 text-sm text-[#6E5A4A]">Yükleniyor...</p>
        </div>
        <div className="mt-5 aspect-square w-full animate-pulse rounded-3xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8C9]" />
      </div>
    </div>
  );
}

export default function ScanClient() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FBF6EF] p-4 text-[#2B1E16] antialiased sm:p-6">
      {/* ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFE3C2] via-[#F4D4B3] to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-[#DDE8D9] to-transparent opacity-50 blur-3xl"
      />

      <Suspense fallback={<ScanPageFallback />}>
        <ScanPageInner />
      </Suspense>
    </main>
  );
}