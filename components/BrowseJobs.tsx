"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { Job } from "@/lib/types";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import { DEFAULT_FILTERS, filterJobs, type JobFilters } from "@/lib/filters";
import JobCard from "@/components/JobCard";
import SearchFilters from "@/components/SearchFilters";
import EmptyState from "@/components/EmptyState";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Reveal from "@/components/ui/Reveal";

export default function BrowseJobs({
  jobs,
  bookmarkedIds,
  isLoggedIn,
}: {
  jobs: Job[];
  bookmarkedIds: string[];
  isLoggedIn: boolean;
}) {
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const visibleJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  const stats = useMemo(() => {
    const strongSignalCount = jobs.filter((job) => computeSignal(job).tier === "strong").length;
    const redFlagCount = jobs.filter((job) => detectRedFlags(job).length > 0).length;
    return { totalJobs: jobs.length, strongSignalCount, redFlagCount };
  }, [jobs]);

  // The hero's preview card shows whichever real listing currently scores
  // highest — the product demonstrating itself on its own best example,
  // not a mockup.
  const previewJob = useMemo(() => {
    if (jobs.length === 0) return null;
    return [...jobs].sort((a, b) => computeSignal(b).score - computeSignal(a).score)[0];
  }, [jobs]);

  return (
    <div>
      <Hero {...stats} previewJob={previewJob} />

      <HowItWorks />

      <div id="roles" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6">
        <SearchFilters filters={filters} onChange={setFilters} />

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
                  isLoggedIn={isLoggedIn}
                />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
