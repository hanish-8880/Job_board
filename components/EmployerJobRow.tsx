"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Job, JobStatus } from "@/lib/types";
import { deleteJobAction, toggleJobStatusAction } from "@/app/employer/jobs/actions";

const actionButtonClass =
  "rounded-sm border border-rule-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy disabled:opacity-60";

export default function EmployerJobRow({ job }: { job: Job }) {
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleStatus() {
    const next: JobStatus = status === "published" ? "draft" : "published";
    setStatus(next);
    startTransition(async () => {
      await toggleJobStatusAction(job.id, next);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteJobAction(job.id);
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-paper-raised px-4 py-3">
      <div className="min-w-0">
        <Link href={`/jobs/${job.id}`} className="font-serif text-lg font-semibold text-ink hover:underline">
          {job.title}
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
          {status} · {job.mode} · {job.level}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/employer/jobs/${job.id}/applicants`} className={actionButtonClass}>
          Applicants
        </Link>
        <Link href={`/employer/jobs/${job.id}/edit`} className={actionButtonClass}>
          Edit
        </Link>
        <button type="button" onClick={toggleStatus} disabled={isPending} className={actionButtonClass}>
          {status === "published" ? "Unpublish" : "Publish"}
        </button>
        {confirmingDelete ? (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-sm border border-weak px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-weak disabled:opacity-60"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className={actionButtonClass}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-sm border border-rule-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-weak hover:text-weak"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
