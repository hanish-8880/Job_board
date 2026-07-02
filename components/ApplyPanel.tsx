"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { applyToJobAction } from "@/app/actions/jobs";
import Button, { buttonVariants } from "./ui/Button";
import { Textarea } from "./ui/fields";

export default function ApplyPanel({
  jobId,
  company,
  isLoggedIn,
  initialApplied,
}: {
  jobId: string;
  company: string;
  isLoggedIn: boolean;
  initialApplied: boolean;
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link href={`/login?next=/jobs/${jobId}`} className={buttonVariants()}>
        Log in to apply
      </Link>
    );
  }

  if (applied) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-strong/25 bg-strong-bg px-4 py-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-strong" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-strong">Application submitted</p>
          <p className="mt-1 text-sm text-ink">
            Your application to {company} is recorded. Track its status from
            your dashboard&apos;s Applied page.
          </p>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Send className="h-4 w-4" aria-hidden />
        Apply for this role
      </Button>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await applyToJobAction(jobId, coverLetter);
        setApplied(true);
      } catch {
        setError("Something went wrong submitting your application. Try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-background p-4">
      <label
        className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft"
        htmlFor="coverLetter"
      >
        Cover letter (optional)
      </label>
      <Textarea
        id="coverLetter"
        rows={5}
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        className="mt-1.5"
        placeholder="Optional — write one here, or generate a draft with the AI Cover Letter tool from your dashboard and paste it in."
      />
      {error && <p className="mt-1.5 text-sm text-weak">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit application"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
