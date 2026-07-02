"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Briefcase, Radio, Search } from "lucide-react";
import { Input } from "@/components/ui/fields";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = { errors: {} };

const fieldLabel = "block text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft";
const fieldError = "mt-1.5 text-sm text-weak";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [role, setRole] = useState<"candidate" | "employer">("candidate");

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Radio className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Create an account</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Real accounts, stored in a real Postgres database via Supabase.
        </p>
      </div>

      <Card className="mt-6 p-6">
        {state.needsConfirmation ? (
          <div className="rounded-lg border border-strong/25 bg-strong-bg px-4 py-4">
            <p className="text-sm font-semibold text-strong">Check your email</p>
            <p className="mt-2 text-sm text-ink">
              Your account was created. Click the confirmation link we sent
              you, then log in.
            </p>
          </div>
        ) : (
          <>
            <GoogleAuthButton />
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-ink-faint">or with email</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form action={formAction} className="flex flex-col gap-5">
              <div>
                <span className={fieldLabel}>I&apos;m here to...</span>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                      role === "candidate"
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border-strong text-ink-soft hover:border-primary"
                    }`}
                  >
                    <Search className="h-5 w-5" aria-hidden />
                    Find a job
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                      role === "employer"
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border-strong text-ink-soft hover:border-primary"
                    }`}
                  >
                    <Briefcase className="h-5 w-5" aria-hidden />
                    Hire
                  </button>
                </div>
                <input type="hidden" name="role" value={role} />
                {state.errors.role && <p className={fieldError}>{state.errors.role}</p>}
              </div>

              <div>
                <label className={fieldLabel} htmlFor="fullName">
                  Full name
                </label>
                <Input id="fullName" name="fullName" className="mt-1.5" placeholder="Jordan Rivera" />
                {state.errors.fullName && <p className={fieldError}>{state.errors.fullName}</p>}
              </div>

              <div>
                <label className={fieldLabel} htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1.5"
                  placeholder="you@example.com"
                />
                {state.errors.email && <p className={fieldError}>{state.errors.email}</p>}
              </div>

              <div>
                <label className={fieldLabel} htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="mt-1.5"
                  placeholder="At least 8 characters"
                />
                {state.errors.password && <p className={fieldError}>{state.errors.password}</p>}
              </div>

              {state.formError && <p className={fieldError}>{state.formError}</p>}

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </>
        )}
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
