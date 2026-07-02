"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { applyToJobAction } from "@/app/actions/jobs";

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
      <Link
        href={`/login?next=/jobs/${jobId}`}
        className="inline-block rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink"
      >
        Log in to apply
      </Link>
    );
  }

  if (applied) {
    return (
      <div className="rounded-sm border border-strong bg-strong-bg px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-strong">
          Application submitted
        </p>
        <p className="mt-2 text-sm text-ink">
          Your application to {company} is recorded. Track its status from
          your dashboard&apos;s Applied page.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink"
      >
        Apply for this role
      </button>
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
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-rule bg-paper-raised p-4"
    >
      <label
        className="block font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
        htmlFor="coverLetter"
      >
        Cover letter (optional)
      </label>
      <textarea
        id="coverLetter"
        rows={5}
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        className="mt-1 w-full rounded-sm border border-rule-strong bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-navy"
        placeholder="Optional — write one here, or generate a draft with the AI Cover Letter tool from your dashboard and paste it in."
      />
      {error && <p className="mt-1 text-sm text-weak">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink disabled:opacity-60"
        >
          {isPending ? "Submitting…" : "Submit application"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-sm border border-rule-strong px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-navy hover:text-navy"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
