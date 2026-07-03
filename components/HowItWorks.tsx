"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileSearch, ShieldAlert, Sparkles, type LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  kicker: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: FileSearch,
    kicker: "Step 1",
    title: "Every listing gets scored automatically",
    description:
      "Salary disclosure, concrete responsibilities, a substantive description, tags that aren't buzzwords — Signal Score checks a listing's own words and shows the full checklist, not just a number.",
  },
  {
    icon: ShieldAlert,
    kicker: "Step 2",
    title: "Red flags are caught before you apply",
    description:
      "Unpaid \"assessments,\" tight-deadline pressure, vague company info, reject-on-a-broken-link threats — flagged with the exact phrase quoted from the listing, so you can judge it yourself.",
  },
  {
    icon: Sparkles,
    kicker: "Step 3",
    title: "Real AI, only where it's real",
    description:
      "Resume Review, Match Score, and Cover Letter Generator call Google's Gemini live against your resume and one specific job — never a random number dressed up as intelligence.",
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            How Signalboard works
          </h2>
          <p className="mt-3 text-ink-soft">
            Three real mechanics, not a black box.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.kicker}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <step.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                {step.kicker}
              </p>
              <h3 className="mt-1 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
