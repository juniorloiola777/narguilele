import { CONFIG } from '../config.js';
import { formatBRL } from '../utils/currency.js';
export function waLink(message=''){const base=`https://wa.me/${CONFIG.contact.whatsapp}`;return message?`${base}?text=${encodeURIComponent(message)}`:base;}
export function buildOrderMessage(lines,total){const rows=lines.map((l)=>{const code=l.product.codigo?` (cód. ${l.product.codigo})`:'';const value=l.consult?'preço a confirmar':formatBRL(l.subtotal);return `${l.qty}x ${l.product.name}${code} — ${value}`;});const consultNote=lines.some((l)=>l.consult)?'\n(Itens com preço a confirmar não estão no total.)':'';return [`Olá! Quero fazer um pedido na ${CONFIG.brand.name}:`,'',...rows,'',`Total estimado: ${formatBRL(total)}${consultNote}`,'','Pode confirmar a disponibilidade?'].join('\n');}
export function productQuestion(product){return `Olá! Tenho interesse no produto ${product.name}${product.codigo?` (cód. ${product.codigo})`:''}. Está disponível?`;}
