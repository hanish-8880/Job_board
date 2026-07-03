import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeatureSpotlight from "@/components/FeatureSpotlight";
import AudienceSplit from "@/components/AudienceSplit";
import Faq from "@/components/Faq";
import ClosingCta from "@/components/ClosingCta";

export default async function Home() {
  const supabase = await createClient();
  const jobs = await getPublishedJobs(supabase);

  const strongSignalCount = jobs.filter((job) => computeSignal(job).tier === "strong").length;
  const redFlagCount = jobs.filter((job) => detectRedFlags(job).length > 0).length;

  // The hero's preview card shows whichever real listing currently scores
  // highest — the product demonstrating itself on its own best example,
  // not a mockup.
  const previewJob =
    jobs.length > 0
      ? [...jobs].sort((a, b) => computeSignal(b).score - computeSignal(a).score)[0]
      : null;

  return (
    <div>
      <Hero
        totalJobs={jobs.length}
        strongSignalCount={strongSignalCount}
        redFlagCount={redFlagCount}
        previewJob={previewJob}
      />
      <HowItWorks />
      <FeatureSpotlight />
      <AudienceSplit />
      <Faq />
      <ClosingCta />
    </div>
  );
}
