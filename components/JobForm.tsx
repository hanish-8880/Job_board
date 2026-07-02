"use client";

import { useActionState } from "react";
import { errorClass, inputClass, labelClass, submitClass } from "./formStyles";
import { saveJob, type JobFormState } from "@/app/employer/jobs/actions";
import type { Job } from "@/lib/types";

const initialState: JobFormState = { errors: {} };

export default function JobForm({ job }: { job?: Job }) {
  const action = saveJob.bind(null, job?.id ?? null);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="title">
          Job title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={job?.title}
          className={`${inputClass} mt-1`}
          placeholder="Senior Backend Engineer"
        />
        {state.errors.title && <p className={errorClass}>{state.errors.title}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={job?.location}
          className={`${inputClass} mt-1`}
          placeholder="Remote, or a city"
        />
        {state.errors.location && <p className={errorClass}>{state.errors.location}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="mode">
            Work mode
          </label>
          <select
            id="mode"
            name="mode"
            defaultValue={job?.mode ?? "remote"}
            className={`${inputClass} mt-1`}
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
            name="level"
            defaultValue={job?.level ?? "mid"}
            className={`${inputClass} mt-1`}
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
            name="salaryMin"
            inputMode="numeric"
            defaultValue={job?.salaryMin ?? ""}
            className={`${inputClass} mt-1`}
            placeholder="Optional"
          />
          {state.errors.salaryMin && <p className={errorClass}>{state.errors.salaryMin}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="salaryMax">
            Salary maximum (USD/yr)
          </label>
          <input
            id="salaryMax"
            name="salaryMax"
            inputMode="numeric"
            defaultValue={job?.salaryMax ?? ""}
            className={`${inputClass} mt-1`}
            placeholder="Optional"
          />
          {state.errors.salaryMax && <p className={errorClass}>{state.errors.salaryMax}</p>}
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
          name="tags"
          defaultValue={job?.tags.join(", ")}
          className={`${inputClass} mt-1`}
          placeholder="React, TypeScript, Postgres (comma-separated)"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={job?.description}
          rows={5}
          className={`${inputClass} mt-1`}
          placeholder="What does this team actually do, and what would this person actually work on?"
        />
        {state.errors.description && <p className={errorClass}>{state.errors.description}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="responsibilities">
          Responsibilities
        </label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          defaultValue={job?.responsibilities.join("\n")}
          rows={4}
          className={`${inputClass} mt-1`}
          placeholder={"One per line, e.g.\nOwn the checkout service end-to-end"}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="requirements">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          defaultValue={job?.requirements.join("\n")}
          rows={4}
          className={`${inputClass} mt-1`}
          placeholder={"One per line, e.g.\n5+ years with distributed systems"}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={job?.status ?? "published"}
          className={`${inputClass} mt-1`}
        >
          <option value="published">Published — visible to candidates</option>
          <option value="draft">Draft — only visible to you</option>
        </select>
      </div>

      {state.formError && <p className={errorClass}>{state.formError}</p>}

      <button type="submit" disabled={pending} className={`${submitClass} self-start`}>
        {pending ? "Saving…" : job ? "Save changes" : "Publish listing"}
      </button>
    </form>
  );
}
