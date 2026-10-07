-- Keralite AI — Supabase schema
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- Data at rest is encrypted by Supabase/Postgres by default; RLS below is
-- what actually stops one family's account from reading another's rows.

create extension if not exists "pgcrypto";

-- One row per STUDENT PROFILE. Many profiles can share one auth.users row
-- (account_id) — this is what lets one email cover multiple siblings.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  class_level text not null check (class_level in ('5','6','7','8','9')),
  first_language text not null check (first_language in ('malayalam','urdu','arabic','sanskrit')),
  medium text not null check (medium in ('english','malayalam')),
  avatar_emoji text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users manage only their own profiles"
  on public.profiles
  for all
  using (auth.uid() = account_id)
  with check (auth.uid() = account_id);

-- Textbook / resource content, tagged by the same class/medium axes used
-- in onboarding so the chat API can filter what the SLM is allowed to see.
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_level text not null check (class_level in ('5','6','7','8','9')),
  medium text not null check (medium in ('english','malayalam')),
  subject text,
  content text not null, -- chunked textbook text; swap for a vector column + pgvector for real RAG
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Any signed-in user can read resources"
  on public.resources
  for select
  using (auth.role() = 'authenticated');

-- Optional: persist chat history per profile.
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "Users manage only their own profiles' messages"
  on public.chat_messages
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = chat_messages.profile_id and p.account_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = chat_messages.profile_id and p.account_id = auth.uid()
    )
  );

-- pgvector, when you're ready for real semantic retrieval instead of the
-- plain class/medium filter used in the MVP chat route:
-- create extension if not exists vector;
-- alter table public.resources add column embedding vector(384);
-- create index on public.resources using ivfflat (embedding vector_cosine_ops);
