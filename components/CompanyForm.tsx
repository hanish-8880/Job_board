"use client";

import { useActionState } from "react";
import { errorClass, inputClass, labelClass, submitClass } from "./formStyles";
import { saveCompany, type CompanyFormState } from "@/app/employer/company/actions";

const initialState: CompanyFormState = { errors: {} };

export default function CompanyForm({
  initialValues,
}: {
  initialValues?: { name: string; website: string; description: string };
}) {
  const [state, formAction, pending] = useActionState(saveCompany, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="name">
          Company name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={initialValues?.name}
          className={`${inputClass} mt-1`}
        />
        {state.errors.name && <p className={errorClass}>{state.errors.name}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="website">
          Website (optional)
        </label>
        <input
          id="website"
          name="website"
          defaultValue={initialValues?.website}
          className={`${inputClass} mt-1`}
          placeholder="https://example.com"
        />
        {state.errors.website && <p className={errorClass}>{state.errors.website}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialValues?.description}
          rows={4}
          className={`${inputClass} mt-1`}
        />
      </div>

      {state.formError && <p className={errorClass}>{state.formError}</p>}

      <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
        {pending ? "Saving…" : "Save company"}
      </button>
    </form>
  );
}
