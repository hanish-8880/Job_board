"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_IDS,
  getAppliedIdsSnapshot,
  recordApplication,
  subscribeAppliedIds,
} from "@/lib/storage";

export default function ApplyPanel({
  jobId,
  company,
}: {
  jobId: string;
  company: string;
}) {
  const appliedIds = useSyncExternalStore(
    subscribeAppliedIds,
    getAppliedIdsSnapshot,
    () => EMPTY_IDS
  );
  const applied = appliedIds.includes(jobId);

  if (applied) {
    return (
      <div className="rounded-sm border border-strong bg-strong-bg px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-strong">
          Application recorded
        </p>
        <p className="mt-2 text-sm text-ink">
          This is a local demo, so nothing was actually sent to {company}.
          Your application status for this listing is saved in this browser
          only.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => recordApplication(jobId)}
      className="w-full rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink sm:w-auto"
    >
      Apply for this role
    </button>
  );
}
