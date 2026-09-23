-- Remove privilégios herdados da tabela; só produtos ativos podem ser lidos por RLS.
revoke all privileges on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
