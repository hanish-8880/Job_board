import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

interface ProfileRow {
  id: string;
  role: "candidate" | "employer";
  full_name: string | null;
  resume_text: string | null;
  created_at: string;
}

function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    resumeText: row.resume_text,
    createdAt: row.created_at,
  };
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProfileRow(data as ProfileRow) : null;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  patch: { fullName?: string; resumeText?: string }
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (patch.fullName !== undefined) update.full_name = patch.fullName;
  if (patch.resumeText !== undefined) update.resume_text = patch.resumeText;

  const { error } = await supabase.from("profiles").update(update).eq("id", userId);
  if (error) throw error;
}

export async function setProfileRole(
  supabase: SupabaseClient,
  userId: string,
  role: "candidate" | "employer"
): Promise<void> {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw error;
}
