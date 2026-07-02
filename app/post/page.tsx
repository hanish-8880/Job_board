"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addPostedJob } from "@/lib/storage";
import type { ExperienceLevel, Job, WorkMode } from "@/lib/types";
import { validateJobDraft, type JobDraftErrors } from "@/lib/validate";

const inputClass =
  "w-full rounded-sm border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-navy";
const labelClass = "block font-mono text-xs uppercase tracking-[0.08em] text-ink-soft";
const errorClass = "mt-1 text-sm text-weak";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PostRolePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<WorkMode>("remote");
  const [level, setLevel] = useState<ExperienceLevel>("mid");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [errors, setErrors] = useState<JobDraftErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validateJobDraft({
      title,
      company,
      location,
      salaryMin,
      salaryMax,
      description,
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const job: Job = {
      id: `${slugify(company)}-${slugify(title)}-${Date.now().toString(36)}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      mode,
      level,
      salaryMin: salaryMin.trim() ? Number(salaryMin.trim()) : null,
      salaryMax: salaryMax.trim() ? Number(salaryMax.trim()) : null,
      currency: "USD",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: description.trim(),
      responsibilities: responsibilities
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      requirements: requirements
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      postedAt: new Date().toISOString().slice(0, 10),
    };

    addPostedJob(job);
    router.push(`/jobs/${job.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Post a role</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Goes live immediately, but only in your browser — this demo has no
          backend, so nothing here is visible to anyone else or on any other
          device.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="title">
            Job title
          </label>
          <input
            id="title"
            className={`${inputClass} mt-1`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Senior Backend Engineer"
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="company">
              Company
            </label>
            <input
              id="company"
              className={`${inputClass} mt-1`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Systems"
            />
            {errors.company && <p className={errorClass}>{errors.company}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              className={`${inputClass} mt-1`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote, or a city"
            />
            {errors.location && <p className={errorClass}>{errors.location}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="mode">
              Work mode
            </label>
            <select
              id="mode"
              className={`${inputClass} mt-1`}
              value={mode}
              onChange={(e) => setMode(e.target.value as WorkMode)}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="level">
              Experience level
            </label>
            <select
              id="level"
              className={`${inputClass} mt-1`}
              value={level}
              onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="salaryMin">
              Salary minimum (USD/yr)
            </label>
            <input
              id="salaryMin"
              inputMode="numeric"
              className={`${inputClass} mt-1`}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="Optional"
            />
            {errors.salaryMin && <p className={errorClass}>{errors.salaryMin}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="salaryMax">
              Salary maximum (USD/yr)
            </label>
            <input
              id="salaryMax"
              inputMode="numeric"
              className={`${inputClass} mt-1`}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Optional"
            />
            {errors.salaryMax && <p className={errorClass}>{errors.salaryMax}</p>}
          </div>
        </div>
        <p className="-mt-3 font-mono text-[11px] text-ink-faint">
          Leave both blank to skip disclosure — the Signal Score will reflect
          that honestly rather than guessing a number.
        </p>

        <div>
          <label className={labelClass} htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className={`${inputClass} mt-1`}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, TypeScript, Postgres (comma-separated)"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            className={`${inputClass} mt-1`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this team actually do, and what would this person actually work on?"
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="responsibilities">
            Responsibilities
          </label>
          <textarea
            id="responsibilities"
            rows={4}
            className={`${inputClass} mt-1`}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder={"One per line, e.g.\nOwn the checkout service end-to-end"}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="requirements">
            Requirements
          </label>
          <textarea
            id="requirements"
            rows={4}
            className={`${inputClass} mt-1`}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={"One per line, e.g.\n5+ years with distributed systems"}
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink"
        >
          Publish listing
        </button>
      </form>
    </div>
  );
}
