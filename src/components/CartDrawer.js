import { icon } from './icons.js';
import { productImage } from './ProductCard.js';
import * as cart from '../store/cart.js';
import { esc } from '../utils/sanitize.js';
import { formatBRL } from '../utils/currency.js';
import { buildOrderMessage, waLink } from '../services/whatsapp.js';
import { trapFocus, lockScroll, unlockScroll, setBackgroundInert, hideToast } from '../utils/ui.js';

export function CartDrawer() {
  return `
  <div class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>
    <div class="drawer-backdrop" data-close-cart></div>
    <aside class="drawer-panel">
      <header class="drawer-head">
        <h2 id="cart-title" class="drawer-title">Seu pedido <span class="drawer-count" data-cart-title-count></span></h2>
        <button type="button" class="icon-btn" data-close-cart aria-label="Fechar carrinho">${icon('x', { size: 22 })}</button>
      </header>
      <div class="drawer-body" data-cart-body></div>
      <footer class="drawer-foot" data-cart-foot></footer>
    </aside>
  </div>`;
}

function lineHTML(l) {
  const p = l.product;
  return `
  <li class="cl" data-line="${esc(p.id)}">
    <a class="cl-thumb" href="#/produto/${encodeURIComponent(p.slug)}" tabindex="-1" aria-hidden="true">${productImage(p, { size: 'thumb' })}</a>
    <div class="cl-main">
      <a class="cl-name" href="#/produto/${encodeURIComponent(p.slug)}">${esc(p.name)}</a>
      <p class="cl-meta">Cód. ${esc(p.codigo)} · ${l.consult ? 'Preço sob consulta' : `${formatBRL(p.price)} un.`}</p>
      <div class="cl-row">
        <div class="qty" role="group" aria-label="Quantidade de ${esc(p.name)}">
          <button type="button" class="qty-btn" data-dec="${esc(p.id)}" aria-label="Diminuir quantidade">${icon('minus', { size: 16 })}</button>
          <span class="qty-val" aria-live="polite">${l.qty}</span>
          <button type="button" class="qty-btn" data-inc="${esc(p.id)}" aria-label="Aumentar quantidade">${icon('plus', { size: 16 })}</button>
        </div>
        <p class="cl-sub">${l.consult ? 'A confirmar' : formatBRL(l.subtotal)}</p>
      </div>
    </div>
    <button type="button" class="cl-remove" data-remove="${esc(p.id)}" aria-label="Remover ${esc(p.name)}">${icon('trash', { size: 17 })}</button>
  </li>`;
}

export function initCartDrawer() {
  const root = document.getElementById('cart-drawer');
  const body = root.querySelector('[data-cart-body]');
  const foot = root.querySelector('[data-cart-foot]');
  const titleCount = root.querySelector('[data-cart-title-count]');
  let lastFocus = null;

  const render = () => {
    const lines = cart.lines();
    const n = cart.count();
    titleCount.textContent = n ? `(${n})` : '';
    if (!lines.length) {
      body.innerHTML = `<div class="cart-empty">
        ${icon('bag', { size: 36, stroke: 1.4 })}
        <p class="cart-empty-title">Seu carrinho está vazio</p>
        <p>Adicione produtos do catálogo e finalize o pedido pelo WhatsApp.</p>
        <a class="btn btn-primary" href="#/produtos" data-close-cart>Explorar produtos</a>
      </div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = `<ul class="cart-lines">${lines.map(lineHTML).join('')}</ul>`;
    const total = cart.total();
    foot.innerHTML = `
      <div class="cart-total"><span>Total estimado</span><strong>${formatBRL(total)}</strong></div>
      <p class="cart-note">${cart.hasConsult() ? 'Itens sob consulta têm o valor confirmado no atendimento. ' : ''}Disponibilidade e taxa de entrega são confirmadas pelo WhatsApp.</p>
      <a class="btn btn-whats btn-block btn-lg" data-checkout href="${waLink(buildOrderMessage(lines, total))}" target="_blank" rel="noopener">
        ${icon('message', { size: 20 })}Finalizar pelo WhatsApp</a>
      <div class="cart-secondary">
        <button type="button" class="link-btn" data-close-cart>Continuar comprando</button>
        <button type="button" class="link-btn link-btn--muted" data-clear-cart>Esvaziar carrinho</button>
      </div>`;
  };

  const open = () => {
    if (!root.hidden) return;
    lastFocus = document.activeElement;
    hideToast();
    render();
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add('is-open'));
    lockScroll();
    setBackgroundInert(true);
    setTimeout(() => root.querySelector('.drawer-head [data-close-cart]').focus(), 40);
  };
  const close = ({ restore = true } = {}) => {
    if (root.hidden) return;
    root.classList.remove('is-open');
    unlockScroll();
    setBackgroundInert(false);
    setTimeout(() => (root.hidden = true), 340);
    if (restore && lastFocus?.focus) lastFocus.focus();
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-cart]')) {
      e.preventDefault();
      open();
    }
  });

  root.addEventListener('click', (e) => {
    const t = e.target;
    const inc = t.closest('[data-inc]');
    const dec = t.closest('[data-dec]');
    const rem = t.closest('[data-remove]');
    if (inc) {
      const l = cart.lines().find((x) => x.product.id === inc.dataset.inc);
      if (l) cart.setQty(l.product.id, l.qty + 1);
      root.querySelector(`[data-inc="${CSS.escape(inc.dataset.inc)}"]`)?.focus();
    } else if (dec) {
      const l = cart.lines().find((x) => x.product.id === dec.dataset.dec);
      if (l) cart.setQty(l.product.id, l.qty - 1);
      (root.querySelector(`[data-dec="${CSS.escape(dec.dataset.dec)}"]`) || root.querySelector('.drawer-head [data-close-cart]'))?.focus();
    } else if (rem) {
      cart.remove(rem.dataset.remove);
      root.querySelector('.drawer-head [data-close-cart]').focus();
    } else if (t.closest('[data-clear-cart]')) {
      cart.clear();
      root.querySelector('.drawer-head [data-close-cart]').focus();
    } else if (t.closest('[data-close-cart]')) {
      close({ restore: !t.closest('a') });
    } else if (t.closest('a:not([data-checkout])')) {
      close({ restore: false });
    }
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    trapFocus(root.querySelector('.drawer-panel'), e);
  });

  cart.subscribe(() => {
    if (!root.hidden) render();
  });

  return { open, close, render };
}
