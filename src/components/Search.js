import { icon } from './icons.js';
import { productImage } from './ProductCard.js';
import { search, getCategories } from '../store/catalog.js';
import { esc } from '../utils/sanitize.js';
import { priceText } from '../utils/currency.js';
import { trapFocus, lockScroll, unlockScroll, setBackgroundInert } from '../utils/ui.js';

const LIMIT = 8;

export function SearchOverlay() {
  return `
  <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar produtos" hidden>
    <div class="so-backdrop" data-close-search></div>
    <div class="so-panel">
      <div class="container so-inner">
        <form class="so-form" role="search" action="#/produtos">
          <label class="visually-hidden" for="so-input">Buscar por nome, código ou categoria</label>
          ${icon('search', { size: 22, cls: 'so-ico' })}
          <input id="so-input" class="so-input" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search"
            placeholder="Buscar por nome, código ou categoria" aria-controls="so-results" aria-describedby="so-status" />
          <button type="button" class="so-clear" data-clear-search aria-label="Limpar busca" hidden>${icon('x', { size: 18 })}</button>
          <button type="button" class="so-close" data-close-search>Fechar</button>
        </form>
        <p class="visually-hidden" id="so-status" aria-live="polite"></p>
        <div class="so-body" id="so-results"></div>
      </div>
    </div>
  </div>`;
}

function emptyState() {
  return `
  <p class="so-label">Categorias</p>
  <ul class="chip-row">
    ${getCategories()
      .map((c) => `<li><a class="chip" href="#/produtos?categoria=${c.slug}">${esc(c.name)} <span>${c.count}</span></a></li>`)
      .join('')}
  </ul>
  <p class="so-hint">Dica: digite o código do produto (ex.: <kbd>214</kbd>) para achar direto.</p>`;
}

function results(q, list, totalCount) {
  if (!list.length) {
    return `<div class="so-empty">
      <p class="so-empty-title">Nenhum produto encontrado para “${esc(q)}”.</p>
      <p>Tente outro termo ou navegue pelas categorias.</p>
    </div>${emptyState()}`;
  }
  return `
  <p class="so-label">${totalCount} ${totalCount === 1 ? 'resultado' : 'resultados'}</p>
  <ul class="so-list" role="list">
    ${list
      .map(
        (p) => `<li class="so-item">
        <a class="so-link" href="#/produto/${encodeURIComponent(p.slug)}">
          <span class="so-thumb">${productImage(p, { size: 'thumb' })}</span>
          <span class="so-meta">
            <span class="so-name">${esc(p.name)}</span>
            <span class="so-sub">Cód. ${esc(p.codigo)} · ${esc(p.category)}</span>
          </span>
          <span class="so-price">${priceText(p)}</span>
        </a>
        <button type="button" class="icon-btn icon-btn--line so-add" data-add="${esc(p.id)}" aria-label="Adicionar ${esc(p.name)} ao carrinho">${icon('plus', { size: 18 })}</button>
      </li>`
      )
      .join('')}
  </ul>
  ${totalCount > list.length ? `<a class="btn btn-ghost btn-block so-all" href="#/produtos?q=${encodeURIComponent(q)}">Ver todos os ${totalCount} resultados${icon('arrowRight', { size: 18 })}</a>` : ''}`;
}

export function initSearch() {
  const root = document.getElementById('search-overlay');
  const input = root.querySelector('#so-input');
  const body = root.querySelector('#so-results');
  const status = root.querySelector('#so-status');
  const clearBtn = root.querySelector('[data-clear-search]');
  let lastFocus = null;
  let t;

  const render = () => {
    const q = input.value.trim();
    clearBtn.hidden = !q;
    if (!q) {
      body.innerHTML = emptyState();
      status.textContent = '';
      return;
    }
    const all = search(q);
    body.innerHTML = results(q, all.slice(0, LIMIT), all.length);
    status.textContent = `${all.length} resultados`;
  };

  const open = () => {
    if (!root.hidden) return;
    lastFocus = document.activeElement;
    root.hidden = false;
    render();
    requestAnimationFrame(() => root.classList.add('is-open'));
    lockScroll();
    setBackgroundInert(true);
    setTimeout(() => input.focus(), 30);
  };
  const close = ({ restore = true } = {}) => {
    if (root.hidden) return;
    root.classList.remove('is-open');
    unlockScroll();
    setBackgroundInert(false);
    setTimeout(() => (root.hidden = true), 260);
    if (restore && lastFocus?.focus) lastFocus.focus();
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-search]')) {
      e.preventDefault();
      open();
    }
  });
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      open();
    }
  });

  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(render, 90);
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    render();
    input.focus();
  });
  root.querySelector('.so-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    close({ restore: false });
    location.hash = q ? `#/produtos?q=${encodeURIComponent(q)}` : '#/produtos';
  });
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-search]')) close();
    else if (e.target.closest('a')) close({ restore: false });
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const links = [...root.querySelectorAll('.so-link, .so-all')];
      if (!links.length) return;
      e.preventDefault();
      const i = links.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? (i < 0 ? 0 : Math.min(i + 1, links.length - 1)) : i <= 0 ? -1 : i - 1;
      (next < 0 ? input : links[next]).focus();
      return;
    }
    trapFocus(root.querySelector('.so-panel'), e);
  });

  return { open, close };
}
