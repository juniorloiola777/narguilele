import { CONFIG } from '../config.js';
let db;
const client = () => db ||= window.SiteDB.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
async function signedImage(path) {
  if (!path) return '';
  const {data,error} = await client().storage.from('site-content').createSignedUrl(path,3600);
  if (error) throw error;
  return data.signedUrl;
}
async function attachImages(rows) {
  await Promise.all(rows.map(async row => {
    if (row.image_path) try { row.image_url = await signedImage(row.image_path); }
    catch (error) { console.warn('[narguilele] Imagem indisponível', error); }
  }));
  return rows;
}
export async function fetchActiveBanners() {
  if (!isSupabaseConfigured()) return [];
  const {data,error} = await client().from('site_banners').select('id,title,description,image_path,sort_order').eq('is_active',true).order('sort_order').order('id');
  if (error) throw error;
  return attachImages(data || []);
}
export function isSupabaseConfigured(){const{url,anonKey}=CONFIG.supabase;if(!url||!anonKey)return false;if(/service_role/i.test(anonKey)){console.error('[narguilele] Chave service_role detectada no frontend. Supabase desativado por segurança.');return false;}return true;}
export async function fetchActiveProducts({timeoutMs=CONFIG.supabase.timeoutMs}={}){if(!isSupabaseConfigured())throw new Error('supabase-not-configured');const{url,anonKey,table}=CONFIG.supabase;const endpoint=`${url.replace(/\/$/,'')}/rest/v1/${encodeURIComponent(table)}?select=*&is_active=eq.true&order=name.asc`;const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),timeoutMs);try{const res=await fetch(endpoint,{signal:ctrl.signal,headers:{apikey:anonKey,Authorization:`Bearer ${anonKey}`,Accept:'application/json'}});if(!res.ok)throw new Error(`supabase-http-${res.status}`);return attachImages(await res.json());}finally{clearTimeout(timer);}}
