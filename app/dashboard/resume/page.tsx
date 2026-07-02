import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import ResumeForm from "@/components/ResumeForm";

export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(supabase, user.id);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Resume</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Pasted as plain text, used by AI Review and Cover Letter below. No
          file upload or PDF parsing — a deliberate cut to avoid a whole
          separate failure surface (corrupt files, extraction errors) for a
          feature that works fine as plain text.
        </p>
      </div>
      <div className="mt-6">
        <ResumeForm initialText={profile?.resumeText ?? ""} />
      </div>
    </div>
  );
}
