import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExperienceLevel, Job, JobStatus, WorkMode } from "@/lib/types";

export interface JobRow {
  id: string;
  company_id: string;
  title: string;
  location: string;
  mode: WorkMode;
  level: ExperienceLevel;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: JobStatus;
  created_at: string;
  companies: { name: string } | null;
}

export const JOB_SELECT = "*, companies(name)";

export function mapJobRow(row: JobRow): Job {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    company: row.companies?.name ?? "Unknown company",
    location: row.location,
    mode: row.mode,
    level: row.level,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    currency: row.currency,
    tags: row.tags,
    description: row.description,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    status: row.status,
    postedAt: row.created_at,
  };
}

export async function getPublishedJobs(supabase: SupabaseClient): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as JobRow[]).map(mapJobRow);
}

export async function getJobById(supabase: SupabaseClient, id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapJobRow(data as unknown as JobRow) : null;
}

export async function getJobsForCompany(
  supabase: SupabaseClient,
  companyId: string
): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as JobRow[]).map(mapJobRow);
}

export interface JobInput {
  title: string;
  location: string;
  mode: WorkMode;
  level: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: JobStatus;
}

export async function createJob(
  supabase: SupabaseClient,
  companyId: string,
  input: JobInput
): Promise<string> {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      company_id: companyId,
      title: input.title,
      location: input.location,
      mode: input.mode,
      level: input.level,
      salary_min: input.salaryMin,
      salary_max: input.salaryMax,
      currency: input.currency,
      tags: input.tags,
      description: input.description,
      responsibilities: input.responsibilities,
      requirements: input.requirements,
      status: input.status,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateJob(
  supabase: SupabaseClient,
  jobId: string,
  input: JobInput
): Promise<void> {
  const { error } = await supabase
    .from("jobs")
    .update({
      title: input.title,
      location: input.location,
      mode: input.mode,
      level: input.level,
      salary_min: input.salaryMin,
      salary_max: input.salaryMax,
      currency: input.currency,
      tags: input.tags,
      description: input.description,
      responsibilities: input.responsibilities,
      requirements: input.requirements,
      status: input.status,
    })
    .eq("id", jobId);
  if (error) throw error;
}

export async function setJobStatus(
  supabase: SupabaseClient,
  jobId: string,
  status: JobStatus
): Promise<void> {
  const { error } = await supabase.from("jobs").update({ status }).eq("id", jobId);
  if (error) throw error;
}

export async function deleteJob(supabase: SupabaseClient, jobId: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw error;
}
