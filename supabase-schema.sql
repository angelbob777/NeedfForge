create table public.tree_spots (
  id bigint generated always as identity primary key,
  level integer not null check (level between 1 and 10),
  position integer not null check (position between 1 and 10),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  unique (level, position),
  unique (user_id, level)
);

alter table public.tree_spots enable row level security;

create policy "Anyone can view assigned spots"
  on public.tree_spots for select
  using (true);

create or replace function public.claim_next_spot()
returns public.tree_spots
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.tree_spots;
begin
  insert into public.tree_spots (level, position, user_id, email)
  select levels.level, positions.position, auth.uid(), coalesce(auth.jwt()->>'email', '')
  from generate_series(1, 10) as levels(level)
  cross join generate_series(1, 10) as positions(position)
  where not exists (
    select 1 from public.tree_spots occupied
    where occupied.level = levels.level and occupied.position = positions.position
  )
  order by levels.level, positions.position
  limit 1
  returning * into claimed;

  if claimed.id is null then
    raise exception 'All 50 spots are occupied';
  end if;
  return claimed;
end;
$$;

revoke all on function public.claim_next_spot() from public;
grant execute on function public.claim_next_spot() to authenticated;
