"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is the AI actually real, or dressed-up randomness?",
    a: "It's real. Resume Review, Match Score, and Cover Letter Generator all call Google's Gemini API live, against your actual resume text and the actual listing text. Nothing on this site fabricates an AI result — if a feature isn't wired to a real model, we don't ship it.",
  },
  {
    q: "What is the Signal Score, exactly?",
    a: "A transparent 0–100 score computed from data already on the listing — salary disclosure, a realistic salary range, 3+ concrete responsibilities and requirements, a substantive description, how recently it was posted, and whether the tags are specific rather than buzzwords. The full checklist is shown on every listing page, so the score is never a black box.",
  },
  {
    q: "What does the red-flag detector actually check?",
    a: "It scans each listing's own text for phrasing patterns commonly reported in exploitative postings — unpaid \"assessments,\" unusually tight deadlines, reply-all mass instructions, vague company info, threat-style rejection language, and requests to pay or buy equipment. Every flag quotes the exact phrase that matched, so you can judge it yourself.",
  },
  {
    q: "What happens to my resume and data?",
    a: "Your resume text and account data are stored in your own Supabase-backed profile, scoped to your account by row-level security. It's used to compute your ATS score and match scores, and to prefill your cover letter drafts — nothing is shared with other users or sold.",
  },
  {
    q: "Is this free?",
    a: "Yes — creating an account, browsing roles, saving listings, applying, and using the AI features all cost nothing to use here.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-border bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Questions worth answering honestly
        </h2>

        <div className="mt-8 flex flex-col divide-y divide-border border-t border-border">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-semibold text-ink">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-ink-faint transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-6 text-ink-soft">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
