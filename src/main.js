import { loadProducts } from './services/products.js';
import { fetchActiveBanners } from './services/supabase.js';
import { setBanners } from './store/banners.js';
import { setProducts } from './store/catalog.js';
import { initCart } from './store/cart.js';
import { mountApp } from './app.js';
import { initMotion } from './utils/animations.js';

async function boot() {
  const root = document.getElementById('app');
  root.innerHTML = '<div class="boot" role="status" aria-live="polite"><span class="boot-bar"></span><span class="visually-hidden">Carregando catálogo…</span></div>';

  // Motion carrega em paralelo; se falhar, o site segue sem animações.
  const motion = initMotion();
  const [catalog, banners] = await Promise.all([loadProducts(),fetchActiveBanners().catch(error=>{console.warn('[narguilele] Banners indisponíveis',error);return [];})]);
  const { products, source } = catalog;
  setProducts(products, source);
  setBanners(banners);
  initCart();
  await motion;
  mountApp(root);
  document.documentElement.classList.add('is-ready');
}

boot().catch((err) => {
  console.error('[narguilele] Falha ao iniciar', err);
  const root = document.getElementById('app');
  if (root) root.innerHTML = '<p style="padding:40px;font-family:sans-serif">Não foi possível carregar o site. Recarregue a página.</p>';
});
