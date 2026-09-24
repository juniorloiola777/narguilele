import { CONFIG } from '../config.js';
import { Hero, Benefits, initHero } from '../components/Hero.js';
import { Categories } from '../components/Categories.js';
import { ProductGrid, SectionHead, ProductRail, initRail } from '../components/ProductGrid.js';
import { PromoDuo, BrandBanner } from '../components/Banners.js';
import { LoungeSection, DeliverySection } from '../components/LoungeSection.js';
import { ContactBand } from '../components/Footer.js';
import { getById, getProducts, productsIn, getCategories } from '../store/catalog.js';
import { isConsultPrice } from '../utils/currency.js';
import { esc } from '../utils/sanitize.js';
import { reveal, parallax } from '../utils/animations.js';

const priced = (list) => list.filter((p) => !isConsultPrice(p.price));

function spread(category, n) {
  const list = priced(productsIn(category));
  if (list.length <= n) return list;
  const step = list.length / n;
  return Array.from({ length: n }, (_, i) => list[Math.floor(i * step)]);
}

function selection() {
  const ids = CONFIG.home.selection.ids;
  const list = ids.map(getById).filter(Boolean);
  return list.length ? list : priced(getProducts()).slice(0,8);
}

function featuredTabs() {
  const cats = CONFIG.home.featuredTabs.filter((c) => getCategories().some((x) => x.name === c));
  if (!cats.length) return '';
  return `
  <section class="section featured" aria-labelledby="featured-title">
    <div class="container">
      <div class="section-head section-head--tabs" data-reveal>
        <div>
          <p class="eyebrow">Destaques</p>
          <h2 class="section-title" id="featured-title">Produtos em destaque</h2>
        </div>
        <div class="tabs" role="tablist" aria-label="Categorias em destaque">
          ${cats.map((c,i)=>`<button type="button" role="tab" class="tab${i===0?' is-active':''}" id="ftab-${i}" aria-controls="fpanel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab="${esc(c)}">${esc(c)}</button>`).join('')}
        </div>
      </div>
      <div id="fpanel" role="tabpanel" aria-labelledby="ftab-0" data-featured-panel>${ProductGrid(spread(cats[0],8))}</div>
      <div class="section-foot"><a class="btn btn-ghost" data-featured-all href="#/produtos?categoria=${getCategories().find((x)=>x.name===cats[0]).slug}">Ver todos em ${esc(cats[0])}</a></div>
    </div>
  </section>`;
}

function recommendations() {
  const cfg = CONFIG.home.recommendations;
  const list = cfg.categories.flatMap((c) => spread(c,3));
  if (!list.length) return '';
  return `<section class="section recs" aria-labelledby="recs-title"><div class="container">${SectionHead({eyebrow:'Para acompanhar',title:cfg.title,link:'#/produtos',linkLabel:'Ver catálogo',id:'recs-title'})}${ProductRail(list,{id:'recs-rail'})}</div></section>`;
}

export function HomePage() {
  const sel = CONFIG.home.selection;
  return `${Hero()}${Benefits()}${Categories()}<section class="section section--alt selection" aria-labelledby="selection-title"><div class="container">${SectionHead({eyebrow:sel.eyebrow,title:sel.title,link:'#/produtos',linkLabel:'Ver todos os produtos',id:'selection-title'})}${ProductGrid(selection())}</div></section>${PromoDuo()}${featuredTabs()}${BrandBanner()}${LoungeSection()}${DeliverySection()}${recommendations()}${ContactBand()}`;
}

export function initHomePage(root) {
  const stopHero = initHero(root);
  initRail(root.querySelector('#recs-rail'));
  const tabs=[...root.querySelectorAll('.featured .tab')], panel=root.querySelector('[data-featured-panel]'), allLink=root.querySelector('[data-featured-all]');
  const select=(tab,focus=false)=>{
    tabs.forEach((t)=>{const on=t===tab;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
    const cat=tab.dataset.tab; panel.setAttribute('aria-labelledby',tab.id); panel.innerHTML=ProductGrid(spread(cat,8));
    const c=getCategories().find((x)=>x.name===cat); allLink.href=`#/produtos?categoria=${c.slug}`; allLink.textContent=`Ver todos em ${cat}`; reveal(panel); if(focus)tab.focus();
  };
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];select(n,true);}});});
  parallax(root.querySelector('.lounge-img'),root.querySelector('.lounge-frame'),18);
  parallax(root.querySelector('.bb-mascot img'),root.querySelector('.brand-banner'),22);
  return ()=>stopHero?.();
}
