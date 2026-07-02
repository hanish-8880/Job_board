import type { SupabaseClient } from "@supabase/supabase-js";
import type { Job } from "@/lib/types";
import { JOB_SELECT, type JobRow, mapJobRow } from "./jobs";

export async function getBookmarkedJobIds(
  supabase: SupabaseClient,
  candidateId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("job_id")
    .eq("candidate_id", candidateId);
  if (error) throw error;
  return (data ?? []).map((row) => row.job_id as string);
}

export async function getBookmarkedJobs(
  supabase: SupabaseClient,
  candidateId: string
): Promise<Job[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`created_at, jobs(${JOB_SELECT})`)
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row) => row.jobs as unknown as JobRow | null)
    .filter((job): job is JobRow => job !== null)
    .map(mapJobRow);
}

export async function isBookmarked(
  supabase: SupabaseClient,
  jobId: string,
  candidateId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("job_id", jobId)
    .eq("candidate_id", candidateId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function addBookmark(
  supabase: SupabaseClient,
  jobId: string,
  candidateId: string
): Promise<void> {
  const { error } = await supabase
    .from("bookmarks")
    .insert({ job_id: jobId, candidate_id: candidateId });
  if (error) throw error;
}

export async function removeBookmark(
  supabase: SupabaseClient,
  jobId: string,
  candidateId: string
): Promise<void> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("job_id", jobId)
    .eq("candidate_id", candidateId);
  if (error) throw error;
}
