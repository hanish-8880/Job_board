# Signalboard

A full-stack job board with real accounts, a real Postgres database, and
two real AI features — alongside two transparent, inspectable heuristics
(Signal Score, red-flag detector) that were the standout of an earlier,
smaller version of this project. Nothing here fakes data or fakes AI: if a
feature calls a real model, it says so and shows the model name; if it's a
heuristic, its full method is visible on the page.

**Live app:** _add your Vercel URL here after deploying_
**Repo:** _add your GitHub URL here after pushing_

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
- **AI Interview Questions / AI Skill Gap** — rather than four thinner AI
  features, **AI Match Score is folded into the Resume Review call**: one
  real Gemini request returns both an ATS-style score and a match score
  against a specific job.
- **Resume upload/PDF parsing** — real PDF parsing is its own failure
  surface (corrupt files, extraction errors). Candidates paste resume text
  instead — still a fully real, working feature, just without a parser
  dependency.
- **Terms / Privacy / Help Center pages** — there's no real company or
  policy behind this app; placeholder legal text would itself be exactly
  the kind of fake content this project avoids elsewhere.

## Features

### Public

- **Browse + search + filter** — free text across title/company/tags,
  filtered instantly client-side once loaded; mode and level filters.
  Anonymous visitors can browse and read every listing.
- **Signal Score** (`lib/signal.ts`) — an unchanged carryover from the
  original build. A transparent 0–100 score computed only from a
  listing's own data: salary disclosed, salary range realistic, 3+
  concrete responsibilities, 3+ concrete requirements, substantive
  description, posted recently, non-buzzword tags. Full checklist visible
  on every listing page — never just a number.
- **Red-flag detector** (`lib/redflags.ts`) — also unchanged. Pattern-
  matches a listing's own text against phrasing common in exploitative
  postings (unpaid "assessments," tight deadlines, reply-all instructions,
  vague company info, rejection threats), and shows the exact quoted
  phrase that triggered each flag.

### Accounts

Email/password and Google sign-in via Supabase Auth. Every account is
either a **candidate** or an **employer**, chosen at signup (or via a
one-time onboarding step for Google sign-ins, which don't carry that
choice through the OAuth redirect).

### Employer dashboard (`/employer`)

- **Company profile** — one per account; required before posting a role.
- **Post / edit / delete roles**, publish or save as a draft.
- **My Jobs** — every role you've posted, with status toggling.
- **Applicants per role** — see who applied, read their optional cover
  letter, and move them through applied → reviewing → accepted/rejected.
- **Home** — real counts (published roles, drafts, total applications).
  No charts (see cuts above).

### Candidate dashboard (`/dashboard`)

- **Saved roles** and **Applied roles** (with real, employer-set status).
- **Resume** — plain-text resume, used by both AI features below.
- **AI Resume Review + Match Score** — a real Google Gemini (`gemini-2.5-flash`) call
  given your resume text and one job's description. Returns an ATS score,
  a match score for that specific job, missing skills, strengths, and
  weaknesses. On failure, shows a real error — never a fabricated
  fallback score.
- **AI Cover Letter** — same model, generates an editable, copyable draft
  grounded in your resume and the selected job.
- **Apply flow** — an optional cover letter, submitted as a real
  `applications` row tied to your account.

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**
- **Supabase**: Postgres (schema in `supabase/migrations/0001_init.sql`)
  + Auth (email/password, Google OAuth). Every table has row-level
  security scoped to `auth.uid()` — the app never uses or needs the
  `service_role` key.
- **Google Gemini** (`gemini-2.5-flash`), called only from server routes
  (`app/api/ai/*`) with `GEMINI_API_KEY` as a server-only env var, never
  exposed to the browser. Both routes require an authenticated session and
  cap input length.
- `lib/queries/*` — one file per table/concern (jobs, companies,
  applications, bookmarks, profiles), each exporting plain functions that
  take a Supabase client and return typed data. Called from Server
  Components, Server Actions, and Route Handlers alike.
- `app/*/actions.ts` — Server Actions for every mutation (auth, job
  posting, applying, bookmarking, profile/resume/company edits). Next.js
  renders fresh server output after each one, so there's no client-side
  session-sync code to maintain.
- `lib/signal.ts`, `lib/redflags.ts`, `lib/filters.ts`, `lib/validate.ts`
  carried over from the original build essentially untouched — they were
  already pure functions with no knowledge of storage, which is exactly
  why they didn't need to change when the storage layer did.

## Setup

### 1. Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In the SQL Editor, run `supabase/migrations/0001_init.sql` once.
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
  lint → typecheck → build.
- **Deploy**: Vercel is connected directly to the GitHub repo; a push to
  `main` (after CI passes) triggers a production deploy.

## Design

Synthesizes structural cues from several job platforms (LinkedIn's card
density and clean nav, Wellfound's whitespace and polish, Indeed's
search/filter layout, Greenhouse's typography clarity) rather than
cloning any one of them: white surfaces on a light-gray background,
rounded cards with soft shadows, an indigo accent chosen specifically
to avoid reading as a LinkedIn clone, Inter throughout, and
`lucide-react` icons everywhere a label alone would be ambiguous.
`framer-motion` adds restrained polish — card hover-lift, fade/stagger
entrances — that respects `prefers-reduced-motion` and never gates
interactivity.

The home page's hero (headline, CTA row, stat strip) takes its
*structure* from jobright.ai, but every number in the stat strip is
computed live from this app's own database — no placeholder marketing
figures.
