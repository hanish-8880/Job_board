"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  EMPTY_JOBS,
  getPostedJobsSnapshot,
  mergeWithSeedJobs,
  subscribePostedJobs,
} from "@/lib/storage";
import { DEFAULT_FILTERS, filterJobs, type JobFilters } from "@/lib/filters";
import JobCard from "@/components/JobCard";
import SearchFilters from "@/components/SearchFilters";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const postedJobs = useSyncExternalStore(
    subscribePostedJobs,
    getPostedJobsSnapshot,
    () => EMPTY_JOBS
  );
  const jobs = useMemo(() => mergeWithSeedJobs(postedJobs), [postedJobs]);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);

  const visibleJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Browse roles
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Every listing carries a Signal Score computed from its own text —
          salary disclosure, concrete responsibilities, substantive
          description — and a check for phrasing common in exploitative
          postings. Both are visible in full on the listing page, not hidden
          behind a single number.
        </p>
      </div>

      <div className="mt-6">
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
          {visibleJobs.length} role{visibleJobs.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {visibleJobs.length === 0 ? (
          <EmptyState
            title="No matches"
            message="Try a broader search term or clear a filter — nothing here matches all of the current criteria."
          />
        ) : (
          visibleJobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
