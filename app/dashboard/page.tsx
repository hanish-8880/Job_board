import { Bookmark, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import { getApplicationsForCandidate } from "@/lib/queries/applications";
import StatTile from "@/components/StatTile";
import PageHeader from "@/components/ui/PageHeader";

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
      <PageHeader title="Dashboard" description="Your job search, in one place." />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile icon={Bookmark} label="Saved roles" value={bookmarkedIds.length} />
        <StatTile icon={FileText} label="Applications submitted" value={applications.length} />
      </div>
    </div>
  );
}
