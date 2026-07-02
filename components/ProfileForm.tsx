"use client";

import { useActionState } from "react";
import { inputClass, labelClass, submitClass } from "./formStyles";
import { saveProfile, type ProfileFormState } from "@/app/dashboard/profile/actions";

const initialState: ProfileFormState = {};

export default function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3">
      <label className={labelClass} htmlFor="fullName">
        Full name
      </label>
      <input
        id="fullName"
        name="fullName"
        defaultValue={initialName}
        className={inputClass}
      />
      {state.saved && <p className="text-sm text-strong">Saved.</p>}
      {state.formError && <p className="text-sm text-weak">{state.formError}</p>}
      <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
