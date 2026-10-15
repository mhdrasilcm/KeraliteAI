-- Keralite AI: saved chats (the "Recent" list in the sidebar).
-- Safe to run more than once. Run it in the Supabase SQL editor.

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_profile_updated_idx
  on public.conversations (profile_id, updated_at desc);

alter table public.conversations enable row level security;

drop policy if exists "Users manage only their own profiles' conversations" on public.conversations;
create policy "Users manage only their own profiles' conversations"
  on public.conversations
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = conversations.profile_id and p.account_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = conversations.profile_id and p.account_id = auth.uid()
    )
  );

-- Messages now belong to a conversation.
alter table public.chat_messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade;

create index if not exists chat_messages_conversation_idx
  on public.chat_messages (conversation_id, created_at);

-- Tighten the messages policy: a message must sit in a conversation of the SAME profile.
drop policy if exists "Users manage only their own profiles' messages" on public.chat_messages;
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
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = chat_messages.conversation_id and c.profile_id = chat_messages.profile_id
      )
    )
  );
