"use client";

import Link from "next/link";
import { Suspense } from "react";
import { register } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "customer";

  return (
    <form action={register} className="space-y-4">
      {/* AD SOYAD */}
      <input
        name="full_name"
        required
        placeholder="Ad Soyad"
        className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
      />

      {/* EMAIL */}
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
      />

      {/* ŞİFRE */}
      <input
        name="password"
        type="password"
        required
        placeholder="Şifre"
        className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
      />

      {/* ROLE SEÇİMİ */}
      <div className="space-y-2">
        <label className="text-sm text-[#6B5B4D]">Hesap türü</label>

        <select
          name="role"
          defaultValue={roleFromUrl}
          className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
        >
          <option value="customer">Müşteri</option>
          <option value="hotel_owner">İşletme</option>
        </select>
      </div>

      <button className="w-full rounded-2xl bg-[#C96C3A] py-3 text-white font-medium hover:bg-[#B85E2E]">
        Kayıt Ol
      </button>
    </form>
  );
}

function RegisterFormFallback() {
  return (
    <form className="space-y-4" aria-busy="true">
      <div className="h-12 w-full rounded-2xl border border-[#E3CBB7] bg-[#F7ECDF]/40 animate-pulse" />
      <div className="h-12 w-full rounded-2xl border border-[#E3CBB7] bg-[#F7ECDF]/40 animate-pulse" />
      <div className="h-12 w-full rounded-2xl border border-[#E3CBB7] bg-[#F7ECDF]/40 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-[#F7ECDF]/60 animate-pulse" />
        <div className="h-12 w-full rounded-2xl border border-[#E3CBB7] bg-[#F7ECDF]/40 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-2xl bg-[#C96C3A]/60 animate-pulse" />
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FCF8F3] flex items-center justify-center px-6 text-[#2B1E16]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#E7D4C4] bg-[#FFFDF9] p-8 shadow-[0_10px_40px_rgba(120,72,36,0.08)] space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kayıt Ol</h1>
          <p className="mt-2 text-sm text-[#6B5B4D]">
            Hemen hesap oluştur ve sürpriz kutuları keşfet.
          </p>
        </div>

        <Suspense fallback={<RegisterFormFallback />}>
          <RegisterForm />
        </Suspense>

        <p className="text-sm text-[#7A6657]">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="text-[#C96C3A] font-medium">
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}