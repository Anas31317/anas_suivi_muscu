-- =====================================================================
--  Partage entre utilisateurs : « Suivi Amis »
--
--  À coller dans Supabase > SQL Editor > New query, puis "Run".
--  Le script peut être relancé sans risque.
--
--  Chacun publie une copie de son suivi dans `shares`, associée à un code.
--  Cette copie n'est lisible que par quelqu'un qui connaît le code exact :
--   - le propriétaire gère sa ligne (auth.uid()) ;
--   - les autres ne peuvent lire QUE la ligne dont le code est envoyé dans
--     l'en-tête « x-share-code » : impossible de lister les autres.
--  Changer de code coupe l'accès à tous ceux qui avaient l'ancien.
-- =====================================================================

create table if not exists public.shares (
  user_id     uuid primary key default auth.uid()
              references auth.users (id) on delete cascade,
  code        text not null unique
              check (code = upper(code) and char_length(code) between 6 and 16),
  name        text not null default '',
  data        jsonb not null
              check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 2000000),
  updated_at  timestamptz not null default now()
);

alter table public.shares enable row level security;
revoke all on public.shares from anon;
grant select, insert, update, delete on public.shares to authenticated;

drop policy if exists "gerer son partage" on public.shares;
drop policy if exists "lecture par code"  on public.shares;

-- Le propriétaire : tous les droits sur sa ligne.
create policy "gerer son partage" on public.shares
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Les autres : lecture de la seule ligne dont ils fournissent le code.
create policy "lecture par code" on public.shares
  for select to authenticated
  using (code = upper(coalesce(current_setting('request.headers', true)::json ->> 'x-share-code', '')));

drop trigger if exists touch_updated_at on public.shares;
create trigger touch_updated_at
  before insert or update on public.shares
  for each row execute function public.touch_updated_at();
