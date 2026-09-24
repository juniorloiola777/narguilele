import { icon } from './icons.js';
import { CONFIG } from '../config.js';
import { waLink } from '../services/whatsapp.js';
import { esc, safeUrl } from '../utils/sanitize.js';

export function LoungeSection() {
  const photos = (CONFIG.lounge?.photos || []).map(safeUrl).filter(Boolean);
  const hero = photos[0] || CONFIG.lounge.fallbackPhoto;
  return `
  <section class="section lounge" id="lounge" aria-labelledby="lounge-title">
    <div class="container lounge-grid">
      <figure class="lounge-media" data-reveal>
        <div class="lounge-frame${photos.length ? '' : ' lounge-frame--sign'}">
          <img class="lounge-img" src="${esc(hero)}" alt="Letreiro iluminado da fachada Narguilé-Lê Hookah Lounge" width="742" height="266" loading="lazy" decoding="async" />
        </div>
        <figcaption>${icon('mapPin', { size: 15 })}${esc(CONFIG.brand.city)} – ${esc(CONFIG.brand.state)}</figcaption>
      </figure>
      <div class="lounge-copy" data-reveal>
        <p class="lounge-kicker"><span class="visually-hidden">Narguilé-Lê Hookah Lounge</span><span aria-hidden="true"><span class="bw-red">NAR</span><span class="bw-blue">GUILE-</span><span class="bw-red">LÊ</span></span><span class="lounge-kicker-sub" aria-hidden="true">HOOKAH LOUNGE</span></p>
        <h2 class="section-title section-title--xl" id="lounge-title">Um lounge para desacelerar.</h2>
        <p class="lounge-text">Um ambiente para reunir os amigos e conhecer a loja — em ${esc(CONFIG.brand.city)}.</p>
        <dl class="lounge-facts">
          <div><dt>Local</dt><dd>${esc(CONFIG.contact.address)}</dd></div>
          ${CONFIG.contact.hours ? `<div><dt>Horário</dt><dd>${esc(CONFIG.contact.hours)}</dd></div>` : ''}
          <div><dt>Reservas</dt><dd>Pelo WhatsApp</dd></div>
        </dl>
        <div class="lounge-actions">
          <a class="btn btn-primary" href="${waLink('Olá! Quero conhecer o lounge da Narguilé-Lê.')}" target="_blank" rel="noopener">Conhecer o lounge${icon('arrowRight', { size: 18 })}</a>
        </div>
      </div>
    </div>
    ${
      photos.length > 1
        ? `<div class="container lounge-gallery" data-reveal-group>${photos
            .slice(1, 4)
            .map((src) => `<img src="${esc(src)}" alt="Ambiente do lounge Narguilé-Lê" loading="lazy" decoding="async" />`)
            .join('')}</div>`
        : ''
    }
  </section>`;
}

export function DeliverySection() {
  const steps = [
    ['Escolha', 'Navegue pelo catálogo ou busque pelo nome e código.'],
    ['Revise', 'Ajuste quantidades no carrinho. Ele fica salvo no seu aparelho.'],
    ['Envie', 'Finalize pelo WhatsApp com o pedido já escrito.'],
    ['Receba', 'A loja confirma disponibilidade, taxa e prazo de entrega.'],
  ];
  return `
  <section class="section delivery" id="delivery" aria-labelledby="delivery-title">
    <div class="container delivery-grid">
      <div class="delivery-intro" data-reveal>
        <p class="eyebrow">Delivery</p>
        <h2 class="section-title" id="delivery-title">Pediu pelo site, fechou no WhatsApp.</h2>
        <p class="delivery-text">Sem cadastro e sem pagamento online. Você monta o pedido e a equipe confirma tudo com você. Entregas em ${esc(CONFIG.brand.city)} e região.</p>
        <a class="btn btn-primary" href="#/produtos">Começar pedido${icon('arrowRight', { size: 18 })}</a>
      </div>
      <ol class="steps" data-reveal-group>
        ${steps
          .map(
            ([t, d], i) => `<li class="step">
            <span class="step-num">0${i + 1}</span>
            <h3 class="step-title">${t}</h3>
            <p class="step-text">${d}</p>
          </li>`
          )
          .join('')}
      </ol>
    </div>
  </section>`;
}
