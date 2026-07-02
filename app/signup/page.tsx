"use client";

import { useActionState } from "react";
import Link from "next/link";
import { errorClass, inputClass, labelClass, submitClass } from "@/components/formStyles";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = { errors: {} };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Create an account</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Real accounts, stored in a real Postgres database via Supabase —
          this is the full-stack version of Signalboard.
        </p>
      </div>

      {state.needsConfirmation ? (
        <div className="mt-6 rounded-sm border border-strong bg-strong-bg px-4 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-strong">
            Check your email
          </p>
          <p className="mt-2 text-sm text-ink">
            Your account was created. Click the confirmation link we sent
            you, then log in.
          </p>
        </div>
      ) : (
        <>
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
              <label className={labelClass} htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                className={`${inputClass} mt-1`}
                placeholder="Jordan Rivera"
              />
              {state.errors.fullName && <p className={errorClass}>{state.errors.fullName}</p>}
            </div>

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
                placeholder="At least 8 characters"
              />
              {state.errors.password && <p className={errorClass}>{state.errors.password}</p>}
            </div>

            <fieldset>
              <legend className={labelClass}>I&apos;m here to...</legend>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="radio" name="role" value="candidate" defaultChecked />
                  Find a job
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="radio" name="role" value="employer" />
                  Hire
                </label>
              </div>
              {state.errors.role && <p className={errorClass}>{state.errors.role}</p>}
            </fieldset>

            {state.formError && <p className={errorClass}>{state.formError}</p>}

            <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-navy underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
