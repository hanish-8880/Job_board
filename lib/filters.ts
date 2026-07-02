import type { ExperienceLevel, Job, WorkMode } from "./types";

export interface JobFilters {
  query: string;
  mode: WorkMode | "all";
  level: ExperienceLevel | "all";
}

export const DEFAULT_FILTERS: JobFilters = {
  query: "",
  mode: "all",
  level: "all",
};

/** Matches free text against title, company, and tags — nowhere else. */
function matchesQuery(job: Job, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return (
    job.title.toLowerCase().includes(needle) ||
    job.company.toLowerCase().includes(needle) ||
    job.tags.some((tag) => tag.toLowerCase().includes(needle))
  );
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter(
    (job) =>
      matchesQuery(job, filters.query) &&
      (filters.mode === "all" || job.mode === filters.mode) &&
      (filters.level === "all" || job.level === filters.level)
  );
}
