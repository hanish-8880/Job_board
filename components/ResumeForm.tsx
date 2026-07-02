"use client";

import { useActionState } from "react";
import { inputClass, labelClass, submitClass } from "./formStyles";
import { saveResume, type ResumeFormState } from "@/app/dashboard/resume/actions";

const initialState: ResumeFormState = {};

export default function ResumeForm({ initialText }: { initialText: string }) {
  const [state, formAction, pending] = useActionState(saveResume, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-3">
      <label className={labelClass} htmlFor="resumeText">
        Resume text
      </label>
      <textarea
        id="resumeText"
        name="resumeText"
        defaultValue={initialText}
        rows={16}
        className={inputClass}
        placeholder="Paste your resume as plain text — used by AI Review and Cover Letter."
      />
      {state.saved && <p className="text-sm text-strong">Saved.</p>}
      {state.formError && <p className="text-sm text-weak">{state.formError}</p>}
      <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
        {pending ? "Saving…" : "Save resume"}
      </button>
    </form>
  );
}
