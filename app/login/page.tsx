"use client";

import { useActionState } from "react";
import Link from "next/link";
import { errorClass, inputClass, labelClass, submitClass } from "@/components/formStyles";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { errors: {} };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Log in</h1>
        <p className="mt-2 text-sm text-ink-soft">Welcome back.</p>
      </div>

      <div className="mt-6">
        <GoogleAuthButton />
      </div>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-rule" />
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
          or with email
        </span>
        <div className="h-px flex-1 bg-rule" />
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`${inputClass} mt-1`}
            placeholder="you@example.com"
          />
          {state.errors.email && <p className={errorClass}>{state.errors.email}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`${inputClass} mt-1`}
          />
          {state.errors.password && <p className={errorClass}>{state.errors.password}</p>}
        </div>

        {state.formError && <p className={errorClass}>{state.formError}</p>}

        <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-navy underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
