"use client";

import { useActionState } from "react";
import { Input, labelClass } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { saveProfile, type ProfileFormState } from "@/app/dashboard/profile/actions";

const initialState: ProfileFormState = {};

export default function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);

  return (
    <Card className="max-w-md p-6">
      <form action={formAction} className="flex flex-col gap-3">
        <label className={labelClass} htmlFor="fullName">
          Full name
        </label>
        <Input id="fullName" name="fullName" defaultValue={initialName} />
        {state.saved && <p className="text-sm font-medium text-strong">Saved.</p>}
        {state.formError && <p className="text-sm text-weak">{state.formError}</p>}
        <Button type="submit" disabled={pending} className="self-start">
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Card>
  );
}
