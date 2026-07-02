import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import CompanyForm from "@/components/CompanyForm";

export default async function CompanyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Company profile</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Candidates see this name and description on every role you post.
          One company per account.
        </p>
      </div>
      <div className="mt-6">
        <CompanyForm
          initialValues={
            company
              ? {
                  name: company.name,
                  website: company.website ?? "",
                  description: company.description ?? "",
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
