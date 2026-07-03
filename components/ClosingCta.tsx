"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/Button";

export default function ClosingCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-surface py-16 sm:py-20">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          See the score before you apply.
        </h2>
        <p className="mt-3 text-ink-soft">
          Create a free account to browse every listing, get an AI-scored
          match against your own resume, and apply straight from the page.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants({ size: "md" })}>
            Create a free account
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
