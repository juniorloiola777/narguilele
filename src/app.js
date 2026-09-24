import { PromoBar } from './components/PromoBar.js';
import { Header, MobileMenu, initHeader, setActiveNav } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { SearchOverlay, initSearch } from './components/Search.js';
import { CartDrawer, initCartDrawer } from './components/CartDrawer.js';
import { initImageFallback } from './components/ProductCard.js';
import { icon } from './components/icons.js';
import { HomePage, initHomePage } from './pages/HomePage.js';
import { CatalogPage, initCatalogPage } from './pages/CatalogPage.js';
import { ProductPage, initProductPage, NotFound } from './pages/ProductPage.js';
import { getById } from './store/catalog.js';
import * as cart from './store/cart.js';
import { reveal, bump, prefersReducedMotion } from './utils/animations.js';
import { toast } from './utils/ui.js';
import { esc } from './utils/sanitize.js';
import { CONFIG } from './config.js';

const HOME_SECTIONS = { lounge: 'lounge', delivery: 'delivery', contato: 'contato' };
const BASE_TITLE = 'Narguilé-Lê Hookah Lounge';

let cleanup = null;
let currentView = '';

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { parts, params: new URLSearchParams(query) };
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.getElementById('site-header');
  const y = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) + 1;
  window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function setMeta(title, description) {
  document.title = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — Narguilés, essências e delivery em Valparaíso de Goiás`;
  if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
}

function route() {
  const main = document.getElementById('main');
  const { parts, params } = parseHash();
  const [first, second] = parts;

  // Seções da home (#/lounge, #/delivery, #/contato)
  if (!first || HOME_SECTIONS[first]) {
    if (currentView !== 'home') {
      cleanup?.();
      main.innerHTML = HomePage();
      cleanup = initHomePage(main);
      currentView = 'home';
      setMeta('', 'Loja, lounge e delivery Narguilé-Lê em Valparaíso de Goiás. Narguilés, essências, carvão, acessórios e bebidas com pedido pelo WhatsApp.');
      reveal(main);
      if (!first) window.scrollTo(0, 0);
    }
    setActiveNav(first || 'inicio');
    if (first) requestAnimationFrame(() => scrollToSection(HOME_SECTIONS[first]));
    else if (currentView === 'home' && window.scrollY > 0 && !first) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    return;
  }

  cleanup?.();
  cleanup = null;

  if (first === 'produtos') {
    main.innerHTML = CatalogPage(params);
    initCatalogPage(main, params);
    currentView = `produtos?${params}`;
    setActiveNav(params.get('categoria') ? 'categorias' : 'produtos');
    setMeta('Produtos', `Catálogo completo da Narguilé-Lê: narguilés, essências, carvão, acessórios, bebidas e mais.`);
  } else if (first === 'produto' && second) {
    const slug = decodeURIComponent(second);
    main.innerHTML = ProductPage(slug);
    initProductPage(main, onAdded);
    currentView = `produto/${slug}`;
    setActiveNav('produtos');
    const name = main.querySelector('.pp-title')?.textContent;
    setMeta(name || 'Produto', name ? `${name} na Narguilé-Lê. Peça pelo WhatsApp com delivery em Valparaíso e região.` : '');
  } else {
    main.innerHTML = NotFound();
    currentView = '404';
    setActiveNav('');
    setMeta('Página não encontrada');
  }
  window.scrollTo(0, 0);
  reveal(main);
}

function updateCartBadge(animate = false) {
  const n = cart.count();
  document.querySelectorAll('[data-cart-count]').forEach((b) => {
    b.textContent = n > 99 ? '99+' : String(n);
    b.hidden = n === 0;
    if (animate) bump(b);
  });
  document.querySelectorAll('[data-open-cart]').forEach((b) => b.setAttribute('aria-label', `Abrir carrinho, ${n} ${n === 1 ? 'item' : 'itens'}`));
}

function onAdded(btn, id, qty = 1) {
  const p = getById(id);
  if (btn?.classList.contains('btn-add') || btn?.classList.contains('so-add')) {
    btn.classList.add('is-added');
    const txt = btn.querySelector('.btn-add-txt');
    const ico = btn.querySelector('.btn-add-ico');
    const prevIco = ico?.innerHTML;
    if (txt) txt.textContent = 'Adicionado';
    if (ico) ico.innerHTML = icon('check', { size: 16, stroke: 2 });
    setTimeout(() => {
      btn.classList.remove('is-added');
      if (txt) txt.textContent = 'Adicionar';
      if (ico && prevIco) ico.innerHTML = prevIco;
    }, 1400);
  }
  if (p) {
    toast(`<span class="toast-ico">${icon('check', { size: 16, stroke: 2.2 })}</span>
      <span class="toast-msg"><strong>${qty > 1 ? `${qty}x ` : ''}${esc(p.name)}</strong><small>Adicionado ao carrinho</small></span>
      <button type="button" class="toast-link" data-open-cart>Ver carrinho</button>`);
  }
}

export function mountApp(root) {
  root.innerHTML = `
    <a class="skip-link" href="#main" data-inert-target>Pular para o conteúdo</a>
    ${PromoBar()}
    ${Header()}
    <main id="main" tabindex="-1" data-inert-target></main>
    ${Footer()}
    ${MobileMenu()}
    ${SearchOverlay()}
    ${CartDrawer()}
  `;

  initHeader();
  initSearch();
  initCartDrawer();
  initImageFallback();

  // Adicionar ao carrinho (delegado para cards, busca etc.)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    cart.add(btn.dataset.add, 1);
    onAdded(btn, btn.dataset.add, 1);
  });

  // Skip link sem quebrar o roteamento por hash
  root.querySelector('.skip-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('main').focus();
  });

  cart.subscribe((ch) => updateCartBadge(ch?.type === 'add'));
  updateCartBadge();

  window.addEventListener('hashchange', route);
  route();

  if (!CONFIG.contact.whatsapp) console.warn('[narguilele] Configure o WhatsApp em src/config.js');
}
