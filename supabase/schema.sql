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

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;

-- Profiles policies
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
