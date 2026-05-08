"use client";

import { useFormStatus } from "react-dom";

export default function SubmitOrderButton({ isSoldOut }: { isSoldOut: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || isSoldOut}
      className="block w-full rounded-2xl bg-[#C96C3A] px-5 py-4 text-center text-base font-bold text-white shadow-lg disabled:opacity-50"
    >
      {pending ? "İşleniyor..." : isSoldOut ? "Stok Tükendi" : "Ödemeyi Tamamla"}
    </button>
  );
}