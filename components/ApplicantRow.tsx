"use client";

import { useState, useTransition } from "react";
import type { ApplicationStatus } from "@/lib/types";
import type { JobApplicant } from "@/lib/queries/applications";
import { updateApplicantStatusAction } from "@/app/employer/jobs/actions";
import Card from "./ui/Card";
import { Select } from "./ui/fields";

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
    <Card className="px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-ink">{applicant.candidateName}</p>
          <p className="text-xs text-ink-faint">
            Applied{" "}
            {new Date(applicant.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
          </p>
        </div>
        <Select
          value={status}
          onChange={(event) => handleChange(event.target.value as ApplicationStatus)}
          disabled={isPending}
          className="w-auto py-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
      {applicant.coverLetter && (
        <p className="mt-3 whitespace-pre-line border-t border-border pt-3 text-sm text-ink-soft">
          {applicant.coverLetter}
        </p>
      )}
    </Card>
  );
}
