import { CONFIG } from '../config.js';
import { icon } from '../components/icons.js';
import { ProductCard } from '../components/ProductCard.js';
import { getCategories, getProducts, search, sortProducts, categoryBySlug } from '../store/catalog.js';
import { esc } from '../utils/sanitize.js';
import { reveal } from '../utils/animations.js';

const SORTS = [
  ['default', 'Padrão'],
  ['az', 'Nome A–Z'],
  ['price-asc', 'Menor preço'],
  ['price-desc', 'Maior preço'],
];

export function CatalogPage(params) {
  const cats = getCategories();
  const active = categoryBySlug(params.get('categoria') || '');
  const q = params.get('q') || '';
  const sort = SORTS.some(([k]) => k === params.get('ordem')) ? params.get('ordem') : 'default';
  const total = getProducts().length;

  const catLink = (c, label, count, on) =>
    `<a class="filter-link${on ? ' is-active' : ''}" href="${c ? `#/produtos?categoria=${c.slug}` : '#/produtos'}" ${on ? 'aria-current="true"' : ''}>
      <span>${esc(label)}</span><span class="filter-count">${count}</span></a>`;

  return `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a><span aria-hidden="true">/</span>${
        active ? `<a href="#/produtos">Produtos</a><span aria-hidden="true">/</span><span aria-current="page">${esc(active.name)}</span>` : '<span aria-current="page">Produtos</span>'
      }</nav>
      <h1 class="page-title">${active ? esc(active.name) : 'Todos os produtos'}</h1>
      <p class="page-sub">${active ? `${active.count} produtos nesta categoria.` : `${total} produtos da Narguilé-Lê. Busque pelo nome, código ou categoria.`}</p>
    </div>
  </div>

  <div class="container catalog">
    <aside class="catalog-side" aria-label="Filtrar por categoria">
      <p class="side-title">Categorias</p>
      <nav class="filter-list">
        ${catLink(null, 'Todos', total, !active)}
        ${cats.map((c) => catLink(c, c.name, c.count, active?.slug === c.slug)).join('')}
      </nav>
    </aside>

    <div class="catalog-main">
      <div class="toolbar">
        <div class="toolbar-search">
          <label class="visually-hidden" for="cat-q">Buscar no catálogo</label>
          ${icon('search', { size: 18 })}
          <input id="cat-q" type="search" placeholder="Buscar por nome, código ou categoria" value="${esc(q)}" autocomplete="off" enterkeyhint="search" />
        </div>
        <div class="toolbar-sort">
          <label for="cat-sort">Ordenar</label>
          <div class="select-wrap">
            <select id="cat-sort">${SORTS.map(([k, l]) => `<option value="${k}"${k === sort ? ' selected' : ''}>${l}</option>`).join('')}</select>
            ${icon('chevronDown', { size: 16 })}
          </div>
        </div>
      </div>

      <div class="chips-mobile" role="navigation" aria-label="Categorias">
        <a class="chip${!active ? ' is-active' : ''}" href="#/produtos">Todos</a>
        ${cats.map((c) => `<a class="chip${active?.slug === c.slug ? ' is-active' : ''}" href="#/produtos?categoria=${c.slug}">${esc(c.name)}</a>`).join('')}
      </div>

      <p class="result-count" id="result-count" aria-live="polite"></p>
      <div class="product-grid cols-4 catalog-grid" id="catalog-grid"></div>
      <div class="catalog-more" id="catalog-more"></div>
    </div>
  </div>`;
}

export function initCatalogPage(root, params) {
  const active = categoryBySlug(params.get('categoria') || '');
  const input = root.querySelector('#cat-q');
  const sortSel = root.querySelector('#cat-sort');
  const grid = root.querySelector('#catalog-grid');
  const countEl = root.querySelector('#result-count');
  const more = root.querySelector('#catalog-more');
  const size = CONFIG.catalog.pageSize;
  let list = [];
  let shown = 0;

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (active) p.set('categoria', active.slug);
    if (input.value.trim()) p.set('q', input.value.trim());
    if (sortSel.value !== 'default') p.set('ordem', sortSel.value);
    const hash = `#/produtos${p.toString() ? `?${p}` : ''}`;
    history.replaceState(null, '', hash);
  };

  const appendPage = () => {
    const slice = list.slice(shown, shown + size);
    const tmp = document.createElement('div');
    tmp.innerHTML = slice.map((p) => ProductCard(p)).join('');
    const nodes = [...tmp.children];
    grid.append(...nodes);
    shown += slice.length;
    grid.setAttribute('data-reveal-group', '');
    reveal(grid.parentElement);
    renderMore();
  };

  const renderMore = () => {
    const n = list.length;
    countEl.innerHTML = n ? `<strong>${n}</strong> ${n === 1 ? 'produto encontrado' : 'produtos encontrados'}` : '';
    if (!n) {
      more.innerHTML = `<div class="catalog-empty"><p class="catalog-empty-title">Nenhum produto encontrado.</p><p>Confira a grafia, tente o código do produto ou veja outra categoria.</p><a class="btn btn-ghost" href="#/produtos">Limpar filtros</a></div>`;
      return;
    }
    more.innerHTML = shown < n
      ? `<p class="more-progress">Mostrando ${shown} de ${n}</p><div class="more-bar" aria-hidden="true"><span style="width:${(shown / n) * 100}%"></span></div><button type="button" class="btn btn-ghost" data-load-more>Carregar mais produtos</button>`
      : `<p class="more-progress">Mostrando todos os ${n} produtos</p>`;
  };

  const run = () => {
    list = sortProducts(search(input.value, { category: active?.name || '' }), sortSel.value);
    shown = 0;
    grid.innerHTML = '';
    appendPage();
  };

  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { run(); syncUrl(); }, 120); });
  input.addEventListener('keydown', (e) => e.key === 'Enter' && e.preventDefault());
  sortSel.addEventListener('change', () => { run(); syncUrl(); });
  more.addEventListener('click', (e) => {
    if (!e.target.closest('[data-load-more]')) return;
    const firstNew = shown;
    appendPage();
    grid.children[firstNew]?.querySelector('.card-title a')?.focus({ preventScroll: true });
  });

  run();
  const chips = root.querySelector('.chips-mobile');
  const on = chips?.querySelector('.chip.is-active');
  if (chips && on) chips.scrollLeft = on.offsetLeft - chips.clientWidth / 2 + on.clientWidth / 2;
}
