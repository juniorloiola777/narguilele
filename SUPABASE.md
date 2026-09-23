# Integração com Supabase — SITE NARGUILE-LE

Projeto: `wpyzjukssdnoxpvrfmti`  
URL pública: `https://wpyzjukssdnoxpvrfmti.supabase.co`

## Estado atual

O catálogo original de 498 produtos foi importado para `public.products`. O `index.html` consulta os produtos ativos pela API do Supabase antes de montar as telas. Se a consulta falhar ou demorar mais de quatro segundos, utiliza o catálogo completo embutido no mesmo HTML. Design, busca, filtros, carrinho em `localStorage`, formulário de contato e fechamento por WhatsApp foram preservados.

A página usa somente a chave **publishable**, adequada para código público. Nunca adicionar uma chave `secret` ou `service_role` ao HTML, repositório ou ambiente do navegador.

## Segurança

- RLS está ativo em `public.products`.
- `anon` e `authenticated` recebem apenas `SELECT`; a política de leitura só permite linhas com `is_active = true`.
- Nenhuma escrita pública está liberada. Alterações no catálogo exigem acesso administrativo ao Supabase ou backend seguro.
- Migrações aplicadas: `supabase/migrations/20260923_create_products.sql` e `supabase/migrations/20260923_restrict_products_public_privileges.sql`.

## Próximos passos

Definir se pedidos deverão ser persistidos e se haverá painel administrativo e autenticação. Esses recursos exigem novas tabelas e políticas específicas. Até lá, o pedido continua sendo enviado por WhatsApp e o carrinho continua no dispositivo do visitante.
