import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(supabase, user.id);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Profile</h1>
        <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
      </div>
      <div className="mt-6">
        <ProfileForm initialName={profile?.fullName ?? ""} />
      </div>
    </div>
  );
}
