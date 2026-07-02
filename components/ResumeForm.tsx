"use client";

import { useActionState } from "react";
import { Textarea, labelClass } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { saveResume, type ResumeFormState } from "@/app/dashboard/resume/actions";

const initialState: ResumeFormState = {};

export default function ResumeForm({ initialText }: { initialText: string }) {
  const [state, formAction, pending] = useActionState(saveResume, initialState);

  return (
    <Card className="max-w-2xl p-6">
      <form action={formAction} className="flex flex-col gap-3">
        <label className={labelClass} htmlFor="resumeText">
          Resume text
        </label>
        <Textarea
          id="resumeText"
          name="resumeText"
          defaultValue={initialText}
          rows={16}
          placeholder="Paste your resume as plain text — used by AI Review and Cover Letter."
        />
        {state.saved && <p className="text-sm font-medium text-strong">Saved.</p>}
        {state.formError && <p className="text-sm text-weak">{state.formError}</p>}
        <Button type="submit" disabled={pending} className="self-start">
          {pending ? "Saving…" : "Save resume"}
        </Button>
      </form>
    </Card>
  );
}
