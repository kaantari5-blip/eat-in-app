"use client";

import { useState } from "react";
import { deliverOrderByCode } from "@/lib/actions/order";

export default function ManualDeliveryForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanedCode = code.trim().toUpperCase();
  const isSuccess = message.startsWith("✅");
  const isError = message.startsWith("❌");

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!cleanedCode || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await deliverOrderByCode(cleanedCode);

      if (res.success) {
        setMessage("✅ Sipariş başarıyla teslim edildi");
        setCode("");
      } else {
        setMessage(`❌ ${res.error || "Teslim işlemi başarısız oldu"}`);
      }
    } catch {
      setMessage("❌ Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#E7D4C4] bg-white p-6 shadow-sm"
    >
      <label
        htmlFor="manual-delivery-code"
        className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#9B7E6A]"
      >
        Teslim Kodu
      </label>

      <input
        id="manual-delivery-code"
        value={code}
        onChange={(e) => {
          const value = e.target.value.replace(/\s/g, "").toUpperCase();
          setCode(value);
        }}
        placeholder="ABC123"
        maxLength={12}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="w-full rounded-2xl border border-[#E7D4C4] bg-[#FFF8F0] px-4 py-4 text-center font-mono text-2xl font-extrabold uppercase tracking-[0.35em] text-[#2B1E16] outline-none transition placeholder:text-[#D9C7B5] focus:border-[#C96C3A] focus:bg-white focus:ring-2 focus:ring-[#C96C3A]/25"
      />

      <div className="mt-2 flex items-center justify-between text-[11px] text-[#9B7E6A]">
        <span>Büyük/küçük harf fark etmez</span>
        <span className="font-mono font-semibold">{cleanedCode.length}/6</span>
      </div>

      <button
        type="submit"
        disabled={loading || !cleanedCode}
        className="mt-4 w-full rounded-2xl bg-[#C96C3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B85E2E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Teslim ediliyor..." : "Teslim Et"}
      </button>

      {message && (
        <p
          className={`mt-4 rounded-2xl border px-4 py-3 text-center text-sm font-semibold ${
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[#E7D4C4] bg-[#FFF8F0] text-[#2B1E16]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}