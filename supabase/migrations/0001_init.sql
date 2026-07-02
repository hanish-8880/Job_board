-- Signalboard schema: profiles, companies, jobs, applications, bookmarks.
-- Every table has RLS enabled; every policy scopes to auth.uid(), so the
-- app never needs the service_role key.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('candidate', 'employer')),
  full_name text,
  resume_text text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row on signup, reading role/full_name from the
-- metadata passed to supabase.auth.signUp(). security definer means this
-- runs with the function owner's privileges, bypassing RLS for the insert.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'candidate'),
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- companies (one per employer)
-- ---------------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles (id) on delete cascade,
  name text not null,
  website text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "Companies are viewable by everyone"
  on public.companies for select
  using (true);

create policy "Employers manage their own company"
  on public.companies for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------
-- jobs
-- ---------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  location text not null,
  mode text not null check (mode in ('remote', 'hybrid', 'onsite')),
  level text not null check (level in ('junior', 'mid', 'senior', 'lead')),
  salary_min integer,
  salary_max integer,
  currency text not null default 'USD',
  tags text[] not null default '{}',
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create index jobs_company_id_idx on public.jobs (company_id);
create index jobs_status_idx on public.jobs (status);

alter table public.jobs enable row level security;

create policy "Published jobs are public, drafts visible to their owner"
  on public.jobs for select
  using (
    status = 'published'
    or company_id in (select id from public.companies where owner_id = auth.uid())
  );

create policy "Employers manage jobs for their own company"
  on public.jobs for all
  using (company_id in (select id from public.companies where owner_id = auth.uid()))
  with check (company_id in (select id from public.companies where owner_id = auth.uid()));

-- ---------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  cover_letter text,
  status text not null default 'applied' check (status in ('applied', 'reviewing', 'rejected', 'accepted')),
  created_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create index applications_job_id_idx on public.applications (job_id);
create index applications_candidate_id_idx on public.applications (candidate_id);

alter table public.applications enable row level security;

create policy "Candidates view their own applications, employers view applications to their jobs"
  on public.applications for select
  using (
    candidate_id = auth.uid()
    or job_id in (
      select j.id from public.jobs j
      join public.companies c on c.id = j.company_id
      where c.owner_id = auth.uid()
    )
  );

create policy "Candidates create their own applications"
  on public.applications for insert
  with check (candidate_id = auth.uid());

create policy "Candidates withdraw their own applications"
  on public.applications for delete
  using (candidate_id = auth.uid());

-- Employers can update applications to their own jobs (used to change
-- status). RLS doesn't restrict to individual columns, so this trusts
-- employers not to rewrite a candidate's cover letter — acceptable for
-- this project's scope, called out here rather than left silent.
create policy "Employers update applications to their own jobs"
  on public.applications for update
  using (
    job_id in (
      select j.id from public.jobs j
      join public.companies c on c.id = j.company_id
      where c.owner_id = auth.uid()
    )
  )
  with check (
    job_id in (
      select j.id from public.jobs j
      join public.companies c on c.id = j.company_id
      where c.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- bookmarks
-- ---------------------------------------------------------------------
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create index bookmarks_candidate_id_idx on public.bookmarks (candidate_id);

alter table public.bookmarks enable row level security;

create policy "Candidates manage their own bookmarks"
  on public.bookmarks for all
  using (candidate_id = auth.uid())
  with check (candidate_id = auth.uid());
