"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PickupQRCode({
  orderId,
  code,
}: {
  orderId: string;
  code: string;
}) {
  const value = JSON.stringify({
    order_id: orderId,
    code,
  });

  return (
    <div className="rounded-2xl border border-[#E7D4C4] bg-white p-4 text-center shadow-sm">
      <QRCodeSVG value={value} size={120} />

      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#9B7E6A]">
        Teslim QR
      </p>

      <p className="mt-1 text-lg font-bold tracking-widest text-[#C96C3A]">
        {code}
      </p>
    </div>
  );
}