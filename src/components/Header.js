import { icon, categoryArt } from './icons.js';
import { brandMark } from './Brand.js';
import { getCategories } from '../store/catalog.js';
import { waLink } from '../services/whatsapp.js';
import { esc } from '../utils/sanitize.js';
import { trapFocus, lockScroll, unlockScroll, setBackgroundInert } from '../utils/ui.js';

const NAV = [
  { key: 'inicio', label: 'Início', href: '#/' },
  { key: 'produtos', label: 'Produtos', href: '#/produtos' },
  { key: 'categorias', label: 'Categorias', href: '#/produtos', mega: true },
  { key: 'lounge', label: 'Lounge', href: '#/lounge' },
  { key: 'delivery', label: 'Delivery', href: '#/delivery' },
  { key: 'contato', label: 'Contato', href: '#/contato' },
];

function megaMenu() {
  const cats = getCategories();
  return `
  <div class="mega" id="mega-categorias" role="region" aria-label="Categorias">
    <div class="container mega-inner">
      <div class="mega-intro">
        <p class="eyebrow">Categorias</p>
        <p class="mega-title">Encontre pelo que você procura</p>
        <a class="link-arrow" href="#/produtos">Ver catálogo completo ${icon('arrowRight', { size: 16 })}</a>
      </div>
      <ul class="mega-list">
        ${cats
          .map(
            (c) => `<li><a href="#/produtos?categoria=${c.slug}" class="mega-link">
              <span class="mega-art">${categoryArt(c.name)}</span>
              <span><span class="mega-name">${esc(c.name)}</span><span class="mega-count">${c.count} ${c.count === 1 ? 'produto' : 'produtos'}</span></span>
            </a></li>`
          )
          .join('')}
      </ul>
    </div>
  </div>`;
}

export function Header() {
  return `
  <header class="site-header" id="site-header" data-inert-target>
    <div class="container header-inner">
      ${brandMark()}
      <nav class="main-nav" aria-label="Principal">
        <ul>
          ${NAV.map((n) =>
            n.mega
              ? `<li class="has-mega"><button type="button" class="nav-link" data-nav="${n.key}" aria-expanded="false" aria-controls="mega-categorias">${n.label}${icon('chevronDown', { size: 14, cls: 'nav-chev' })}</button></li>`
              : `<li><a class="nav-link" data-nav="${n.key}" href="${n.href}">${n.label}</a></li>`
          ).join('')}
        </ul>
      </nav>
      <div class="header-actions">
        <button type="button" class="search-trigger" data-open-search aria-label="Buscar produtos">
          ${icon('search', { size: 18 })}<span class="search-trigger-text">Buscar por nome ou código</span>
        </button>
        <button type="button" class="icon-btn cart-trigger" data-open-cart aria-label="Abrir carrinho, 0 itens">
          ${icon('bag', { size: 21 })}<span class="cart-count" data-cart-count hidden>0</span>
        </button>
        <button type="button" class="icon-btn menu-trigger" data-open-menu aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu">
          ${icon('menu', { size: 22 })}
        </button>
      </div>
    </div>
    ${megaMenu()}
  </header>`;
}

/** Menu móvel — renderizado fora do conteúdo que fica inerte quando ele abre. */
export function MobileMenu() {
  const cats = getCategories();
  return `
  <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <div class="mm-backdrop" data-close-menu></div>
    <div class="mm-panel">
      <div class="mm-head">
        ${brandMark({ variant: 'compact' })}
        <button type="button" class="icon-btn" data-close-menu aria-label="Fechar menu">${icon('x', { size: 22 })}</button>
      </div>
      <nav class="mm-nav" aria-label="Menu móvel">
        ${NAV.filter((n) => !n.mega)
          .map((n) => `<a href="${n.href}" data-nav="${n.key}">${n.label}${icon('chevronRight', { size: 18 })}</a>`)
          .join('')}
      </nav>
      <p class="mm-label">Categorias</p>
      <ul class="mm-cats">
        ${cats.map((c) => `<li><a href="#/produtos?categoria=${c.slug}"><span>${esc(c.name)}</span><span class="mm-count">${c.count}</span></a></li>`).join('')}
      </ul>
      <a class="btn btn-whats btn-block" href="${waLink()}" target="_blank" rel="noopener">${icon('message', { size: 18 })}Falar no WhatsApp</a>
      <p class="mm-age"><span class="age-badge">18+</span> Venda proibida para menores de 18 anos</p>
    </div>
  </div>`;
}

export function initHeader() {
  const header = document.getElementById('site-header');
  // --- estado ao rolar
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- mega menu de categorias
  const megaBtn = header.querySelector('.has-mega .nav-link');
  const mega = header.querySelector('.mega');
  let closeTimer;
  const setMega = (open) => {
    clearTimeout(closeTimer);
    header.classList.toggle('mega-open', open);
    megaBtn.setAttribute('aria-expanded', String(open));
  };
  megaBtn.addEventListener('click', () => setMega(megaBtn.getAttribute('aria-expanded') !== 'true'));
  const li = megaBtn.parentElement;
  const hoverable = matchMedia('(hover: hover)');
  [li, mega].forEach((el) => {
    el.addEventListener('mouseenter', () => hoverable.matches && setMega(true));
    el.addEventListener('mouseleave', () => {
      if (hoverable.matches) closeTimer = setTimeout(() => setMega(false), 160);
    });
  });
  mega.addEventListener('click', (e) => e.target.closest('a') && setMega(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('mega-open')) {
      setMega(false);
      megaBtn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) setMega(false);
  });

  // --- menu móvel
  const menu = document.getElementById('mobile-menu');
  const openBtn = header.querySelector('[data-open-menu]');
  const open = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    openBtn.setAttribute('aria-expanded', 'true');
    lockScroll();
    setBackgroundInert(true);
    menu.querySelector('.mm-panel [data-close-menu]').focus();
  };
  const close = (restore = true) => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    unlockScroll();
    setBackgroundInert(false);
    setTimeout(() => (menu.hidden = true), 320);
    if (restore) openBtn.focus();
  };
  openBtn.addEventListener('click', open);
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-menu]')) close();
    else if (e.target.closest('a')) close(false);
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    trapFocus(menu.querySelector('.mm-panel'), e);
  });
}

export function setActiveNav(key) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === key;
    a.classList.toggle('is-active', on);
    if (a.tagName === 'A') {
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  });
}
