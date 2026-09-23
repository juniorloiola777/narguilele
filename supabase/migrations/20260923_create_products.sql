-- Catálogo preparado para futura integração do HTML com Supabase.
-- O HTML publicado continua como fonte dos 498 produtos até a migração ser validada.
create table if not exists public.products (
  id text primary key,
  codigo text not null,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  category_raw text not null,
  category text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_active_category_name_idx
  on public.products (category, name) where is_active;

alter table public.products enable row level security;

create policy "Catalogo ativo visivel publicamente"
  on public.products for select
  to anon, authenticated
  using (is_active);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
revoke insert, update, delete on public.products from anon, authenticated;
