# Integração com Supabase — SITE NARGUILE-LE

Projeto Supabase: `wpyzjukssdnoxpvrfmti`  
URL pública: `https://wpyzjukssdnoxpvrfmti.supabase.co`

## Estado atual

O `index.html` é o arquivo completo enviado, sem alterações. Ele contém 498 produtos no elemento `#productData`. Busca, filtros, carrinho em `localStorage`, contato e pedido por WhatsApp funcionam no próprio navegador. Ainda não há consultas ao Supabase nem gravação de pedidos.

## Base preparada

A migração em `supabase/migrations/20260923_create_products.sql` cria `public.products` com os campos do catálogo atual. RLS permite apenas leitura dos produtos ativos a visitantes e usuários autenticados. Escrita pública está bloqueada. A tabela começa vazia; o catálogo visível continua embutido no HTML.

## Próxima integração

1. Importar os 498 produtos do JSON de `#productData`, conferindo IDs, categorias e preços.
2. Configurar no front-end a URL do projeto e uma **publishable key**. Essa chave pode aparecer no navegador; jamais colocar `secret` ou `service_role` no HTML ou GitHub.
3. Substituir a origem dos dados do catálogo apenas após comparar o resultado com a versão atual e manter um caminho de recuperação. Preservar o design, filtros e carrinho.
4. Definir a necessidade de pedidos persistidos, autenticação e painel administrativo antes de criar tabelas ou políticas de escrita. O fechamento por WhatsApp permanece até essa definição.

A publicação na Vercel segue a branch `main`; esta preparação não requer variáveis de ambiente nem altera o deploy visual.
