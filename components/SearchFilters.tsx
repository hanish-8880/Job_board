"use client";

import type { JobFilters } from "@/lib/filters";
import type { ExperienceLevel, WorkMode } from "@/lib/types";

const MODE_OPTIONS: { value: WorkMode | "all"; label: string }[] = [
  { value: "all", label: "All modes" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
];

const LEVEL_OPTIONS: { value: ExperienceLevel | "all"; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const selectClass =
  "rounded-sm border border-rule-strong bg-paper-raised px-3 py-2 font-mono text-xs uppercase tracking-[0.06em] text-ink-soft transition-colors focus:border-navy";

export default function SearchFilters({
  filters,
  onChange,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex-1">
        <span className="sr-only">Search jobs by title, company, or tag</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search title, company, or tag…"
          className="w-full rounded-sm border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-navy"
        />
      </label>
      <label>
        <span className="sr-only">Filter by work mode</span>
        <select
          value={filters.mode}
          onChange={(e) =>
            onChange({ ...filters, mode: e.target.value as JobFilters["mode"] })
          }
          className={selectClass}
        >
          {MODE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Filter by experience level</span>
        <select
          value={filters.level}
          onChange={(e) =>
            onChange({ ...filters, level: e.target.value as JobFilters["level"] })
          }
          className={selectClass}
        >
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
