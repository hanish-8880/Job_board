"use client";

import { Search } from "lucide-react";
import type { JobFilters } from "@/lib/filters";
import type { ExperienceLevel, WorkMode } from "@/lib/types";
import { Select } from "@/components/ui/fields";
import Card from "@/components/ui/Card";

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

export default function SearchFilters({
  filters,
  onChange,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}) {
  return (
    <Card className="p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search jobs by title, company, or tag</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search title, company, or tag…"
            className="w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label>
          <span className="sr-only">Filter by work mode</span>
          <Select
            value={filters.mode}
            onChange={(e) =>
              onChange({ ...filters, mode: e.target.value as JobFilters["mode"] })
            }
          >
            {MODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Filter by experience level</span>
          <Select
            value={filters.level}
            onChange={(e) =>
              onChange({ ...filters, level: e.target.value as JobFilters["level"] })
            }
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </label>
      </div>
    </Card>
  );
}
