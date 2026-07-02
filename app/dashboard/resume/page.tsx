import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import ResumeForm from "@/components/ResumeForm";
import PageHeader from "@/components/ui/PageHeader";

export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(supabase, user.id);

  return (
    <div>
      <PageHeader
        title="Resume"
        description="Pasted as plain text, used by AI Review and Cover Letter below. No file upload or PDF parsing — a deliberate cut to avoid a whole separate failure surface for a feature that works fine as plain text."
      />
      <div className="mt-6">
        <ResumeForm initialText={profile?.resumeText ?? ""} />
      </div>
    </div>
  );
}
