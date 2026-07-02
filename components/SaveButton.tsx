"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleBookmarkAction } from "@/app/actions/jobs";

export default function SaveButton({
  jobId,
  initialSaved,
  isLoggedIn,
  className,
}: {
  jobId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?next=/jobs/${jobId}`}
        className={`shrink-0 rounded-sm border border-rule-strong px-3 py-1.5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy ${className ?? ""}`}
      >
        Log in to save
      </Link>
    );
  }

  function handleClick() {
    setSaved((prev) => !prev);
    startTransition(async () => {
      try {
        const result = await toggleBookmarkAction(jobId);
        setSaved(result.saved);
      } catch {
        setSaved((prev) => !prev);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={saved}
      className={`shrink-0 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors disabled:opacity-60 ${
        saved
          ? "border-navy bg-navy text-paper"
          : "border-rule-strong text-ink-soft hover:border-navy hover:text-navy"
      } ${className ?? ""}`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
