// Ícones de interface: traçados da biblioteca Lucide (ISC License — https://lucide.dev),
// embutidos como SVG para não depender de runtime extra.
// Ilustrações de categoria e do hero: desenho próprio Narguilé-Lê, mesma linguagem monoline.

const PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
};

export function icon(name, { size = 20, stroke = 1.75, cls = '' } = {}) {
  const p = PATHS[name] || '';
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
}

const CAT = {
  'Narguilés': `<path d="M27 7h10l-2 6h-6z"/><ellipse cx="32" cy="15" rx="9" ry="1.8"/><path d="M30.5 17v8"/><path d="M33.5 17v8"/><ellipse class="acc" cx="32" cy="27" rx="4" ry="1.6"/><path d="M30.5 29v6h3v-6"/><path d="M30.5 35h-6c-5 0-8 5-8 12s-3 9-6 10"/><path d="M29 37h6c0 3 9 6 9 14a12 12 0 0 1-24 0c0-8 9-11 9-14z"/><path d="M22.5 50c3 1 6 1 9.5 0s6.5-1 9.5 0"/>`,
  'Essências': `<rect x="17" y="18" width="30" height="34" rx="2"/><path d="M17 26h30"/><path d="M22 12h20l5 6H17z"/><path class="acc" d="M32 32c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8z"/>`,
  'Carvão': `<path d="M14 38l9-4 9 4v10l-9 4-9-4z"/><path d="M14 38l9 4 9-4"/><path d="M23 42v10"/><path d="M32 38l9-4 9 4v10l-9 4-9-4"/><path d="M32 38l9 4 9-4"/><path d="M41 42v10"/><path d="M23 24l9-4 9 4v10"/><path d="M23 24l9 4 9-4"/><path d="M32 28v6"/><path class="acc" d="M30 14c0-3 2-4 2-7 2 2 4 4 4 7a3 3 0 0 1-6 0z"/>`,
  'Acessórios': `<rect x="14" y="22" width="36" height="30" rx="4"/><path d="M23 22v-5a9 9 0 0 1 18 0v5"/><path class="acc" d="M22 33h20"/>`,
  'Tabacaria': `<path d="M12 42 44 16a4 4 0 0 1 6 5L18 47a4 4 0 0 1-6-5z"/><path class="acc" d="M36 22.5l5 6.5"/><path d="M47 13c1-3 4-4 4-7"/><path d="M52 16c2-2 5-2 6-5"/>`,
  'Bebidas': `<path d="M22 8h6v8c4 2 5 5 5 9v25a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3V25c0-4 1-7 5-9z"/><path class="acc" d="M17 32h16"/><path d="M38 30h14l-2 20a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z"/><path d="M39 37h12"/>`,
  'Sessões': `<circle cx="32" cy="36" r="16"/><path d="M32 26v10l7 4"/><path class="acc" d="M26 14c0-3 3-3 3-6"/><path d="M33 14c0-3 3-3 3-6"/>`,
  'Combos': `<rect x="14" y="26" width="36" height="26" rx="1.5"/><path d="M12 20h40v6H12z"/><path class="acc" d="M32 20v32"/><path d="M32 20c-4-8-12-8-12-3s8 3 12 3c4 0 12 2 12-3s-8-5-12 3"/>`,
  'Outros': `<rect x="14" y="14" width="15" height="15" rx="1.5"/><rect x="35" y="14" width="15" height="15" rx="1.5"/><rect x="14" y="35" width="15" height="15" rx="1.5"/><circle class="acc" cx="42.5" cy="42.5" r="7.5"/>`,
};

export function categoryArt(category, cls = '') {
  const inner = CAT[category] || CAT['Outros'];
  return `<svg class="cat-art ${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

export function hookahArt(cls = '') {
  return `<svg class="hookah-art ${cls}" viewBox="0 0 240 480" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><g class="smoke" stroke-width="1.2"><path d="M112 30c-8-10 6-16-2-26"/><path d="M124 32c10-12-4-18 6-30"/><path d="M136 34c6-6 0-12 6-18"/></g><path class="acc-fill" d="M104 44h32l-2 5h-28z"/><path d="M100 49h40l-8 32h-24z"/><ellipse cx="120" cy="49" rx="20" ry="3.5"/><path d="M114 81h12v9h-12z"/><ellipse cx="120" cy="96" rx="50" ry="7"/><path d="M70 96c0 5 22 9 50 9s50-4 50-9"/><path d="M114 105v30h12v-30"/><ellipse class="acc" cx="120" cy="140" rx="11" ry="5"/><path d="M114 145v44h12v-44"/><ellipse cx="120" cy="193" rx="9" ry="4"/><path d="M115 197v50h10v-50"/><path d="M125 222h10"/><circle cx="140" cy="222" r="5"/><path d="M115 214H96"/><path d="M96 210v8"/><path d="M96 214c-38 0-58 54-52 128 4 52-8 86-26 104"/><path class="acc" d="M18 446l-8 10"/><path d="M14 441l10 10"/><rect x="106" y="247" width="28" height="9" rx="1"/><path d="M108 256h24c0 24 56 48 56 116 0 54-34 86-68 86s-68-32-68-86c0-68 56-92 56-116z"/><path d="M58 360c10 4 20 4 31 0s21-4 31 0 21 4 31 0 21-4 31 0" stroke-width="1.2"/><path d="M120 256v138" stroke-dasharray="3 5" stroke-width="1.1"/><path d="M72 436c14 12 30 18 48 18s34-6 48-18" stroke-width="1.1"/></svg>`;
}
