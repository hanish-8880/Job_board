"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  EMPTY_JOBS,
  getPostedJobsSnapshot,
  mergeWithSeedJobs,
  subscribePostedJobs,
} from "@/lib/storage";
import { useSavedJobs } from "@/components/SavedJobsProvider";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";

export default function SavedPage() {
  const { savedIds } = useSavedJobs();
  const postedJobs = useSyncExternalStore(
    subscribePostedJobs,
    getPostedJobsSnapshot,
    () => EMPTY_JOBS
  );
  const allJobs = useMemo(() => mergeWithSeedJobs(postedJobs), [postedJobs]);
  const savedJobs = allJobs.filter((job) => savedIds.includes(job.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Saved roles</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Saved locally in this browser — nothing here is uploaded anywhere,
          so it won&apos;t follow you to a different device or browser.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {savedJobs.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            message="Save a role from Browse and it'll show up here."
          />
        ) : (
          savedJobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
