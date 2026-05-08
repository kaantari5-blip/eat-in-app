"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useSearchParams } from "next/navigation";

function ScanPageInner() {
  const params = useSearchParams();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastCodeRef = useRef("");

  useEffect(() => {
    const codeFromUrl = params.get("code");
    if (codeFromUrl) {
      setCode(codeFromUrl);
    }
  }, [params]);

  async function deliverOrder(pickupCode: string) {
    const cleanCode = pickupCode.trim();

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
      setCameraOn(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Hata oluştu.");
      lastCodeRef.current = "";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!cameraOn) return;

    const style = document.createElement("style");
    style.innerHTML = `
      #qr-reader__dashboard_section,
      #qr-reader__header_message {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        deliverOrder(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [cameraOn]);

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

    const { Html5Qrcode } = await import("html5-qrcode");
    const html5QrCode = new Html5Qrcode("qr-reader");

    try {
      const result = await html5QrCode.scanFile(file, true);
      await deliverOrder(result);
    } catch (err) {
      console.error(err);
      setMessage("❌ QR okunamadı.");
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-[#EFE4D6] bg-white p-6 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold text-[#2B1E16]">
        Sipariş Teslim Et
      </h1>

      <p className="mb-4 text-center text-sm text-[#6B5B4D]">
        QR okut, fotoğraf yükle veya teslim kodunu manuel gir.
      </p>

      {message && (
        <div className="mb-4 rounded-2xl bg-[#FFF8F0] px-4 py-3 text-center text-sm font-semibold text-[#5A3A27]">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Örn: ABC123"
          className="w-full rounded-xl border border-[#E7D4C4] px-3 py-3 text-center font-mono tracking-widest outline-none focus:border-[#C96C3A]"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCameraOn(true)}
            disabled={loading}
            className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Kamerayı Aç 📷
          </button>

          <button
            type="button"
            onClick={() => setCameraOn(false)}
            disabled={loading}
            className="flex-1 rounded-xl bg-gray-200 py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            Kapat ❌
          </button>
        </div>
        <p className="mt-3 rounded-xl bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
  Kamera Safari’de siyah görünürse Chrome ile açmayı deneyin.
</p>

        <label className="block w-full">
          <span className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C96C3A] to-[#B85E2E] py-3 text-sm font-semibold text-white shadow">
            📁 Fotoğraf Yükle
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <div
          id="qr-reader"
          className={`overflow-hidden rounded-2xl border ${
            cameraOn ? "bg-black" : "hidden bg-white"
          }`}
          style={{ minHeight: cameraOn ? "240px" : "0px" }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#48634C] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Teslim ediliyor..." : "Teslim Et"}
        </button>
      </form>
    </div>
  );
}

function ScanPageFallback() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-[#EFE4D6] bg-white p-6 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold text-[#2B1E16]">
        Sipariş Teslim Et
      </h1>
      <p className="mb-4 text-center text-sm text-[#6B5B4D]">
        Yükleniyor...
      </p>
      <div className="space-y-4" aria-busy="true">
        <div className="h-12 w-full animate-pulse rounded-xl border border-[#E7D4C4] bg-[#F7ECDF]/40" />
        <div className="flex gap-2">
          <div className="h-12 flex-1 animate-pulse rounded-xl bg-black/70" />
          <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-xl bg-[#C96C3A]/60" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-[#48634C]/70" />
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCF8F3] p-4">
      <Suspense fallback={<ScanPageFallback />}>
        <ScanPageInner />
      </Suspense>
    </main>
  );
}