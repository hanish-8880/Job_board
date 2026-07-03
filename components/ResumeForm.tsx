"use client";

import { useActionState, useState } from "react";
import { Textarea, labelClass } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";
import ResumeUploadButton from "./ResumeUploadButton";
import { saveResume, type ResumeFormState } from "@/app/dashboard/resume/actions";

const initialState: ResumeFormState = {};

export default function ResumeForm({ initialText }: { initialText: string }) {
  const [state, formAction, pending] = useActionState(saveResume, initialState);
  const [resumeText, setResumeText] = useState(initialText);

  return (
    <Card className="max-w-2xl p-6">
      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <label className={labelClass} htmlFor="resumeText">
            Resume text
          </label>
          <ResumeUploadButton onExtracted={setResumeText} />
        </div>
        <p className="-mt-1.5 text-xs text-ink-faint">
          Accepts .pdf, .docx, or .txt (max 5MB) — extracts the text so you
          can review and edit it below before saving.
        </p>
        <Textarea
          id="resumeText"
          name="resumeText"
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
          rows={16}
          placeholder="Paste your resume as plain text, or upload a file above."
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
