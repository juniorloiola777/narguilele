import { icon, categoryArt } from './icons.js';
import { CONFIG } from '../config.js';
import { getCategories } from '../store/catalog.js';
import { waLink } from '../services/whatsapp.js';

const count = (name) => getCategories().find((c) => c.name === name)?.count || 0;

/** Dupla de banners editoriais entre seções de produto. */
export function PromoDuo() {
  return `
  <section class="section section--tight promo-duo" aria-label="Destaques de categoria">
    <div class="container duo-grid">
      <a class="promo promo--light" href="#/produtos?categoria=bebidas" data-reveal>
        <div class="promo-copy">
          <p class="eyebrow">Bebidas sem álcool</p>
          <h3 class="promo-title">Opções para refrescar.</h3>
          <p class="promo-text">${count('Bebidas')} itens disponíveis no catálogo.</p>
          <span class="link-arrow">Ver bebidas${icon('arrowRight', { size: 16 })}</span>
        </div>
        <div class="promo-art">${categoryArt('Bebidas', 'promo-svg')}</div>
      </a>
      <a class="promo promo--red" href="#/produtos?categoria=outros" data-reveal>
        <div class="promo-copy">
          <p class="eyebrow eyebrow--light">Outros itens</p>
          <h3 class="promo-title">Veja mais opções.</h3>
          <p class="promo-text">${count('Outros')} itens variados disponíveis.</p>
          <span class="link-arrow">Ver itens${icon('arrowRight', { size: 16 })}</span>
        </div>
        <div class="promo-art">${categoryArt('Outros', 'promo-svg')}</div>
      </a>
    </div>
  </section>`;
}

/** Banner institucional em azul, com o mascote. */
export function BrandBanner() {
  return `
  <section class="brand-banner" aria-labelledby="brand-banner-title">
    <div class="container brand-banner-grid">
      <div class="bb-mascot" data-reveal>
        <img src="${CONFIG.brand.mascotLarge}" alt="Mascote da Narguilé-Lê" width="600" height="600" loading="lazy" decoding="async" />
      </div>
      <div class="bb-copy" data-reveal>
        <p class="eyebrow eyebrow--light">Narguilé-Lê Hookah Lounge</p>
        <h2 class="bb-title" id="brand-banner-title">Um lugar para encontrar amigos.<br/>E fazer seu pedido.</h2>
        <p class="bb-text">Loja, lounge e delivery com a mesma identidade: atendimento próximo e catálogo organizado.</p>
        <div class="bb-actions">
          <a class="btn btn-white" href="#/produtos">Ver o catálogo${icon('arrowRight', { size: 18 })}</a>
          <a class="btn btn-outline-light" href="${waLink('Olá! Quero saber mais sobre a Narguilé-Lê.')}" target="_blank" rel="noopener">${icon('message', { size: 18 })}Falar com a loja</a>
        </div>
      </div>
    </div>
  </section>`;
}
