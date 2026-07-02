"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
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
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-primary hover:text-primary ${className ?? ""}`}
      >
        <Bookmark className="h-4 w-4" aria-hidden />
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
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        saved
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-strong text-ink-soft hover:border-primary hover:text-primary"
      } ${className ?? ""}`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
