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
        description="Upload a .pdf, .docx, or .txt file, or paste text directly. Stored and used as plain text by Matches, AI Review, and Cover Letter below — review the extracted text before saving, since PDF extraction can occasionally miss formatting."
      />
      <div className="mt-6">
        <ResumeForm initialText={profile?.resumeText ?? ""} />
      </div>
    </div>
  );
}
