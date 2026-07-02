import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import ProfileForm from "@/components/ProfileForm";
import PageHeader from "@/components/ui/PageHeader";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(supabase, user.id);

  return (
    <div>
      <PageHeader title="Profile" description={user.email} />
      <div className="mt-6">
        <ProfileForm initialName={profile?.fullName ?? ""} />
      </div>
    </div>
  );
}
