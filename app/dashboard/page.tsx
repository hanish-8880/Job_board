import { createClient } from "@/lib/supabase/server";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import { getApplicationsForCandidate } from "@/lib/queries/applications";
import StatTile from "@/components/StatTile";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [bookmarkedIds, applications] = await Promise.all([
    getBookmarkedJobIds(supabase, user.id),
    getApplicationsForCandidate(supabase, user.id),
  ]);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-soft">Your job search, in one place.</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile label="Saved roles" value={bookmarkedIds.length} />
        <StatTile label="Applications submitted" value={applications.length} />
      </div>
    </div>
  );
}
