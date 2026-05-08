import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FCF8F3] flex items-center justify-center px-6 text-[#2B1E16]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#E7D4C4] bg-[#FFFDF9] p-8 shadow-[0_10px_40px_rgba(120,72,36,0.08)] space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Giriş Yap</h1>
          <p className="mt-2 text-sm text-[#6B5B4D]">
            Hesabına giriş yap ve sürpriz kutuları keşfet.
          </p>
        </div>

        <form action={login} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
          />

          <input
            name="password"
            type="password"
            placeholder="Şifre"
            className="w-full rounded-2xl border border-[#E3CBB7] px-4 py-3 outline-none focus:border-[#C96C3A]"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#C96C3A] py-3 text-white font-medium hover:bg-[#B85E2E]"
          >
            Giriş Yap
          </button>
        </form>

        <p className="text-sm text-[#7A6657]">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="text-[#C96C3A] font-medium">
            Kayıt ol
          </Link>
        </p>
      </div>
    </main>
  );
}