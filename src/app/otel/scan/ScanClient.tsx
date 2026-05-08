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
          setMessage("❌ Kamera başlatılamadı. İzni kontrol et veya fotoğraf yükle.");
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
            onClick={startCamera}
            disabled={loading || cameraOn}
            className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {cameraOn ? "Kamera Açık 📷" : "Kamerayı Aç 📷"}
          </button>

          <button
            type="button"
            onClick={stopCamera}
            disabled={loading || !cameraOn}
            className="flex-1 rounded-xl bg-gray-200 py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            Kapat ❌
          </button>
        </div>

        <p className="rounded-xl bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
          Kamera siyah görünürse sayfayı yenileyip tekrar açın veya fotoğraf yükleme seçeneğini kullanın.
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
          className={`overflow-hidden rounded-2xl border bg-black ${
            cameraOn ? "block" : "hidden"
          }`}
          style={{ minHeight: cameraOn ? "260px" : "0px" }}
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
      <p className="text-center text-sm text-[#6B5B4D]">Yükleniyor...</p>
    </div>
  );
}

export default function ScanClient() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCF8F3] p-4">
      <Suspense fallback={<ScanPageFallback />}>
        <ScanPageInner />
      </Suspense>
    </main>
  );
}