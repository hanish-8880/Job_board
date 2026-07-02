import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import CompanyForm from "@/components/CompanyForm";
import PageHeader from "@/components/ui/PageHeader";

export default async function CompanyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  return (
    <div>
      <PageHeader
        title="Company profile"
        description="Candidates see this name and description on every role you post. One company per account."
      />
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
