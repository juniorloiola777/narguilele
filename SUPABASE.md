# Integração com Supabase — SITE NARGUILE-LE

Projeto: `wpyzjukssdnoxpvrfmti`  
URL pública: `https://wpyzjukssdnoxpvrfmti.supabase.co`

## Estado atual

O catálogo original de 498 produtos permanece em `public.products` para recuperação. Em 24/09/2026, 462 itens relacionados a fumo, narguilé ou álcool foram desativados (`is_active = false`); 36 itens comuns estão publicados. `src/services/products.js` consulta somente os produtos ativos. O fallback local em `src/data/products.js` está vazio; se o Supabase falhar, itens antigos não reaparecem. O design da versão publicada, busca, filtros, carrinho no navegador e fechamento por WhatsApp foram preservados.

A página usa somente a chave **publishable**, adequada para código público. Nunca adicionar uma chave `secret` ou `service_role` ao HTML, repositório ou ambiente do navegador.

## Segurança

- RLS está ativo em `public.products`.
- `anon` lê apenas linhas com `is_active = true`; não tem permissão de escrita nas tabelas.
- Apenas o e-mail confirmado `juniorloiola777@gmail.com` pode escrever em produtos, banners e imagens, por meio de políticas RLS.
- O bucket privado `site-content` guarda imagens. O site gera links temporários somente para imagens associadas a produtos ou banners ativos.
- O painel fica em `/admin.html` e usa login por e-mail do Supabase. É necessário configurar a URL do site publicado em **Authentication → URL Configuration → Redirect URLs** no projeto Supabase para que o link de login volte a `/admin.html`.
- As migrações do painel são `20260924_admin_content.sql` e `20260924_verify_admin_email.sql`.

O pedido continua sendo enviado por WhatsApp e o carrinho continua no dispositivo do visitante. Apagar no painel desativa produtos e banners sem excluir seus registros do banco. As imagens substituídas são removidas do Storage depois que o novo registro é salvo.
