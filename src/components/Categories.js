import { icon, categoryArt, hookahArt } from './icons.js';
import { getCategories } from '../store/catalog.js';
import { esc } from '../utils/sanitize.js';
import { SectionHead } from './ProductGrid.js';

const plural = (n) => `${n} ${n === 1 ? 'produto' : 'produtos'}`;

export function Categories() {
  const cats = getCategories();
  const [lead, ...rest] = cats;
  if (!lead) return '';
  return `
  <section class="section categories" aria-labelledby="cat-title">
    <div class="container">
      ${SectionHead({ eyebrow: 'Categorias', title: 'Compre por categoria', link: '#/produtos', linkLabel: 'Ver catálogo completo', id: 'cat-title' })}
      <ul class="cat-grid" data-reveal-group>
        <li class="cat-tile cat-tile--lead">
          <a href="#/produtos?categoria=${lead.slug}">
            <span class="cat-media">${lead.name === 'Narguilés' ? hookahArt('cat-hookah') : categoryArt(lead.name)}</span>
            <span class="cat-info">
              <span class="cat-name">${esc(lead.name)}</span>
              <span class="cat-count">${plural(lead.count)}</span>
            </span>
            <span class="cat-arrow">${icon('arrowUpRight', { size: 20 })}</span>
          </a>
        </li>
        ${rest
          .map(
            (c) => `<li class="cat-tile">
            <a href="#/produtos?categoria=${c.slug}">
              <span class="cat-media">${categoryArt(c.name)}</span>
              <span class="cat-info">
                <span class="cat-name">${esc(c.name)}</span>
                <span class="cat-count">${plural(c.count)}</span>
              </span>
              <span class="cat-arrow">${icon('arrowUpRight', { size: 18 })}</span>
            </a>
          </li>`
          )
          .join('')}
      </ul>
    </div>
  </section>`;
}
