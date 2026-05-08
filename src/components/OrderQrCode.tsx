"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function OrderQrCode({ value }: { value: string }) {
  return (
    <div className="inline-flex rounded-2xl bg-white p-3 ring-1 ring-[#EFE4D6]">
      <QRCodeCanvas value={value} size={128} />
    </div>
  );
}