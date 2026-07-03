import Link from "next/link";
import { ArrowRight, Bookmark, FileText, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import { getApplicationsForCandidate } from "@/lib/queries/applications";
import { getProfile } from "@/lib/queries/profiles";
import StatTile from "@/components/StatTile";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [bookmarkedIds, applications, profile] = await Promise.all([
    getBookmarkedJobIds(supabase, user.id),
    getApplicationsForCandidate(supabase, user.id),
    getProfile(supabase, user.id),
  ]);

  const hasResume = !!profile?.resumeText;
  const hasMatches = !!profile?.resumeMatchComputedAt;

  return (
    <div>
      <PageHeader title="Dashboard" description="Your job search, in one place." />

      {!hasMatches && (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Target className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-ink">See how you match with every open role</p>
              <p className="text-sm text-ink-soft">
                {hasResume
                  ? "One Gemini call scores your resume against every published listing."
                  : "Add your resume first, then score it against every published listing at once."}
              </p>
            </div>
          </div>
          <Link
            href={hasResume ? "/dashboard/matches" : "/dashboard/resume"}
            className={buttonVariants({ size: "sm" })}
          >
            {hasResume ? "Find my matches" : "Add resume"}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile icon={Bookmark} label="Saved roles" value={bookmarkedIds.length} />
        <StatTile icon={FileText} label="Applications submitted" value={applications.length} />
      </div>
    </div>
  );
}
