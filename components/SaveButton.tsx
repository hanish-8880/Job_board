"use client";

import { useSavedJobs } from "./SavedJobsProvider";

export default function SaveButton({
  jobId,
  className,
}: {
  jobId: string;
  className?: string;
}) {
  const { isSaved, toggle } = useSavedJobs();
  const saved = isSaved(jobId);

  return (
    <button
      type="button"
      onClick={() => toggle(jobId)}
      aria-pressed={saved}
      className={`shrink-0 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
        saved
          ? "border-navy bg-navy text-paper"
          : "border-rule-strong text-ink-soft hover:border-navy hover:text-navy"
      } ${className ?? ""}`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
