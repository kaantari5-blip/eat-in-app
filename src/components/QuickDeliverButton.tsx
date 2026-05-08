"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickDeliverButton({
  pickupCode,
}: {
  pickupCode: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDeliver() {
    if (!pickupCode || loading) return;

    const ok = confirm("Bu siparişi teslim edildi olarak işaretleyelim mi?");
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch("/api/orders/teslim-et", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.error || "Teslim edilemedi.");
        return;
      }

      alert("✅ Sipariş teslim edildi!");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDeliver}
      disabled={loading}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
    >
      {loading ? "Teslim ediliyor..." : "⚡ Hızlı Teslim"}
    </button>
  );
}