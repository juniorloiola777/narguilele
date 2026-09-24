import { icon } from './icons.js';

export function PromoBar() {
  return `
  <div class="topbar" data-inert-target role="region" aria-label="Avisos da loja">
    <div class="container topbar-inner">
      <ul class="topbar-list">
        <li>${icon('truck', { size: 14 })}<span>Delivery em Valparaíso e região</span></li>
        <li class="hide-sm">${icon('message', { size: 14 })}<span>Atendimento pelo WhatsApp</span></li>
        <li class="hide-md">${icon('grid', { size: 14 })}<span>Catálogo completo</span></li>
      </ul>
      <p class="topbar-age">Valparaíso de Goiás</p>
    </div>
  </div>`;
}
