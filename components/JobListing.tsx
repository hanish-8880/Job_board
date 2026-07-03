"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { Job } from "@/lib/types";
import { DEFAULT_FILTERS, filterJobs, type JobFilters } from "@/lib/filters";
import JobCard from "@/components/JobCard";
import SearchFilters from "@/components/SearchFilters";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";

export default function JobListing({
  jobs,
  bookmarkedIds,
}: {
  jobs: Job[];
  bookmarkedIds: string[];
}) {
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const visibleJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Browse roles"
        description="Every listing carries a transparent Signal Score and a red-flag check, computed from its own text."
      />

      <div className="mt-6">
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      <p className="mt-4 text-sm font-medium text-ink-soft">
        {visibleJobs.length} role{visibleJobs.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {visibleJobs.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matches"
            message="Try a broader search term or clear a filter — nothing here matches all of the current criteria."
          />
        ) : (
          visibleJobs.map((job, index) => (
            <Reveal key={job.id} delay={Math.min(index, 6) * 0.04}>
              <JobCard
                job={job}
                initialSaved={bookmarkedIds.includes(job.id)}
                isLoggedIn
              />
            </Reveal>
          ))
        )}
      </div>
    </div>
  );
}
