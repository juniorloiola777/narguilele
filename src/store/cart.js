import { CONFIG } from '../config.js';
import { getById } from './catalog.js';
import { isConsultPrice } from '../utils/currency.js';
const KEY=CONFIG.storageKeys.cart,MAX_QTY=99;let items=[];const listeners=new Set();
function read(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(raw))return[];return raw.filter((i)=>i&&typeof i.id==='string'&&Number.isInteger(i.qty)&&i.qty>0).map((i)=>({id:i.id,qty:Math.min(i.qty,MAX_QTY)}));}catch{return[];}}
function write(){try{localStorage.setItem(KEY,JSON.stringify(items));}catch{}}
function emit(change){write();listeners.forEach((fn)=>fn(change));}
export function initCart(){items=read().filter((i)=>getById(i.id));write();window.addEventListener('storage',(e)=>{if(e.key===KEY){items=read().filter((i)=>getById(i.id));listeners.forEach((fn)=>fn({type:'sync'}));}});}
export const subscribe=(fn)=>(listeners.add(fn),()=>listeners.delete(fn));
export function add(id,qty=1){const it=items.find((i)=>i.id===id);if(it)it.qty=Math.min(it.qty+qty,MAX_QTY);else items.push({id,qty:Math.min(qty,MAX_QTY)});emit({type:'add',id});}
export function setQty(id,qty){const it=items.find((i)=>i.id===id);if(!it)return;if(qty<=0)return remove(id);it.qty=Math.min(qty,MAX_QTY);emit({type:'qty',id});}
export function remove(id){items=items.filter((i)=>i.id!==id);emit({type:'remove',id});}
export function clear(){items=[];emit({type:'clear'});}
export function lines(){return items.map((i)=>{const p=getById(i.id);if(!p)return null;const consult=isConsultPrice(p.price);return{product:p,qty:i.qty,consult,subtotal:consult?0:p.price*i.qty};}).filter(Boolean);}
export const count=()=>items.reduce((n,i)=>n+i.qty,0);export const total=()=>lines().reduce((s,l)=>s+l.subtotal,0);export const hasConsult=()=>lines().some((l)=>l.consult);
