"use client";

import { useEffect, useState } from "react";

export default function ToastMessage({
  message,
}: {
  message: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 shadow-lg">
        <span className="text-xl">✅</span>
        <p className="text-sm font-semibold text-emerald-800">
          {message}
        </p>
      </div>
    </div>
  );
}