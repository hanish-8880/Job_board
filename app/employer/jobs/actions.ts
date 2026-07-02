"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import { createJob, deleteJob as deleteJobQuery, setJobStatus, updateJob } from "@/lib/queries/jobs";
import { updateApplicationStatus } from "@/lib/queries/applications";
import { validateJobPosting, type JobPostingErrors } from "@/lib/validate";
import type { ApplicationStatus, ExperienceLevel, JobStatus, WorkMode } from "@/lib/types";

export interface JobFormState {
  errors: JobPostingErrors;
  formError?: string;
}

function parseListField(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Bound with a jobId (or null) from the client via `saveJob.bind(null, jobId)`
 * so the same action and form handle both creating and editing a job.
 */
export async function saveJob(
  jobId: string | null,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const title = String(formData.get("title") ?? "");
  const location = String(formData.get("location") ?? "");
  const description = String(formData.get("description") ?? "");
  const salaryMin = String(formData.get("salaryMin") ?? "");
  const salaryMax = String(formData.get("salaryMax") ?? "");

  const errors = validateJobPosting({ title, location, description, salaryMin, salaryMax });
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { errors: {}, formError: "You need to be logged in." };
  }

  const company = await getCompanyByOwner(supabase, user.id);
  if (!company) {
    return { errors: {}, formError: "Create your company profile before posting a role." };
  }

  const input = {
    title: title.trim(),
    location: location.trim(),
    mode: String(formData.get("mode") ?? "remote") as WorkMode,
    level: String(formData.get("level") ?? "mid") as ExperienceLevel,
    salaryMin: salaryMin.trim() ? Number(salaryMin.trim()) : null,
    salaryMax: salaryMax.trim() ? Number(salaryMax.trim()) : null,
    currency: "USD",
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    description: description.trim(),
    responsibilities: parseListField(String(formData.get("responsibilities") ?? "")),
    requirements: parseListField(String(formData.get("requirements") ?? "")),
    status: String(formData.get("status") ?? "published") as JobStatus,
  };

  let id = jobId;
  if (id) {
    await updateJob(supabase, id, input);
  } else {
    id = await createJob(supabase, company.id, input);
  }

  revalidatePath("/employer/jobs");
  redirect(`/jobs/${id}`);
}

export async function deleteJobAction(jobId: string): Promise<void> {
  const supabase = await createClient();
  await deleteJobQuery(supabase, jobId);
  revalidatePath("/employer/jobs");
}

export async function toggleJobStatusAction(
  jobId: string,
  nextStatus: JobStatus
): Promise<void> {
  const supabase = await createClient();
  await setJobStatus(supabase, jobId, nextStatus);
  revalidatePath("/employer/jobs");
  revalidatePath(`/jobs/${jobId}`);
}

export async function updateApplicantStatusAction(
  applicationId: string,
  status: ApplicationStatus,
  jobId: string
): Promise<void> {
  const supabase = await createClient();
  await updateApplicationStatus(supabase, applicationId, status);
  revalidatePath(`/employer/jobs/${jobId}/applicants`);
}
