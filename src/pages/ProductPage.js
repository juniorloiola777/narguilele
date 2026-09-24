import { icon } from '../components/icons.js';
import { productImage } from '../components/ProductCard.js';
import { ProductGrid, SectionHead } from '../components/ProductGrid.js';
import { getBySlug, productsIn, getCategories } from '../store/catalog.js';
import { esc } from '../utils/sanitize.js';
import { priceText, isConsultPrice } from '../utils/currency.js';
import { waLink, productQuestion } from '../services/whatsapp.js';
import * as cart from '../store/cart.js';

export function NotFound() {
  return `<div class="container notfound"><p class="eyebrow">Página não encontrada</p><h1 class="page-title">Não encontramos o que você procurou.</h1><p class="page-sub">O produto pode ter saído do catálogo. Veja os produtos disponíveis.</p><a class="btn btn-primary" href="#/produtos">Ver catálogo${icon('arrowRight',{size:18})}</a></div>`;
}

export function ProductPage(slug) {
  const p=getBySlug(slug); if(!p)return NotFound();
  const cat=getCategories().find((c)=>c.name===p.category), related=productsIn(p.category).filter((x)=>x.id!==p.id).slice(0,4), consult=isConsultPrice(p.price);
  return `<div class="container product-page"><nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a><span aria-hidden="true">/</span><a href="#/produtos">Produtos</a><span aria-hidden="true">/</span>${cat?`<a href="#/produtos?categoria=${cat.slug}">${esc(cat.name)}</a><span aria-hidden="true">/</span>`:''}<span aria-current="page">${esc(p.name)}</span></nav><div class="pp-grid"><div class="pp-media" data-reveal>${productImage(p,{size:'large',eager:true})}</div><div class="pp-info" data-reveal><p class="card-cat">${esc(p.category)}${p.categoryRaw?` · ${esc(p.categoryRaw)}`:''}</p><h1 class="pp-title">${esc(p.name)}</h1><p class="pp-code">Código ${esc(p.codigo)}</p><p class="pp-price${consult?' is-consult':''}">${priceText(p)}</p>${consult?'<p class="pp-note">Valor confirmado no atendimento pelo WhatsApp.</p>':''}<div class="pp-buy"><div class="qty qty--lg" role="group" aria-label="Quantidade"><button type="button" class="qty-btn" data-pp-dec aria-label="Diminuir quantidade">${icon('minus',{size:18})}</button><span class="qty-val" data-pp-qty aria-live="polite">1</span><button type="button" class="qty-btn" data-pp-inc aria-label="Aumentar quantidade">${icon('plus',{size:18})}</button></div><button type="button" class="btn btn-primary btn-lg pp-add" data-pp-add="${esc(p.id)}">${icon('bag',{size:19})}Adicionar ao carrinho</button></div><a class="btn btn-ghost btn-block" href="${waLink(productQuestion(p))}" target="_blank" rel="noopener">${icon('message',{size:18})}Perguntar pelo WhatsApp</a><ul class="pp-perks"><li>${icon('truck',{size:18})}Delivery em Valparaíso e região</li><li>${icon('message',{size:18})}Pedido finalizado pelo WhatsApp</li><li>${icon('shield',{size:18})}Venda somente para maiores de 18 anos</li></ul></div></div></div>${related.length?`<section class="section section--alt" aria-labelledby="rel-title"><div class="container">${SectionHead({eyebrow:'Da mesma categoria',title:'Você também pode gostar',link:`#/produtos?categoria=${cat.slug}`,linkLabel:`Ver ${cat.name}`,id:'rel-title'})}${ProductGrid(related)}</div></section>`:''}`;
}

export function initProductPage(root,onAdded){const qtyEl=root.querySelector('[data-pp-qty]'),addBtn=root.querySelector('[data-pp-add]');if(!addBtn)return;let qty=1;const set=(n)=>{qty=Math.max(1,Math.min(99,n));qtyEl.textContent=qty;};root.querySelector('[data-pp-inc]').addEventListener('click',()=>set(qty+1));root.querySelector('[data-pp-dec]').addEventListener('click',()=>set(qty-1));addBtn.addEventListener('click',()=>{cart.add(addBtn.dataset.ppAdd,qty);onAdded?.(addBtn,addBtn.dataset.ppAdd,qty);set(1);});}
