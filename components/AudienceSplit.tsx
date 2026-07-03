"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "./ui/Button";

const CANDIDATE_POINTS = [
  "Search and filter every open role by mode, level, and keyword",
  "Save roles to a dedicated list and pick up where you left off",
  "Upload your resume once for a real Gemini-scored ATS score",
  "Get a match score for every listing, ranked against your resume",
  "Generate a tailored cover letter from your resume and the listing",
];

const EMPLOYER_POINTS = [
  "Post a role with real client-side validation, live in seconds",
  "See your own Signal Score before you publish, not after",
  "Review applicants with resumes and cover letters in one place",
  "Move candidates through applied → reviewing → accepted/rejected",
  "No recruiter seats, no per-post fees — post as many roles as you need",
];

export default function AudienceSplit() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.4 },
  };

  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Built for both sides of the listing
          </h2>
          <p className="mt-3 text-ink-soft">
            One account type per person, one clear set of tools for each.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              For job seekers
            </p>
            <h3 className="mt-1.5 text-xl font-bold text-ink">Find the real signal, fast</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CANDIDATE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={buttonVariants({ size: "md", className: "mt-6 self-start" })}
            >
              Sign up as a candidate
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              For employers
            </p>
            <h3 className="mt-1.5 text-xl font-bold text-ink">Post roles that earn trust</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {EMPLOYER_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={buttonVariants({
                variant: "secondary",
                size: "md",
                className: "mt-6 self-start",
              })}
            >
              Sign up as an employer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
