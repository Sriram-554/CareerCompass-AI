-- Run this in Supabase → SQL Editor → New query

-- User assessment profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text default '',
  degree text default 'B.Tech',
  branch text default '',
  year text default '',
  skills text[] default '{}',
  interests text[] default '{}',
  preference text default '',
  college_code text default '',
  college_name text default '',
  updated_at timestamptz default now()
);

-- Learning progress per career
create table if not exists public.learning_progress (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  career_title text not null,
  completed_topics text[] default '{}',
  updated_at timestamptz default now(),
  unique (user_id, career_title)
);

-- College invite codes
create table if not exists public.college_codes (
  code text primary key,
  college_name text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Safe migrations for existing projects
alter table public.profiles add column if not exists college_code text default '';
alter table public.profiles add column if not exists college_name text default '';

insert into public.college_codes (code, college_name, active)
values
  ('DEMO2026', 'Demo College', true),
  ('SIH2026', 'Smart India Hackathon Cohort', true),
  ('CAMPUS2026', 'Campus Pilot Program', true)
on conflict (code) do nothing;

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.college_codes enable row level security;

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Learning progress policies
drop policy if exists "Users can view own progress" on public.learning_progress;
drop policy if exists "Users can insert own progress" on public.learning_progress;
drop policy if exists "Users can update own progress" on public.learning_progress;
drop policy if exists "Users can delete own progress" on public.learning_progress;

create policy "Users can view own progress"
  on public.learning_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.learning_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.learning_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.learning_progress for delete
  using (auth.uid() = user_id);

-- College codes are readable by authenticated and anon users for validation
drop policy if exists "Anyone can read active college codes" on public.college_codes;
create policy "Anyone can read active college codes"
  on public.college_codes for select
  using (active = true);
