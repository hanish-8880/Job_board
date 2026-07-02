import type { Job } from "./types";

export type SignalTier = "strong" | "moderate" | "weak";

export interface SignalCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface SignalResult {
  score: number;
  tier: SignalTier;
  checks: SignalCheck[];
}

const MIN_RESPONSIBILITIES = 3;
const MIN_REQUIREMENTS = 3;
const MIN_DESCRIPTION_WORDS = 40;
const RECENT_WINDOW_DAYS = 30;

// Realistic full-time annual bands, in the listing's own currency, before
// the range-width check applies. Anything outside this is either a data
// error or a role that's misrepresenting itself.
const REALISTIC_SALARY_FLOOR = 25000;
const REALISTIC_SALARY_CEILING = 600000;
const MAX_REALISTIC_RANGE_RATIO = 2.2;

const BUZZWORDS = [
  "rockstar",
  "ninja",
  "guru",
  "wizard",
  "superstar",
  "synergy",
  "fast-paced",
  "fast paced",
  "wear many hats",
  "game changer",
  "gamechanger",
  "hustle",
  "unicorn",
  "10x",
  "growth mindset",
  "self-starter",
  "go-getter",
  "thick skin",
  "other duties as assigned",
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function daysSince(dateStr: string): number {
  const posted = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - posted) / (1000 * 60 * 60 * 24));
}

function isBuzzwordy(tags: string[]): boolean {
  if (tags.length < 2) return true;
  return tags.some((tag) =>
    BUZZWORDS.some((buzzword) => tag.toLowerCase().includes(buzzword))
  );
}

/**
 * Computes a transparent 0-100 quality score from data already present on
 * the listing. This is a heuristic, not a prediction of job quality — the
 * checklist below is the entire method, deliberately visible so it's never
 * a black box.
 */
export function computeSignal(job: Job): SignalResult {
  const salaryDisclosed = job.salaryMin !== null && job.salaryMax !== null;

  let salaryRealistic = false;
  if (salaryDisclosed) {
    const min = job.salaryMin as number;
    const max = job.salaryMax as number;
    const withinBand =
      min >= REALISTIC_SALARY_FLOOR &&
      max <= REALISTIC_SALARY_CEILING &&
      max >= min;
    const ratio = min > 0 ? max / min : Infinity;
    salaryRealistic = withinBand && ratio <= MAX_REALISTIC_RANGE_RATIO;
  }

  const hasResponsibilities = job.responsibilities.length >= MIN_RESPONSIBILITIES;
  const hasRequirements = job.requirements.length >= MIN_REQUIREMENTS;
  const descriptionWords = wordCount(job.description);
  const substantiveDescription = descriptionWords >= MIN_DESCRIPTION_WORDS;
  const days = daysSince(job.postedAt);
  const postedRecently = days <= RECENT_WINDOW_DAYS;
  const tagsSpecific = job.tags.length > 0 && !isBuzzwordy(job.tags);

  const checks: SignalCheck[] = [
    {
      id: "salaryDisclosed",
      label: "Salary disclosed",
      passed: salaryDisclosed,
      detail: salaryDisclosed
        ? `${job.currency} ${job.salaryMin?.toLocaleString("en-US")}–${job.salaryMax?.toLocaleString("en-US")} listed`
        : "No salary range provided",
      weight: 15,
    },
    {
      id: "salaryRealistic",
      label: "Salary range is realistic",
      passed: salaryRealistic,
      detail: !salaryDisclosed
        ? "Can't evaluate — no salary disclosed"
        : salaryRealistic
        ? "Range is within a plausible full-time band"
        : "Range is unusually narrow, wide, or outside a plausible full-time band",
      weight: 10,
    },
    {
      id: "responsibilities",
      label: `${MIN_RESPONSIBILITIES}+ concrete responsibilities`,
      passed: hasResponsibilities,
      detail: `${job.responsibilities.length} listed`,
      weight: 15,
    },
    {
      id: "requirements",
      label: `${MIN_REQUIREMENTS}+ concrete requirements`,
      passed: hasRequirements,
      detail: `${job.requirements.length} listed`,
      weight: 15,
    },
    {
      id: "description",
      label: `Substantive description (${MIN_DESCRIPTION_WORDS}+ words)`,
      passed: substantiveDescription,
      detail: `${descriptionWords} words`,
      weight: 15,
    },
    {
      id: "postedRecently",
      label: `Posted within the last ${RECENT_WINDOW_DAYS} days`,
      passed: postedRecently,
      detail: `Posted ${days} day${days === 1 ? "" : "s"} ago`,
      weight: 15,
    },
    {
      id: "tagsSpecific",
      label: "Tags are specific, not buzzwords",
      passed: tagsSpecific,
      detail: tagsSpecific
        ? job.tags.join(", ")
        : "Tags are too generic or read like buzzwords",
      weight: 15,
    },
  ];

  const score = checks.reduce(
    (total, check) => total + (check.passed ? check.weight : 0),
    0
  );

  const tier: SignalTier = score >= 75 ? "strong" : score >= 45 ? "moderate" : "weak";

  return { score, tier, checks };
}

export const SIGNAL_TIER_LABEL: Record<SignalTier, string> = {
  strong: "Strong Signal",
  moderate: "Moderate Signal",
  weak: "Weak Signal",
};
