"use client";

import { useActionState, useState } from "react";
import { signUpAction } from "@/lib/auth/actions";
import { tr } from "@/messages/tr/tr";

const initialState = {
  ok: true as boolean,
  error: undefined as string | undefined,
};

export function RegisterForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [accountType, setAccountType] = useState<"customer" | "hotel">("customer");

  const isHotel = accountType === "hotel";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="as" value={accountType} />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAccountType("customer")}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
            !isHotel
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          {tr.auth.register.asCustomer}
        </button>

        <button
          type="button"
          onClick={() => setAccountType("hotel")}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
            isHotel
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          {tr.auth.register.asHotel}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {isHotel ? "Yetkili Ad Soyad" : tr.auth.register.fullName}
        </label>
        <input
          name="fullName"
          type="text"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {isHotel && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Otel Adı</label>
            <input
              name="hotelName"
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Şehir</label>
              <input
                name="city"
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vergi Numarası</label>
              <input
                name="taxNumber"
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Adres</label>
            <input
              name="addressLine"
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.register.email}
        </label>
        <input
          name="email"
          type="email"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.register.phone}
        </label>
        <input
          name="phone"
          type="tel"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.register.password}
        </label>
        <input
          name="password"
          type="password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.register.passwordConfirm}
        </label>
        <input
          name="passwordConfirm"
          type="password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input
          name="termsAccept"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <span>{tr.auth.register.termsAccept}</span>
      </label>

      {!state.ok && state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
      >
        {isHotel ? tr.auth.register.asHotel : tr.auth.register.submit}
      </button>

      <p className="text-center text-sm text-gray-500">
        {tr.auth.register.hasAccount}{" "}
        <a href="/giris" className="font-medium text-black underline underline-offset-4">
          {tr.auth.register.login}
        </a>
      </p>
    </form>
  );
}