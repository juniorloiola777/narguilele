import { icon } from './icons.js';
import { brandMark } from './Brand.js';
import { CONFIG } from '../config.js';
import { waLink } from '../services/whatsapp.js';
import { getCategories } from '../store/catalog.js';
import { esc, safeUrl } from '../utils/sanitize.js';

/** Faixa de contato / redes sociais (antes do footer). */
export function ContactBand() {
  const c = CONFIG.contact;
  const ig = safeUrl(c.instagram);
  return `
  <section class="contact-band" id="contato" aria-labelledby="contato-title">
    <div class="container contact-grid">
      <div data-reveal>
        <p class="eyebrow">Contato</p>
        <h2 class="section-title" id="contato-title">Fale com a Narguilé-Lê</h2>
        <p class="contact-text">Dúvidas sobre produtos, disponibilidade, delivery ou o lounge? Respondemos pelo WhatsApp.</p>
      </div>
      <ul class="contact-list" data-reveal-group>
        <li><a href="${waLink('Olá! Vim pelo site da Narguilé-Lê.')}" target="_blank" rel="noopener">
          <span class="contact-ico">${icon('message', { size: 20 })}</span>
          <span><span class="contact-label">WhatsApp</span><span class="contact-value">${esc(c.whatsappLabel)}</span></span>
          ${icon('arrowUpRight', { size: 18, cls: 'contact-go' })}</a></li>
        <li><a href="${esc(safeUrl(c.mapsUrl))}" target="_blank" rel="noopener">
          <span class="contact-ico">${icon('mapPin', { size: 20 })}</span>
          <span><span class="contact-label">Localização</span><span class="contact-value">${esc(c.address)}</span></span>
          ${icon('arrowUpRight', { size: 18, cls: 'contact-go' })}</a></li>
        ${
          ig
            ? `<li><a href="${esc(ig)}" target="_blank" rel="noopener">
          <span class="contact-ico">${icon('instagram', { size: 20 })}</span>
          <span><span class="contact-label">Instagram</span><span class="contact-value">${esc(c.instagramHandle || 'Siga a Narguilé-Lê')}</span></span>
          ${icon('arrowUpRight', { size: 18, cls: 'contact-go' })}</a></li>`
            : ''
        }
        ${
          c.hours
            ? `<li><span class="contact-static"><span class="contact-ico">${icon('clock', { size: 20 })}</span>
          <span><span class="contact-label">Horário</span><span class="contact-value">${esc(c.hours)}</span></span></span></li>`
            : ''
        }
      </ul>
    </div>
  </section>`;
}

export function Footer() {
  const c = CONFIG.contact;
  const ig = safeUrl(c.instagram);
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer" data-inert-target>
    <div class="container footer-grid">
      <div class="footer-brand">
        ${brandMark({ variant: 'footer' })}
        <p>Loja, lounge e delivery em ${esc(CONFIG.brand.city)}. Consulte os itens disponíveis no catálogo.</p>
      </div>
      <nav class="footer-col" aria-label="Navegação do rodapé">
        <p class="footer-title">Navegação</p>
        <ul>
          <li><a href="#/">Início</a></li>
          <li><a href="#/produtos">Produtos</a></li>
          <li><a href="#/lounge">Lounge</a></li>
          <li><a href="#/delivery">Delivery</a></li>
          <li><a href="#/contato">Contato</a></li>
        </ul>
      </nav>
      <nav class="footer-col" aria-label="Categorias">
        <p class="footer-title">Categorias</p>
        <ul>${getCategories()
          .slice(0, 7)
          .map((cat) => `<li><a href="#/produtos?categoria=${cat.slug}">${esc(cat.name)}</a></li>`)
          .join('')}</ul>
      </nav>
      <div class="footer-col">
        <p class="footer-title">Atendimento</p>
        <ul class="footer-contact">
          <li><a href="${waLink()}" target="_blank" rel="noopener">${icon('message', { size: 16 })}WhatsApp ${esc(c.whatsappLabel)}</a></li>
          ${ig ? `<li><a href="${esc(ig)}" target="_blank" rel="noopener">${icon('instagram', { size: 16 })}Instagram</a></li>` : ''}
          <li><a href="${esc(safeUrl(c.mapsUrl))}" target="_blank" rel="noopener">${icon('mapPin', { size: 16 })}${esc(c.address)}</a></li>
          ${c.hours ? `<li><span>${icon('clock', { size: 16 })}${esc(c.hours)}</span></li>` : ''}
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <div class="container footer-legal-inner">
        <p class="footer-age">Atendimento em Valparaíso de Goiás e região.</p>
        <p>© ${year} ${esc(CONFIG.brand.fullName)}. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>`;
}
