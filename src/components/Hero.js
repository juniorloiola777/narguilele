import { icon } from './icons.js';
import { CONFIG } from '../config.js';
import { waLink } from '../services/whatsapp.js';
import { getProducts, getCategories } from '../store/catalog.js';
import { getBanners } from '../store/banners.js';
import { heroIntro, prefersReducedMotion } from '../utils/animations.js';
import { esc, safeUrl } from '../utils/sanitize.js';

const AUTOPLAY_MS = 7000;

function customImage(i, alt) {
  const src = safeUrl(CONFIG.home.heroImages?.[i]);
  return src ? `<img class="hero-photo" src="${esc(src)}" alt="${esc(alt)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />` : '';
}

function slides() {
  const total = getProducts().length;
  const cats = getCategories().length;
  const defaults = [
    {
      label: 'A marca',
      eyebrow: 'Loja · Lounge · Delivery',
      title: 'Seu espaço.<br/>Sua escolha.',
      text: 'Alimentos, bebidas sem álcool e itens do dia a dia em um só lugar — com pedido direto pelo WhatsApp e entrega em Valparaíso e região.',
      actions: `<a class="btn btn-primary" href="#/produtos">Explorar produtos${icon('arrowRight', { size: 18 })}</a>
                <a class="btn btn-ghost" href="${waLink('Olá! Vim pelo site da Narguilé-Lê.')}" target="_blank" rel="noopener">${icon('message', { size: 18 })}Falar no WhatsApp</a>`,
      media:
        customImage(0, 'Narguilé-Lê Hookah Lounge') ||
        `<div class="hm hm--brand">
          <div class="hm-ring" aria-hidden="true"></div>
          <img class="hm-mascot" src="${CONFIG.brand.mascotLarge}" alt="Mascote da Narguilé-Lê" width="600" height="600" fetchpriority="high" decoding="async" />
          <p class="hm-tag"><span>Hookah Lounge</span><span>${esc(CONFIG.brand.city)}</span></p>
        </div>`,
    },
    {
      label: 'Produtos',
      eyebrow: 'Catálogo completo',
      title: 'Encontre o que precisa.',
      text: `${total} produtos em ${cats} categorias. Busque pelo nome ou pelo código e monte o seu pedido em poucos toques.`,
      actions: `<a class="btn btn-primary" href="#/produtos">Ver catálogo${icon('arrowRight', { size: 18 })}</a>
                <a class="btn btn-ghost" href="#/produtos?categoria=bebidas">Ver bebidas</a>`,
      media:
        customImage(1, 'Produtos Narguilé-Lê') ||
        `<div class="hm hm--product">
          <img class="hm-mascot" src="${CONFIG.brand.mascotLarge}" alt="Mascote da Narguilé-Lê" width="600" height="600" loading="lazy" decoding="async" />
          <dl class="hm-stats">
            <div><dt>Produtos</dt><dd>${total}</dd></div>
            <div><dt>Categorias</dt><dd>${cats}</dd></div>
          </dl>
        </div>`,
    },
    {
      label: 'Delivery e lounge',
      eyebrow: 'Delivery Narguilé-Lê',
      title: 'Monte o pedido.<br/>A gente leva.',
      text: 'Escolha no catálogo, revise no carrinho e finalize pelo WhatsApp. Atendimento em Valparaíso de Goiás e região.',
      actions: `<a class="btn btn-primary" href="#/delivery">Como funciona${icon('arrowRight', { size: 18 })}</a>
                <a class="btn btn-ghost" href="#/lounge">Conhecer o lounge</a>`,
      media:
        customImage(2, 'Fachada da Narguilé-Lê') ||
        `<div class="hm hm--photo">
          <img src="${CONFIG.lounge.fallbackPhoto}" alt="Letreiro iluminado da fachada Narguilé-Lê Hookah Lounge" width="742" height="266" loading="lazy" decoding="async" />
          <p class="hm-caption">${icon('mapPin', { size: 16 })}${esc(CONFIG.brand.city)} – ${esc(CONFIG.brand.state)}</p>
        </div>`,
    },
  ];
  return getBanners().map((banner) => {
    const base = defaults[Number(banner.id) - 1] || {
      label: 'Destaque', eyebrow: 'Narguilé-Lê', title: 'Novidade na loja', text: '',
      actions: `<a class="btn btn-primary" href="#/produtos">Ver catálogo${icon('arrowRight', { size: 18 })}</a>`,
      media: '',
    };
    const image = safeUrl(banner.image_url);
    return {
      ...base,
      title: banner.title ? esc(banner.title) : base.title,
      text: banner.description ? esc(banner.description) : base.text,
      imageUrl: image,
    };
  });
}

export function Hero() {
  const s = slides();
  if (!s.length) return '';
  return `
  <section class="hero" aria-roledescription="carrossel" aria-label="Destaques Narguilé-Lê">
    <div class="hero-viewport">
      ${s
        .map(
          (sl, i) => `
        <div class="hero-slide${i === 0 ? ' is-active' : ''}${sl.imageUrl ? ' hero-slide--photo' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${s.length}: ${sl.label}" ${i === 0 ? '' : 'aria-hidden="true" inert'}>
          ${sl.imageUrl ? `<img class="hero-backdrop" src="${esc(sl.imageUrl)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />` : ''}
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="hero-eyebrow eyebrow">${sl.eyebrow}</p>
              ${i === 0 ? `<h1 class="hero-title">${sl.title}</h1>` : `<h2 class="hero-title">${sl.title}</h2>`}
              <p class="hero-text">${sl.text}</p>
              <div class="hero-actions">${sl.actions}</div>
            </div>
            ${sl.imageUrl ? '' : `<div class="hero-media">${sl.media}</div>`}
          </div>
        </div>`
        )
        .join('')}
    </div>
    <div class="container hero-controls">
      <div class="hero-dots" role="tablist" aria-label="Escolher destaque">
        ${s
          .map(
            (sl, i) => `<button type="button" role="tab" class="hero-dot${i === 0 ? ' is-active' : ''}" data-go="${i}" aria-selected="${i === 0}" aria-label="${sl.label}">
              <span class="hero-dot-num">0${i + 1}</span><span class="hero-dot-bar"><span></span></span>
            </button>`
          )
          .join('')}
      </div>
      <div class="hero-arrows">
        <button type="button" class="icon-btn icon-btn--line" data-hero-toggle aria-label="Pausar destaques">${icon('pause', { size: 16 })}</button>
        <button type="button" class="icon-btn icon-btn--line" data-hero-prev aria-label="Destaque anterior">${icon('chevronLeft')}</button>
        <button type="button" class="icon-btn icon-btn--line" data-hero-next aria-label="Próximo destaque">${icon('chevronRight')}</button>
      </div>
    </div>
  </section>`;
}

export function initHero(root) {
  const hero = root.querySelector('.hero');
  if (!hero) return () => {};
  const slidesEls = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('.hero-dot')];
  const toggle = hero.querySelector('[data-hero-toggle]');
  let current = 0;
  let timer = null;
  let paused = prefersReducedMotion();
  let stoppedByUser = paused;

  const go = (i, { intro = true } = {}) => {
    const next = (i + slidesEls.length) % slidesEls.length;
    if (next === current) return;
    slidesEls[current].classList.remove('is-active');
    slidesEls[current].setAttribute('aria-hidden', 'true');
    slidesEls[current].setAttribute('inert', '');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');
    current = next;
    slidesEls[current].classList.add('is-active');
    slidesEls[current].removeAttribute('aria-hidden');
    slidesEls[current].removeAttribute('inert');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
    if (intro) heroIntro(slidesEls[current]);
    restart();
  };

  const restart = () => {
    clearTimeout(timer);
    hero.style.setProperty('--hero-ms', `${AUTOPLAY_MS}ms`);
    hero.classList.remove('is-running');
    void hero.offsetWidth;
    if (!paused && !stoppedByUser) {
      hero.classList.add('is-running');
      timer = setTimeout(() => go(current + 1), AUTOPLAY_MS);
    }
  };

  const setStopped = (v) => {
    stoppedByUser = v;
    toggle.innerHTML = v ? icon('play', { size: 16 }) : icon('pause', { size: 16 });
    toggle.setAttribute('aria-label', v ? 'Retomar destaques' : 'Pausar destaques');
    restart();
  };

  hero.querySelector('[data-hero-next]').addEventListener('click', () => {
    setStopped(true);
    go(current + 1);
  });
  hero.querySelector('[data-hero-prev]').addEventListener('click', () => {
    setStopped(true);
    go(current - 1);
  });
  dots.forEach((d) =>
    d.addEventListener('click', () => {
      setStopped(true);
      go(Number(d.dataset.go));
    })
  );
  toggle.addEventListener('click', () => setStopped(!stoppedByUser));

  hero.addEventListener('mouseenter', () => {
    paused = true;
    restart();
  });
  hero.addEventListener('mouseleave', () => {
    paused = prefersReducedMotion();
    restart();
  });
  hero.addEventListener('focusin', () => {
    paused = true;
    restart();
  });
  hero.addEventListener('focusout', (e) => {
    if (!hero.contains(e.relatedTarget)) {
      paused = prefersReducedMotion();
      restart();
    }
  });

  let x0 = null;
  hero.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  hero.addEventListener(
    'touchend',
    (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) {
        setStopped(true);
        go(current + (dx < 0 ? 1 : -1));
      }
      x0 = null;
    },
    { passive: true }
  );

  const onVis = () => {
    if (document.hidden) clearTimeout(timer);
    else restart();
  };
  document.addEventListener('visibilitychange', onVis);

  if (stoppedByUser) setStopped(true);
  heroIntro(slidesEls[0]);
  restart();
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVis);
  };
}

export function Benefits() {
  const items = [
    ['grid', 'Catálogo completo', `${getProducts().length} produtos cadastrados`],
    ['search', 'Busca rápida', 'Encontre pelo nome ou código'],
    ['bookmark', 'Carrinho salvo', 'Continue sem perder itens'],
    ['message', 'WhatsApp', 'Finalize direto com a loja'],
  ];
  return `
  <section class="benefits" aria-label="Vantagens da loja">
    <ul class="container benefits-list" data-reveal-group>
      ${items
        .map(
          ([ic, t, s]) => `<li class="benefit">
            <span class="benefit-ico">${icon(ic, { size: 20 })}</span>
            <span><strong>${t}</strong><span>${s}</span></span>
          </li>`
        )
        .join('')}
    </ul>
  </section>`;
}

