-- Aperitivos are food, not beverages. Keep the source CSV category unchanged.
update public.products
set category = 'Alimentos'
where category_raw = 'APERITIVO' and category <> 'Alimentos';

