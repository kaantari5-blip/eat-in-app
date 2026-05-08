"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshOrders() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE8D9] bg-[#F2F7F0] px-3 py-1 text-[11px] font-semibold text-[#48634C]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#48634C]" />
      Canlı yenileme açık
    </div>
  );
}