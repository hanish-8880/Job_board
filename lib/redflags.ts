import type { Job } from "./types";

export interface RedFlag {
  id: string;
  label: string;
  evidence: string;
}

interface FlagRule {
  id: string;
  label: string;
  pattern: RegExp;
}

// Each pattern targets one specific, commonly-reported exploitative
// posting habit. A match surfaces the exact matched phrase as evidence, so
// the flag is always inspectable rather than an opaque "risk score."
const RULES: FlagRule[] = [
  {
    id: "unpaidAssessment",
    label: "Unpaid work framed as an \"assessment\"",
    pattern: /unpaid[^.]{0,60}(assessment|project|deliverable|trial task|sample work|working interview)|(assessment|trial task|sample work)[^.]{0,60}unpaid/i,
  },
  {
    id: "tightDeadline",
    label: "Unusually tight deadline",
    pattern: /\b(within|in)\s+(6|12|24)\s*hours?\b|\bby (tomorrow|tonight|end of day)\b|\bstart(ing)? (tonight|immediately)\b/i,
  },
  {
    id: "replyAll",
    label: "\"Reply all\" mass-instruction pattern",
    pattern: /reply[\s-]?all/i,
  },
  {
    id: "vagueCompany",
    label: "Vague or unverifiable company info",
    pattern: /confidential (client|company)|stealth mode|leading company in the industry/i,
  },
  {
    id: "rejectionThreat",
    label: "Threat-style rejection language",
    pattern: /any (broken|dead) link[^.]{0,40}(instant|immediate)|will result in (instant|immediate) rejection|instant(ly)? disqualif/i,
  },
  {
    id: "payToApply",
    label: "Asks candidates to pay or buy equipment",
    pattern: /purchase (your own|the required)|processing fee|application fee/i,
  },
  {
    id: "noCompensation",
    label: "Unpaid role with no stated compensation",
    pattern: /\bunpaid\b/i,
  },
];

function collectText(job: Job): string {
  return [
    job.title,
    job.description,
    ...job.responsibilities,
    ...job.requirements,
  ].join(" \n ");
}

/**
 * Scans a listing's own text for phrasing patterns commonly reported in
 * exploitative postings. This is pattern matching against the listing's
 * words, not a judgment about the employer — a false positive just means
 * the phrasing happened to match, and the evidence line lets a reader
 * check that for themselves.
 */
export function detectRedFlags(job: Job): RedFlag[] {
  const text = collectText(job);
  const flags: RedFlag[] = [];

  for (const rule of RULES) {
    // Skip the generic "no compensation" catch-all when the more specific
    // unpaid-assessment rule already explains the same "unpaid" mention.
    if (rule.id === "noCompensation" && flags.some((f) => f.id === "unpaidAssessment")) {
      continue;
    }
    const match = text.match(rule.pattern);
    if (match) {
      flags.push({
        id: rule.id,
        label: rule.label,
        evidence: match[0].trim(),
      });
    }
  }

  return flags;
}
