"use client";

import { useActionState } from "react";
import { Input, Select, Textarea, labelClass, errorText } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { saveJob, type JobFormState } from "@/app/employer/jobs/actions";
import type { Job } from "@/lib/types";

const initialState: JobFormState = { errors: {} };

export default function JobForm({ job }: { job?: Job }) {
  const action = saveJob.bind(null, job?.id ?? null);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="max-w-2xl p-6">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="title">
            Job title
          </label>
          <Input
            id="title"
            name="title"
            defaultValue={job?.title}
            className="mt-1.5"
            placeholder="Senior Backend Engineer"
          />
          {state.errors.title && <p className={errorText}>{state.errors.title}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="location">
            Location
          </label>
          <Input
            id="location"
            name="location"
            defaultValue={job?.location}
            className="mt-1.5"
            placeholder="Remote, or a city"
          />
          {state.errors.location && <p className={errorText}>{state.errors.location}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="mode">
              Work mode
            </label>
            <Select id="mode" name="mode" defaultValue={job?.mode ?? "remote"} className="mt-1.5">
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </Select>
          </div>
          <div>
            <label className={labelClass} htmlFor="level">
              Experience level
            </label>
            <Select id="level" name="level" defaultValue={job?.level ?? "mid"} className="mt-1.5">
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="salaryMin">
              Salary minimum (USD/yr)
            </label>
            <Input
              id="salaryMin"
              name="salaryMin"
              inputMode="numeric"
              defaultValue={job?.salaryMin ?? ""}
              className="mt-1.5"
              placeholder="Optional"
            />
            {state.errors.salaryMin && <p className={errorText}>{state.errors.salaryMin}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="salaryMax">
              Salary maximum (USD/yr)
            </label>
            <Input
              id="salaryMax"
              name="salaryMax"
              inputMode="numeric"
              defaultValue={job?.salaryMax ?? ""}
              className="mt-1.5"
              placeholder="Optional"
            />
            {state.errors.salaryMax && <p className={errorText}>{state.errors.salaryMax}</p>}
          </div>
        </div>
        <p className="-mt-3 text-xs text-ink-faint">
          Leave both blank to skip disclosure — the Signal Score will reflect
          that honestly rather than guessing a number.
        </p>

        <div>
          <label className={labelClass} htmlFor="tags">
            Tags
          </label>
          <Input
            id="tags"
            name="tags"
            defaultValue={job?.tags.join(", ")}
            className="mt-1.5"
            placeholder="React, TypeScript, Postgres (comma-separated)"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={job?.description}
            rows={5}
            className="mt-1.5"
            placeholder="What does this team actually do, and what would this person actually work on?"
          />
          {state.errors.description && <p className={errorText}>{state.errors.description}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="responsibilities">
            Responsibilities
          </label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            defaultValue={job?.responsibilities.join("\n")}
            rows={4}
            className="mt-1.5"
            placeholder={"One per line, e.g.\nOwn the checkout service end-to-end"}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="requirements">
            Requirements
          </label>
          <Textarea
            id="requirements"
            name="requirements"
            defaultValue={job?.requirements.join("\n")}
            rows={4}
            className="mt-1.5"
            placeholder={"One per line, e.g.\n5+ years with distributed systems"}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <Select id="status" name="status" defaultValue={job?.status ?? "published"} className="mt-1.5">
            <option value="published">Published — visible to candidates</option>
            <option value="draft">Draft — only visible to you</option>
          </Select>
        </div>

        {state.formError && <p className={errorText}>{state.formError}</p>}

        <Button type="submit" disabled={pending} className="self-start">
          {pending ? "Saving…" : job ? "Save changes" : "Publish listing"}
        </Button>
      </form>
    </Card>
  );
}
