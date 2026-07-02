"use client";

import { useState, useTransition } from "react";
import type { ApplicationStatus } from "@/lib/types";
import type { JobApplicant } from "@/lib/queries/applications";
import { updateApplicantStatusAction } from "@/app/employer/jobs/actions";

const STATUS_OPTIONS: ApplicationStatus[] = ["applied", "reviewing", "accepted", "rejected"];

export default function ApplicantRow({
  applicant,
  jobId,
}: {
  applicant: JobApplicant;
  jobId: string;
}) {
  const [status, setStatus] = useState(applicant.status);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: ApplicationStatus) {
    setStatus(next);
    startTransition(async () => {
      await updateApplicantStatusAction(applicant.id, next, jobId);
    });
  }

  return (
    <div className="border border-rule bg-paper-raised px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-semibold text-ink">{applicant.candidateName}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            Applied {new Date(applicant.createdAt).toLocaleDateString("en-US")}
          </p>
        </div>
        <select
          value={status}
          onChange={(event) => handleChange(event.target.value as ApplicationStatus)}
          disabled={isPending}
          className="rounded-sm border border-rule-strong bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.06em] text-ink-soft disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {applicant.coverLetter && (
        <p className="mt-3 whitespace-pre-line border-t border-rule pt-3 text-sm text-ink-soft">
          {applicant.coverLetter}
        </p>
      )}
    </div>
  );
}
