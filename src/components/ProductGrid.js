import { ProductCard } from './ProductCard.js';
import { icon } from './icons.js';
import { esc } from '../utils/sanitize.js';

export function ProductGrid(products, { cols = 4, cls = '', reveal = true } = {}) {
  return `<div class="product-grid cols-${cols} ${cls}" ${reveal ? 'data-reveal-group' : ''}>
    ${products.map((p) => ProductCard(p)).join('')}
  </div>`;
}

export function SectionHead({ eyebrow = '', title, link = '', linkLabel = 'Ver todos', id = '' }) {
  return `<div class="section-head" data-reveal>
    <div>
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h2 class="section-title" ${id ? `id="${id}"` : ''}>${esc(title)}</h2>
    </div>
    ${link ? `<a class="link-arrow" href="${link}">${esc(linkLabel)}${icon('arrowRight', { size: 16 })}</a>` : ''}
  </div>`;
}

export function ProductRail(products, { id }) {
  return `<div class="rail" id="${id}">
    <div class="rail-track" tabindex="0" aria-label="Lista de produtos (role para ver mais)">
      ${products.map((p) => `<div class="rail-item">${ProductCard(p)}</div>`).join('')}
    </div>
    <div class="rail-nav">
      <button type="button" class="icon-btn icon-btn--line" data-rail-prev aria-label="Produtos anteriores">${icon('chevronLeft')}</button>
      <button type="button" class="icon-btn icon-btn--line" data-rail-next aria-label="Próximos produtos">${icon('chevronRight')}</button>
    </div>
  </div>`;
}

export function initRail(root) {
  const track = root?.querySelector('.rail-track');
  if (!track) return;
  const step = () => track.clientWidth * 0.85;
  const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  root.querySelector('[data-rail-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: smooth }));
  root.querySelector('[data-rail-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: smooth }));
  const update = () => {
    root.querySelector('[data-rail-prev]').disabled = track.scrollLeft < 4;
    root.querySelector('[data-rail-next]').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  track.addEventListener('scroll', update, { passive: true });
  update();
}
