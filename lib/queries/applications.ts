import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationStatus, Job } from "@/lib/types";
import { JOB_SELECT, type JobRow, mapJobRow } from "./jobs";

export interface CandidateApplication {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
  job: Job;
}

export interface JobApplicant {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
  candidateId: string;
  candidateName: string;
}

export async function hasApplied(
  supabase: SupabaseClient,
  jobId: string,
  candidateId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("candidate_id", candidateId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function applyToJob(
  supabase: SupabaseClient,
  jobId: string,
  candidateId: string,
  coverLetter: string
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .insert({ job_id: jobId, candidate_id: candidateId, cover_letter: coverLetter || null });
  if (error) throw error;
}

export async function getApplicationsForCandidate(
  supabase: SupabaseClient,
  candidateId: string
): Promise<CandidateApplication[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(`id, status, cover_letter, created_at, jobs(${JOB_SELECT})`)
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .filter((row) => row.jobs !== null)
    .map((row) => ({
      id: row.id as string,
      status: row.status as ApplicationStatus,
      coverLetter: row.cover_letter as string | null,
      createdAt: row.created_at as string,
      job: mapJobRow(row.jobs as unknown as JobRow),
    }));
}

export async function getApplicantsForJob(
  supabase: SupabaseClient,
  jobId: string
): Promise<JobApplicant[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("id, status, cover_letter, created_at, candidate_id, profiles(full_name)")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    status: row.status as ApplicationStatus,
    coverLetter: row.cover_letter as string | null,
    createdAt: row.created_at as string,
    candidateId: row.candidate_id as string,
    candidateName:
      (row.profiles as unknown as { full_name: string | null } | null)?.full_name ??
      "Unnamed candidate",
  }));
}

export async function getApplicationCountForCompany(
  supabase: SupabaseClient,
  companyId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("applications")
    .select("id, jobs!inner(company_id)", { count: "exact", head: true })
    .eq("jobs.company_id", companyId);
  if (error) throw error;
  return count ?? 0;
}

export async function updateApplicationStatus(
  supabase: SupabaseClient,
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);
  if (error) throw error;
}
