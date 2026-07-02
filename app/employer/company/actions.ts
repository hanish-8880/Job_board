"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCompany, getCompanyByOwner, updateCompany } from "@/lib/queries/companies";
import { validateCompany, type CompanyErrors } from "@/lib/validate";

export interface CompanyFormState {
  errors: CompanyErrors;
  formError?: string;
}

export async function saveCompany(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const name = String(formData.get("name") ?? "");
  const website = String(formData.get("website") ?? "");
  const description = String(formData.get("description") ?? "");

  const errors = validateCompany({ name, website, description });
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

  const input = {
    name: name.trim(),
    website: website.trim() || null,
    description: description.trim() || null,
  };

  const existing = await getCompanyByOwner(supabase, user.id);
  if (existing) {
    await updateCompany(supabase, existing.id, input);
  } else {
    await createCompany(supabase, user.id, input);
  }

  redirect("/employer");
}
