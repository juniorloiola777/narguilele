create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_site_admin()
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users
    where id = (select auth.uid())
      and lower(email) = 'juniorloiola777@gmail.com'
      and email_confirmed_at is not null
      and coalesce((select auth.jwt())->>'is_anonymous','false') = 'false'
  );
$$;
revoke all on function private.is_site_admin() from public;
grant execute on function private.is_site_admin() to anon, authenticated;

create or replace function public.is_site_admin()
returns boolean language sql stable security invoker set search_path = '' as $$
  select private.is_site_admin();
$$;
