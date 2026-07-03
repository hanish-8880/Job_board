# Signalboard

A full-stack job board with real accounts, a real Postgres database, and
real AI features — alongside two transparent, inspectable heuristics
(Signal Score, red-flag detector) that were the standout of an earlier,
smaller version of this project. Nothing here fakes data or fakes AI: if a
feature calls a real model, it says so and shows the model name; if it's a
heuristic, its full method is visible on the page.

**Live app:** https://job-board-steel-theta.vercel.app
**Repo:** https://github.com/hanish-8880/Job_board

---

## Why this version exists

This started as a 3-day take-home assessment, scoped deliberately small:
no backend, no accounts, `localStorage` only — reasoning that a smaller,
fully-working product beats a larger, half-working one under a tight
deadline with an "any broken link = instant rejection" clause. That
version shipped, fully tested, before this one was built.

A competing, much larger plan was then presented — real accounts, a
database, employer/candidate dashboards, several "AI" features — and,
after being warned this adds real deploy risk (auth flows, environment
variables, an external database, a third-party API key), the decision was
made to build it anyway. This README documents what that build actually
contains, and what was deliberately cut from the larger plan and why —
the same "state the tradeoff" discipline as the smaller version.

## What's cut from the larger plan, and why

- **Employer analytics / hiring-funnel charts** — a brand-new board has no
  real traffic to chart yet. Faking the data would break the "nothing
  fake" rule; an empty chart is worse than no chart.
- **Messages / in-app chat** — a full separate realtime feature with its
  own edge cases (unread state, notifications). Applications already carry
  a status and an optional cover letter, which is the real workflow here.
- **Terms / Privacy / Help Center pages** — there's no real company or
  policy behind this app; placeholder legal text would itself be exactly
  the kind of fake content this project avoids elsewhere.
- **A "Premium" tier** — there's no payment processing in this app. A
  paywall banner that doesn't actually gate anything would be exactly the
  kind of dishonest UI this project avoids elsewhere, so it isn't here.

## Features

### Public marketing page (`/`)

A pure marketing page — no job list lives here. It explains the product
(Signal Score, red-flag detector, real AI features), links to `/browse`
and `/signup`, and includes an honest FAQ. Every number shown (roles
listed, roles rated Strong Signal, roles flagged) is computed live from
the app's own database — nothing is a placeholder marketing figure.

### Browse (`/browse`) — requires an account

- **Search + filter** — free text across title/company/tags, mode and
  level filters, instant client-side filtering.
- **Signal Score** (`lib/signal.ts`) — a transparent 0–100 score computed
  only from a listing's own data: salary disclosed, salary range
  realistic, 3+ concrete responsibilities, 3+ concrete requirements,
  substantive description, posted recently, non-buzzword tags. The full
  checklist is visible on every listing page — never just a number.
- **Red-flag detector** (`lib/redflags.ts`) — pattern-matches a listing's
  own text against phrasing common in exploitative postings (unpaid
  "assessments," tight deadlines, reply-all instructions, vague company
  info, rejection threats), and shows the exact quoted phrase that
  triggered each flag.
- **Save / bookmark** and a real **Apply** flow (optional cover letter,
  stored as a real `applications` row).

Browsing and job detail pages require a logged-in account — this was a
deliberate change partway through the build (see commit history): the
public homepage had started showing the full job list directly, which
read as an app screen bleeding into the marketing page rather than a
real gate. `/browse` and `/jobs/[id]` now redirect anonymous visitors to
`/login?next=...` and return them to where they were headed after login.

The listings on the live demo aren't fabricated data sitting outside the
database — they're real rows, created by `scripts/seed-demo-data.js`,
which scripts real signups through the actual signup → post-a-role flow
(public anon key, real RLS-protected inserts, no service_role key) so
Signal Score and the red-flag detector have realistic variety to
demonstrate against. Every one of those rows could equally have been
created by a person clicking through the UI — the script is committed so
that's independently checkable, not just claimed.

### Accounts

Email/password and Google sign-in via Supabase Auth. Every account is
either a **candidate** or an **employer**, chosen at signup (or via a
one-time onboarding step for Google sign-ins, which don't carry that
choice through the OAuth redirect). Google sign-in isn't configured on
this deployment; the button says so honestly instead of hitting a broken
endpoint.

### Employer dashboard (`/employer`)

- **Company profile** — one per account; required before posting a role.
- **Post / edit / delete roles**, publish or save as a draft.
- **My Jobs** — every role you've posted, with status toggling.
- **Applicants per role** — see who applied, read their optional cover
  letter, and move them through applied → reviewing → accepted/rejected.
- **Home** — real counts (published roles, drafts, total applications).
  No charts (see cuts above).

### Candidate dashboard (`/dashboard`)

- **Matches** (`/dashboard/matches`) — upload a resume (.pdf, .docx, .txt)
  or paste it, and scoring starts automatically — no separate "find
  matches" click. One real Gemini call returns an ATS score plus a match
  score for every currently published role (capped at 30 in a single
  request, rather than one call per job), shown as a ranked list with a
  colored match-score ring, location/mode/level, tags, a real Save
  button, and a link into the real job page. Computed on request and
  cached on your profile — revisiting the page doesn't silently re-run
  it, and a staged loading indicator (reading → scoring → ranking) covers
  the real ~20–30s the call takes, since that's an actual model call, not
  something to fake into feeling instant.
- **AI Resume Review** — a real Google Gemini (`gemini-2.5-flash`) call
  given your resume text and one job's description. Returns missing
  skills, strengths, and weaknesses. On failure, shows a real error —
  never a fabricated fallback score.
- **AI Cover Letter** — same model, generates an editable, copyable draft
  grounded in your resume and the selected job.
- **Saved roles** and **Applied roles** (with real, employer-set status).

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**
- **Supabase**: Postgres (schema in `supabase/migrations/`) + Auth
  (email/password, Google OAuth). Every table has row-level security
  scoped to `auth.uid()` — the app never uses or needs the `service_role`
  key.
- **Google Gemini** (`gemini-2.5-flash`), called only from server routes
  (`app/api/ai/*`) with `GEMINI_API_KEY` as a server-only env var, never
  exposed to the browser. Every AI route requires an authenticated
  session and caps input length; `maxDuration` is set explicitly on the
  match-jobs route since scoring every listing in one call genuinely
  takes ~20–30s.
- `lib/queries/*` — one file per table/concern (jobs, companies,
  applications, bookmarks, profiles), each exporting plain functions that
  take a Supabase client and return typed data. Called from Server
  Components, Server Actions, and Route Handlers alike.
- `app/*/actions.ts` — Server Actions for every mutation (auth, job
  posting, applying, bookmarking, profile/resume/company edits).
- `lib/signal.ts`, `lib/redflags.ts`, `lib/filters.ts`, `lib/validate.ts`
  are pure functions with no knowledge of storage — unchanged since the
  original smaller build, which is exactly why they didn't need to
  change when the storage layer did.

## Setup

### 1. Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In the SQL Editor, run every file in `supabase/migrations/` in order,
   once.
3. In **Authentication → Sign In / Providers → Email**, turn off "Confirm
   email" (a deliberate scope decision for a demo project — real accounts
   without a verification-loop step to test manually).
4. Copy **Project URL** and the **anon/public** key from
   **Project Settings → API**.

### 2. Google OAuth (optional — email/password works fully without it)

1. In [Google Cloud Console](https://console.cloud.google.com), create an
   OAuth consent screen and an OAuth Client ID (Web application).
2. Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase **Authentication → Providers → Google**, paste the Client
   ID and secret, enable the provider.
4. In Supabase **Authentication → URL Configuration**, add your app's
   origin(s) (`http://localhost:3000` and your Vercel URL) to Redirect
   URLs.

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

Set the same three in Vercel (**Project Settings → Environment
Variables**) before deploying.

## Running locally

```bash
npm install
npm run dev
```

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): every push and PR to `main` runs
  lint → typecheck → build on GitHub Actions.
- **Deploy**: Vercel is connected directly to the GitHub repo; a push to
  `main` triggers a production deploy automatically.

## Design

Synthesizes structural cues from several job platforms (card density and
clean nav, whitespace and polish, search/filter layout, typography
clarity) rather than cloning any one of them: white surfaces on a light
green-tinted background, rounded cards with soft shadows, a green accent
carried through from the original smaller build, Inter throughout, and
`lucide-react` icons everywhere a label alone would be ambiguous.
`framer-motion` adds restrained polish — card hover-lift, fade/stagger
entrances, floating callout cards on the homepage — that respects
`prefers-reduced-motion` and never gates interactivity.

The homepage hero's floating callout cards show the same real, live
Signal Score and red-flag result as the main preview card — not stock
photography or fabricated growth stats, since this app has no real user
base to depict.
