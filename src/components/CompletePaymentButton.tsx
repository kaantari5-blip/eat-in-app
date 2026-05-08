"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CompletePaymentButtonProps = {
  packageId: string;
  amount: number;
};

export default function CompletePaymentButton({
  packageId,
  amount,
}: CompletePaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const res = await fetch("/api/odeme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.error || "Ödeme başlatılamadı.");
        return;
      }

      router.push(data.redirectUrl);
    } catch (error) {
      console.error(error);
      alert("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
    >
      {loading ? "Ödeme başlatılıyor..." : "Satın Al"}
    </button>
  );
}