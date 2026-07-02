import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company } from "@/lib/types";

interface CompanyRow {
  id: string;
  owner_id: string;
  name: string;
  website: string | null;
  description: string | null;
  created_at: string;
}

function mapCompanyRow(row: CompanyRow): Company {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    website: row.website,
    description: row.description,
    createdAt: row.created_at,
  };
}

export async function getCompanyByOwner(
  supabase: SupabaseClient,
  ownerId: string
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCompanyRow(data as CompanyRow) : null;
}

export interface CompanyInput {
  name: string;
  website: string | null;
  description: string | null;
}

export async function createCompany(
  supabase: SupabaseClient,
  ownerId: string,
  input: CompanyInput
): Promise<string> {
  const { data, error } = await supabase
    .from("companies")
    .insert({
      owner_id: ownerId,
      name: input.name,
      website: input.website,
      description: input.description,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateCompany(
  supabase: SupabaseClient,
  companyId: string,
  input: CompanyInput
): Promise<void> {
  const { error } = await supabase
    .from("companies")
    .update({ name: input.name, website: input.website, description: input.description })
    .eq("id", companyId);
  if (error) throw error;
}
