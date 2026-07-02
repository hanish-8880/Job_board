# Signalboard — Project Brief

Context for Claude (in VS Code / Claude Code) working on this repo. This is
direction and scope, not implementation — the how is left to you and Claude
Code.

## Update: scope pivot (kept for history, not erased)

Everything below this note describes the original decision to ship a
no-backend, localStorage-only build, and the reasoning behind it. That
version was fully built, tested, committed, and pushed. The user was then
shown the competing full-stack plan referenced below (from another AI) and,
after being explicitly told the added deploy risk this would introduce,
chose to build it anyway.

The larger version — Supabase Postgres + Auth (email/password and Google),
candidate/employer dashboards, real job CRUD, and two real Google Gemini-backed
features (Resume Review + Match Score, Cover Letter Generator) — was then
built on top of the same underlying app. The engineering discipline didn't
change: no fake data, no fake AI, real features fully working over more
features half-working. See the README for what that version cuts from the
larger plan and why (analytics/messages/PDF parsing/legal pages), and for
the full feature list as actually shipped.

The reasoning below is left intact because it's still correct reasoning —
it was overridden by an explicit, informed choice, not disproven.

## The situation

This is a 3-day take-home assessment for a Software Engineer role. The brief:
build a job board, push to GitHub, write a CI/CD pipeline, deploy to Vercel,
document it with AI, submit working links. Stated evaluation criteria:
"approach to UX and feature details."

A competing plan (from another AI) proposed a full-stack build: Supabase
auth, Postgres, employer dashboard, candidate dashboard, 15 AI features
including a resume analyzer and AI match scores, glassmorphism, a command
palette. **That plan is explicitly rejected for this project.** Reasoning:

- That scope is 2–3 weeks of work for a small team, not 3 days solo. A
  half-wired backend reads worse than a small, fully-working product —
  evaluators reviewing many submissions notice broken auth flows and empty
  states faster than they notice ambition.
- Every added moving part (auth, a hosted DB, env vars on Vercel) is a new
  way to fail the "all links must be fully functional" requirement in the
  original brief. Deploy risk is the enemy here, not feature count.
- Mocked "AI features" (fake resume score, fake match %, hardcoded "AI"
  output) are a liability, not a strength, if an evaluator pokes at them for
  even 30 seconds and finds `Math.random()` behind the curtain.

The one piece of that plan worth keeping: **build one cohesive product with
a small number of fully-working features, not a wide grid of half-built
ones.** That instinct was right even though the scope around it was wrong.

## Decision: scope

- **No backend, no auth.** Data lives in `localStorage` (already scaffolded
  in `lib/storage.ts`, `lib/data.ts`). This is a deliberate choice, not a
  shortcut — it means every feature that ships is fully functional with zero
  deploy risk. Say this explicitly in the README rather than letting it look
  like an oversight.
- **No fake "AI" UI.** Nothing that claims to be AI-powered but isn't. If a
  feature is a transparent heuristic, present it as exactly that.
- Finish the following list completely before considering anything else.

## Finalized feature list

Core (already working in this repo):
1. Search + filter (mode, level, free text across title/company/tags)
2. Save / bookmark jobs, persisted locally, dedicated Saved page
3. Post a role — real client-side validation (required fields, salary
   min/max sanity check)
4. Job detail page with a working Apply flow
5. **Signal Score** (`lib/signal.ts`) — the standout feature. A transparent
   0–100 quality score per listing, computed only from data in the listing
   itself: salary disclosed, salary range realistic, 3+ concrete
   responsibilities, 3+ concrete requirements, substantive description
   (40+ words), posted recently, tags specific rather than buzzword-stuffed.
   Shown as a tier badge (STRONG / MODERATE / WEAK SIGNAL) on every card,
   with a full checklist breakdown on the detail page so the score is never
   a black box.

Pick exactly ONE more, finish it fully, then stop:

- **Red-flag detector** — scans a listing's text for patterns common in
  exploitative postings (unpaid deliverables framed as an "assessment,"
  unusually tight deadlines, "reply all" instructions, vague company info,
  threats like "any broken link = instant rejection"). Surfaced as a plain
  warning banner, not a score. This is the feature most worth choosing —
  it's the one thing on this whole list that's actually useful to a real job
  seeker, not just a portfolio flourish. It's also honest about being a
  heuristic, same as Signal Score, so it fits the "no fake AI" rule cleanly.
- Compare tray, application tracker, market pulse strip, skill-match
  highlighting, shareable digest — all viable, but lower priority than the
  red-flag detector for this specific submission.

## Design direction

Synthesize, don't clone, from: Wellfound (card density), Himalayas
(whitespace restraint — currently the benchmark for remote job boards),
We Work Remotely (proof that no-decoration can still feel premium), Dribbble
Jobs (visual-first company identity). Current direction is a dark
terminal/console aesthetic — mono type, one signal-green accent, bracketed
status tags. Two unexplored alternatives if a fresh look is wanted instead:

- **Editorial/ledger**: paper-white, hairline rules, serif display face for
  titles — listings read like well-typeset classifieds, not app cards
- **Field-notes**: warm off-white, monospace "index card" per listing, subtle
  grid-paper texture — feels hand-catalogued rather than templated

Whichever direction, commit fully. Timidity, not boldness, is the usual
failure mode in AI-assisted builds.

## Tech context

- Next.js (App Router) + TypeScript + Tailwind v4
- No backend — `localStorage` only (see `lib/storage.ts`, `lib/data.ts`)
- CI: GitHub Actions — lint → typecheck → build
- Deploy: Vercel, connected to the GitHub repo (push to `main` triggers
  deploy) — this alone satisfies "deploy via CI/CD," no need to also wire a
  separate deploy-hook Action unless there's time to spare

## Approach — think like a senior engineer, not a feature-checklist builder

The brief says evaluators are watching "approach" more than anything. A
senior architect / senior developer / senior engineer reviewing this would
be looking past the feature list, at *how decisions got made*. That has to
show up in the code, the commits, and the README — not just be true in your
head. Concretely:

- **Every file has one job.** `lib/signal.ts` computes a score and nothing
  else. `lib/storage.ts` only reads/writes local data. `components/JobCard`
  only renders — it doesn't fetch, filter, or persist. If a change to one
  concern forces edits in three unrelated files, that's a sign the
  boundaries are wrong. This is the single biggest tell a senior reviewer
  looks for in an unfamiliar codebase: can I change one thing without
  understanding the whole system first?
- **Naming carries intent.** `signalTier()`, `computeSignal()`,
  `toggleSaved()` — a function name should make its call site readable
  without opening the function. Avoid vague names like `handleData` or
  `processJob`.
- **No dead ends.** Every state has a real empty/loading/error version —
  not a blank screen. "NO MATCHES," "NOTHING SAVED YET" already exist in
  this repo for exactly this reason. A senior engineer treats the empty
  state as part of the feature, not an afterthought.
- **Commits tell the story.** Small, scoped commits ("add signal score
  breakdown to detail page," not "updates") — a reviewer should be able to
  read the commit log and understand the build order without opening a
  single file.
- **Decisions are written down, not just made.** The "Decision: scope"
  section above is meant to become README content, near-verbatim. Senior
  engineers are judged as much on what they chose *not* to build, and why,
  as on what they shipped. Silence about scope reads as not having thought
  about it; a stated tradeoff reads as judgment.
- **Nothing is "AI magic."** Every claim in the UI (Signal Score, red flags)
  has a plain-English, inspectable reason behind it, visible to the user.
  That's what separates an engineer who understands what they built from
  one who prompted their way to something that merely looks plausible.

## UX — this is what's actually being graded

Since "approach to UX" is the explicit evaluation line in the brief, treat
UX as the primary deliverable, not a skin over the features. A senior
product-minded engineer's checklist, applied ruthlessly:

- **Every interactive element responds within one frame.** Save toggles,
  filter changes, form validation — no spinners for actions that don't need
  a network round trip. This app has none, and that's a UX advantage worth
  keeping, not a limitation to apologize for.
- **Errors are specific, not generic.** "Enter a valid minimum" beats
  "Invalid input." A validation message should tell someone exactly what to
  fix, not just that something's wrong.
- **The UI never lies about state.** If a save didn't persist, the button
  shouldn't say SAVED. If a score is a heuristic, don't dress it up as
  something smarter than it is.
- **Keyboard and focus work without a mouse.** Visible focus rings
  (`:focus-visible` is already set up), logical tab order, forms
  submittable by Enter. A reviewer who tabs through the site once and hits
  a dead end has learned everything they need to about the polish level.
- **Motion has a reason.** The scanline/hero effect exists once, for one
  purpose, and respects `prefers-reduced-motion`. Senior UX judgment is
  usually shown more by what's *left out* — no scroll-jacking, no bouncing
  buttons, no confetti — than by what's added.
- **Mobile isn't an afterthought pass.** Every screen should be checked at
  ~375px width before considering a feature done, not fixed up at the end.
- **Copy is part of the UX, not filler.** "Goes live immediately, visible
  only in your browser for this demo" (already on the Post page) is doing
  real work — it sets expectations so nobody's confused why their posted
  job isn't visible to anyone else. Every screen should have at least one
  line like that if it needs one.

The test for whether this section succeeded: a senior reviewer should be
able to look at any single screen, in isolation, and correctly guess *why*
each decision on it was made — without reading this file.

## Guardrail

Before adding anything beyond the finalized list above: does this make the
product more likely to break on submission day, or more likely to impress
in the 3 days available? If it's the former, cut it — a small thing that
works beats a big thing that might not.
