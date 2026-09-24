-- The catalog CSV identifies each product by its code.
create unique index if not exists products_codigo_key on public.products (codigo);

