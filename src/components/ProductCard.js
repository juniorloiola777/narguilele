import { icon, categoryArt } from './icons.js';
import { esc, safeUrl } from '../utils/sanitize.js';
import { priceText, isConsultPrice } from '../utils/currency.js';

export function productImage(p, { size = 'card', eager = false } = {}) {
  const src = safeUrl(p.image);
  if (src) {
    return `<img src="${esc(src)}" alt="${esc(p.name)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="600" height="600" data-fallback-cat="${esc(p.category)}" />`;
  }
  return placeholder(p.category, size);
}

export function placeholder(category, size = 'card') {
  return `<span class="ph ph--${size}" role="img" aria-label="Imagem em breve">
    ${categoryArt(category, 'ph-art')}
    ${size === 'thumb' ? '' : '<span class="ph-text">Imagem em breve</span>'}
  </span>`;
}

export function ProductCard(p, { eager = false } = {}) {
  const href = `#/produto/${encodeURIComponent(p.slug)}`;
  const consult = isConsultPrice(p.price);
  return `
  <article class="card" data-id="${esc(p.id)}">
    <a class="card-media" href="${href}" tabindex="-1" aria-hidden="true">${productImage(p, { eager })}</a>
    <div class="card-body">
      <p class="card-cat">${esc(p.category)}</p>
      <h3 class="card-title"><a href="${href}">${esc(p.name)}</a></h3>
      <p class="card-code">Cód. ${esc(p.codigo)}</p>
      <div class="card-foot">
        <p class="card-price${consult ? ' is-consult' : ''}">${priceText(p)}</p>
        <button type="button" class="btn-add" data-add="${esc(p.id)}" aria-label="Adicionar ${esc(p.name)} ao carrinho">
          <span class="btn-add-ico">${icon('plus', { size: 16, stroke: 2 })}</span><span class="btn-add-txt">Adicionar</span>
        </button>
      </div>
    </div>
  </article>`;
}

export function initImageFallback() {
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (img?.tagName === 'IMG' && img.dataset.fallbackCat !== undefined) {
        img.outerHTML = placeholder(img.dataset.fallbackCat, 'card');
      }
    },
    true
  );
}
