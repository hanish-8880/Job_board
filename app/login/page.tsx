"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { Input } from "@/components/ui/fields";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { errors: {} };

const fieldLabel = "block text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft";
const fieldError = "mt-1.5 text-sm text-weak";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Radio className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Log in</h1>
        <p className="mt-2 text-sm text-ink-soft">Welcome back.</p>
      </div>

      <Card className="mt-6 p-6">
        <GoogleAuthButton />
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-ink-faint">or with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form action={formAction} className="flex flex-col gap-5">
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
            <Input id="password" name="password" type="password" className="mt-1.5" />
            {state.errors.password && <p className={fieldError}>{state.errors.password}</p>}
          </div>

          {state.formError && <p className={fieldError}>{state.formError}</p>}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary underline underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
}
