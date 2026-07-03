"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const SIGNAL_CHECKS = [
  { label: "Salary disclosed", passed: true },
  { label: "Salary range is realistic", passed: true },
  { label: "3+ concrete responsibilities", passed: true },
  { label: "3+ concrete requirements", passed: false },
  { label: "Substantive description (40+ words)", passed: true },
  { label: "Posted within the last 30 days", passed: true },
  { label: "Tags are specific, not buzzwords", passed: false },
];

const RED_FLAG_PATTERNS = [
  'Unpaid work framed as an "assessment"',
  "Unusually tight deadline",
  '"Reply all" mass-instruction pattern',
  "Vague or unverifiable company info",
  "Threat-style rejection language",
  "Asks candidates to pay or buy equipment",
  "Unpaid role with no stated compensation",
];

export default function FeatureSpotlight() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.4 },
  };

  return (
    <section className="border-b border-border bg-surface py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Signal Score
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              A quality score you can audit, not just trust
            </h3>
            <p className="mt-3 text-ink-soft">
              Every listing is checked against seven concrete signals pulled
              from its own text — salary disclosure, real responsibilities, a
              substantive description, specific tags. Nothing here comes from
              a model guessing at &quot;quality&quot; — it&apos;s a checklist,
              and it&apos;s always shown in full on the listing page.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-faint">
                Example checklist
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {SIGNAL_CHECKS.map((check) => (
                  <li key={check.label} className="flex items-center gap-2.5 text-sm">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-strong" aria-hidden />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-weak" aria-hidden />
                    )}
                    <span className={check.passed ? "text-ink" : "text-ink-faint"}>
                      {check.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeUp} className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-weak">
              Red-flag detector
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Exploitative phrasing, caught before you apply
            </h3>
            <p className="mt-3 text-ink-soft">
              Every listing&apos;s own words are scanned for seven patterns
              commonly reported in exploitative postings — unpaid
              &quot;assessments,&quot; reply-all mass instructions,
              threat-style rejection language. Each flag quotes the exact
              phrase that matched, so you judge it, not a hidden risk score.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:order-1"
          >
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-faint">
                Patterns we scan for
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {RED_FLAG_PATTERNS.map((label) => (
                  <li key={label} className="flex items-start gap-2 text-sm text-ink-soft">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-weak" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
