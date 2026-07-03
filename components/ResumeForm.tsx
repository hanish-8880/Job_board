"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { Textarea, labelClass } from "./ui/fields";
import Button, { buttonVariants } from "./ui/Button";
import Card from "./ui/Card";
import { saveResume, type ResumeFormState } from "@/app/dashboard/resume/actions";

const initialState: ResumeFormState = {};

export default function ResumeForm({ initialText }: { initialText: string }) {
  const [state, formAction, pending] = useActionState(saveResume, initialState);
  const [resumeText, setResumeText] = useState(initialText);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/resume/parse", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't read that file.");
      setResumeText(data.text);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="max-w-2xl p-6">
      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <label className={labelClass} htmlFor="resumeText">
            Resume text
          </label>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-3.5 w-3.5" aria-hidden />
              )}
              {uploading ? "Reading file…" : "Upload from computer"}
            </button>
          </div>
        </div>
        <p className="-mt-1.5 text-xs text-ink-faint">
          Accepts .pdf, .docx, or .txt (max 5MB) — extracts the text so you
          can review and edit it below before saving.
        </p>
        {uploadError && <p className="text-sm text-weak">{uploadError}</p>}
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
