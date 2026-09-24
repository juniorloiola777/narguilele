import { ASSETS } from './data/assets.js';
// Configuração central da loja. Edite aqui — não espalhe dados pelo código.

const env = (import.meta && import.meta.env) || {};

export const CONFIG = {
  brand: {
    name: 'Narguilé-Lê',
    fullName: 'Narguilé-Lê Hookah Lounge',
    city: 'Valparaíso de Goiás',
    state: 'GO',
    mascot: ASSETS.mascot,
    mascotLarge: ASSETS.mascot,
  },

  contact: {
    // Número do WhatsApp no formato internacional, só dígitos (55 + DDD + número).
    whatsapp: '556130250654',
    whatsappLabel: '(61) 3025-0654',
    // Preencha quando tiver os dados reais. Campos vazios não aparecem no site.
    instagram: '', // ex.: 'https://instagram.com/seu_perfil'
    instagramHandle: '', // ex.: '@seu_perfil'
    address: 'Valparaíso de Goiás – GO',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Narguil%C3%A9-L%C3%AA+Hookah+Lounge+Valpara%C3%ADso+de+Goi%C3%A1s',
    hours: '', // ex.: 'Ter a Dom · 18h às 02h'
  },

  // Supabase — somente URL e chave PÚBLICA (anon/publishable). Nunca a service_role.
  supabase: {
    url: env.VITE_SUPABASE_URL || 'https://wpyzjukssdnoxpvrfmti.supabase.co',
    anonKey: env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BwWltgSCyPETg1IFCTrFXQ_l0rvPv3u',
    table: 'products',
    timeoutMs: 6000,
  },

  catalog: {
    pageSize: 24,
    // Preços iguais ou abaixo deste valor são tratados como "sob consulta" na interface.
    // (Os dados originais não são alterados.)
    consultPriceMax: 0.01,
    // Imagens locais: /public/assets/products/<slug>.<ext>
    imageExt: 'webp',
    // Liste aqui os slugs que JÁ têm foto em /public/assets/products/.
    // Evita centenas de requisições 404 para produtos ainda sem imagem.
    // Exemplo: ['abafador-wire-882', 'narguile-dubai-991']
    localImages: [],
  },

  // Ordem de exibição das categorias (nomes reais do catálogo).
  categoryOrder: ['Narguilés', 'Essências', 'Carvão', 'Acessórios', 'Tabacaria', 'Bebidas', 'Sessões', 'Combos', 'Outros'],

  // Seleções configuráveis da home (ids reais do catálogo).
  // O catálogo não tem campo de "lançamento", então esta vitrine é uma seleção editável.
  home: {
    // Fotos reais para os 3 slides do hero (opcional). Vazio = composição padrão da marca.
    // Ex.: ['/assets/banners/hero-1.webp', '/assets/banners/hero-2.webp', '']
    heroImages: ['', '', ''],
    selection: {
      eyebrow: 'Seleção da casa',
      title: 'Escolhidos para a sua sessão',
      ids: ['1002', '843', '1025', '991', '871', '775', '913', '882'],
    },
    featuredTabs: ['Narguilés', 'Essências', 'Carvão', 'Acessórios', 'Bebidas'],
    recommendations: {
      title: 'Complete o seu pedido',
      categories: ['Carvão', 'Acessórios', 'Bebidas', 'Tabacaria'],
    },
  },

  lounge: {
    // Fotos reais do ambiente (a 1ª vira a imagem principal; as 3 seguintes, galeria).
    // Ex.: ['/assets/lounge/ambiente-1.webp', '/assets/lounge/ambiente-2.webp']
    photos: [],
    fallbackPhoto: ASSETS.facade,
  },

  storageKeys: {
    cart: 'narguilele:cart:v1',
  },
};

export default CONFIG;
