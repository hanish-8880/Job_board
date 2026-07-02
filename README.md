# Signalboard

A job board that shows its work. Every listing carries a transparent,
inspectable **Signal Score** and a **red-flag check** — both computed
from the listing's own text, with the full method visible on the page.
Nothing in this app claims to be "AI" and isn't; nothing hides its
reasoning behind a single opaque number.

**Live app:** _add your Vercel URL here after deploying_
**Repo:** _add your GitHub URL here after pushing_

---

## Why this exists (and why it's this small)

This was built as a 3-day take-home assessment. The brief: build a job
board, evaluated on "approach to UX and feature details" — not on
feature count.

The tempting version of this project is a full-stack build: accounts,
a hosted database, an employer dashboard, a resume analyzer, an "AI
match score." That was deliberately rejected, for three reasons:

1. **That scope is 2–3 weeks of work for a team, not 3 days solo.** A
   half-wired backend reads worse in review than a small, fully-working
   product. Evaluators looking at many submissions notice a broken auth
   flow or an empty dashboard state faster than they notice ambition.
2. **Every added moving part is a new way to fail "all links must
   work."** Auth, a hosted database, environment variables on
   Vercel — each is a deploy-risk surface this app doesn't need to
   carry. Deploy risk was treated as the real enemy here, not feature
   count.
3. **A fake "AI" feature is a liability, not a strength.** A hardcoded
   "AI match score" or a `Math.random()` resume grader survives about
   30 seconds of scrutiny before it becomes the whole story of the
   submission. Anything that looks like AI in this app either is a
   plainly-labeled heuristic with its method visible, or it doesn't
   ship.

What was kept from that instinct: build **one cohesive product with a
small number of fully-working features**, not a wide grid of half-built
ones. That's the actual shape of this repo.

### Concretely, that meant

- **No backend, no accounts.** All data — seed listings, anything you
  post, saved jobs, local "applications" — lives in this browser's
  `localStorage`. This is a deliberate architecture choice, not a
  corner cut: it means every feature that ships is **fully functional
  with zero deploy risk**. Open the deployed link and everything works,
  immediately, with nothing to configure.
- **No fake AI UI.** The Signal Score and red-flag detector are both
  plain heuristics over the listing's own text. Neither is presented as
  smarter than it is, and both show their full method on the page.
- **One extra feature, not five.** Past the core job-board mechanics,
  exactly one additional feature was built end-to-end (the red-flag
  detector) instead of five built halfway.

---

## Features

### Core

- **Search + filter** — free text across title, company, and tags;
  filter by work mode (remote/hybrid/onsite) and experience level.
  Filtering is instant client-side state, no network round trip.
- **Save / bookmark** — persists to `localStorage`, with a dedicated
  Saved page and a real empty state ("Nothing saved yet") rather than a
  blank screen.
- **Post a role** — a real client-side–validated form (required
  fields, salary min/max sanity checks with specific per-field error
  messages). Publishing redirects straight to the new listing's detail
  page, where you can watch its Signal Score get computed live from
  what you just typed.
- **Job detail + Apply flow** — since there's no backend to actually
  receive an application, "Apply" is implemented honestly: it records
  a local application state for that listing (persisted, idempotent,
  visibly labeled as a local-only demo action) rather than linking out
  to a fake external URL that would just be a dead end.

### Signal Score (`lib/signal.ts`)

A transparent 0–100 quality score computed **only from data already on
the listing** — no external calls, no model, nothing invisible. Seven
checks, each independently visible on the listing page with the exact
reason it passed or failed:

| Check | Points | What it looks for |
|---|---|---|
| Salary disclosed | 15 | A min and max are both provided |
| Salary range is realistic | 10 | Within a plausible full-time band and not absurdly wide |
| 3+ concrete responsibilities | 15 | At least 3 responsibility bullets |
| 3+ concrete requirements | 15 | At least 3 requirement bullets |
| Substantive description | 15 | 40+ words in the description |
| Posted recently | 15 | Within the last 30 days |
| Tags are specific, not buzzwords | 15 | Tags aren't generic filler ("rockstar," "fast-paced," "self-starter," etc.) |

Scores ≥75 are **Strong Signal**, ≥45 are **Moderate Signal**, below
that is **Weak Signal**. The full checklist — pass/fail, points, and
the exact value that produced the result — is shown on every listing's
detail page, never just the number.

### Red-flag detector (`lib/redflags.ts`)

The one feature chosen beyond the core list, picked because it's
useful to an actual job seeker, not just a portfolio flourish, and
because it's honest about being a heuristic in the same way the Signal
Score is. It pattern-matches a listing's own text against phrasing
commonly reported in exploitative postings:

- Unpaid work reframed as an "assessment" or "trial task"
- Unusually tight deadlines ("within 24 hours," "by tonight")
- "Reply-all" mass-instruction patterns
- Vague, unverifiable company info ("confidential client," "leading
  company in the industry")
- Threat-style rejection language ("any broken link = instant
  rejection")
- Requests for candidates to pay or buy equipment
- Unpaid roles with no stated compensation

Every match is shown with the **exact quoted phrase** that triggered
it — this is pattern matching against the listing's own words, not a
judgment about the employer, and the evidence line lets you check that
for yourself instead of trusting a score.

---

## Design

The visual direction is **editorial / ledger**: paper-white background,
hairline rules, a serif display face for titles, and a monospace face
for anything that reads like a ledger figure — scores, salaries, tags,
dates. The goal was something that reads like a well-typeset classifieds
page rather than an app dashboard, with a single navy accent instead of
a full UI-chrome color palette.

---

## Tech

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**
- **No backend** — `localStorage` only, via a small pub-sub store in
  `lib/storage.ts` read through React's `useSyncExternalStore`, so the
  UI stays in sync across tabs/components without manual state-syncing
  effects or SSR hydration mismatches
- Each `lib/*.ts` file has exactly one job: `signal.ts` scores,
  `redflags.ts` detects, `storage.ts` reads/writes local data,
  `filters.ts` filters, `validate.ts` validates. Components render;
  they don't fetch, filter, or persist.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): every push and PR to `main` runs
  lint → typecheck → build on GitHub Actions.
- **Deploy**: Vercel is connected directly to the GitHub repo, so a
  push to `main` (after CI passes) triggers a production deploy. That
  alone satisfies "deploy via CI/CD" without adding a second,
  redundant deploy-hook Action.

## What's intentionally not here

No auth, no database, no server-rendered per-user data, no AI-branded
features that aren't inspectable heuristics. Each of those is a real
feature this app could grow into — they were left out because a small
thing that fully works beats a big thing that might not, especially
under a 3-day deadline where every added moving part is a new way to
fail "all links must be fully functional."
