import { CONFIG } from '../config.js';

/**
 * Marca: [MASCOTE] NAR GUILE- LÊ / HOOKAH LOUNGE
 * Cores obrigatórias: NAR vermelho · GUILE- azul · LÊ vermelho · HOOKAH LOUNGE azul.
 */
export function brandMark({ variant = 'default', tag = 'a', href = '#/' } = {}) {
  const attrs = tag === 'a' ? `href="${href}" aria-label="${CONFIG.brand.fullName} — página inicial"` : '';
  return `
  <${tag} class="brand brand--${variant}" ${attrs}>
    <span class="brand-mascot"><img src="${CONFIG.brand.mascot}" alt="" width="48" height="48" decoding="async" /></span>
    <span class="brand-type" aria-hidden="true">
      <span class="brand-word"><span class="bw-red">NAR</span><span class="bw-blue">GUILE-</span><span class="bw-red">LÊ</span></span>
      <span class="brand-sub">HOOKAH LOUNGE</span>
    </span>
  </${tag}>`;
}
