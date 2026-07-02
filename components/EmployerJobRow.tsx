"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Pencil, Trash2, Users } from "lucide-react";
import type { Job, JobStatus } from "@/lib/types";
import { deleteJobAction, toggleJobStatusAction } from "@/app/employer/jobs/actions";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { buttonVariants } from "./ui/Button";

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
    <Card className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`} className="text-base font-bold text-ink hover:underline">
            {job.title}
          </Link>
          <Badge variant={status === "published" ? "strong" : "neutral"}>{status}</Badge>
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">
          {job.mode} · {job.level}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/employer/jobs/${job.id}/applicants`}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <Users className="h-3.5 w-3.5" aria-hidden />
          Applicants
        </Link>
        <Link
          href={`/employer/jobs/${job.id}/edit`}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit
        </Link>
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          {status === "published" ? (
            <EyeOff className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Eye className="h-3.5 w-3.5" aria-hidden />
          )}
          {status === "published" ? "Unpublish" : "Publish"}
        </button>
        {confirmingDelete ? (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className={buttonVariants({ variant: "danger", size: "sm" })}
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Delete
          </button>
        )}
      </div>
    </Card>
  );
}
