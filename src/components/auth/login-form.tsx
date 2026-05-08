"use client";

import { useActionState } from "react";
import { signInAction } from "@/lib/auth/actions";
import { tr } from "@/messages/tr/tr";

export function LoginForm({ next = "/" }: { next?: string }) {
  const [state, formAction] = useActionState(signInAction, { ok: true });

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.login.email}
        </label>
        <input
          name="email"
          type="email"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {tr.auth.login.password}
        </label>
        <input
          name="password"
          type="password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Error */}
      {!state.ok && state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {/* Button */}
      <button
        type="submit"
        className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
      >
        {tr.auth.login.submit}
      </button>
    </form>
  );
}