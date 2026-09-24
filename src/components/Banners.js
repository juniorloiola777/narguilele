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
      <a class="promo promo--light" href="#/produtos?categoria=essencias" data-reveal>
        <div class="promo-copy">
          <p class="eyebrow">Essências</p>
          <h3 class="promo-title">Sabores para cada sessão.</h3>
          <p class="promo-text">${count('Essências')} opções no catálogo, das clássicas às linhas premium.</p>
          <span class="link-arrow">Ver essências${icon('arrowRight', { size: 16 })}</span>
        </div>
        <div class="promo-art">${categoryArt('Essências', 'promo-svg')}</div>
      </a>
      <a class="promo promo--red" href="#/produtos?categoria=carvao" data-reveal>
        <div class="promo-copy">
          <p class="eyebrow eyebrow--light">Carvão</p>
          <h3 class="promo-title">Brasa pronta para acender.</h3>
          <p class="promo-text">${count('Carvão')} itens entre carvões de coco, batedores e acessórios.</p>
          <span class="link-arrow">Ver carvões${icon('arrowRight', { size: 16 })}</span>
        </div>
        <div class="promo-art">${categoryArt('Carvão', 'promo-svg')}</div>
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
        <h2 class="bb-title" id="brand-banner-title">Mais que uma tabacaria.<br/>Um ponto de encontro.</h2>
        <p class="bb-text">Loja, lounge e delivery com a mesma identidade: atendimento próximo, catálogo organizado e tudo o que a sua sessão precisa.</p>
        <div class="bb-actions">
          <a class="btn btn-white" href="#/produtos">Ver o catálogo${icon('arrowRight', { size: 18 })}</a>
          <a class="btn btn-outline-light" href="${waLink('Olá! Quero saber mais sobre a Narguilé-Lê.')}" target="_blank" rel="noopener">${icon('message', { size: 18 })}Falar com a loja</a>
        </div>
      </div>
    </div>
  </section>`;
}
