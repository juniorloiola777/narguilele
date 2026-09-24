(() => {
  const URL = 'https://wpyzjukssdnoxpvrfmti.supabase.co';
  const KEY = 'sb_publishable_BwWltgSCyPETg1IFCTrFXQ_l0rvPv3u';
  const db = SiteDB.createClient(URL, KEY);
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let products = [], banners = [], email = '', busy = false;
  const categoryNames = {APERITIVO:'Alimentos',REFRIGERANTE:'Bebidas',ACESSORIOS:'Acessórios'};
  const show = (id, visible) => $(id).classList.toggle('hidden', !visible);
  function message(value, error = false) {
    $('#notice').textContent = value;
    $('#notice').className = value ? 'notice' + (error ? ' error' : '') : '';
  }
  function failed(error) { message(error?.message || String(error), true); }
  async function run(action) {
    if (busy) return;
    busy = true;
    const enabled = [...document.querySelectorAll('button:not(:disabled)')];
    enabled.forEach(button => button.disabled = true);
    try { await action(); } catch (error) { failed(error); }
    finally { busy = false; enabled.filter(button => button.isConnected).forEach(button => button.disabled = false); }
  }
  async function photo(path) {
    if (!path) return '';
    const {data,error} = await db.storage.from('site-content').createSignedUrl(path, 3600);
    if (error) return '';
    return data.signedUrl;
  }
  async function upload(file, folder) {
    if (!file) return null;
    if (!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Use JPG, PNG, WebP ou AVIF com até 10 MB.');
    const ext = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'}[file.type];
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const {error} = await db.storage.from('site-content').upload(path, file, {contentType:file.type,upsert:false});
    if (error) throw error;
    return path;
  }
  async function removePhoto(path) {
    if (!path) return;
    const {error} = await db.storage.from('site-content').remove([path]);
    if (error) throw error;
  }
  async function load() {
    const [p,b] = await Promise.all([
      db.from('products').select('id,codigo,name,price,category,category_raw,image_path,is_active').eq('is_active',true).order('name'),
      db.from('site_banners').select('*').eq('is_active',true).order('sort_order').order('id')
    ]);
    if (p.error) throw p.error;
    if (b.error) throw b.error;
    products = p.data;
    banners = b.data;
    await renderProducts();
    await renderBanners();
  }
  async function renderProducts() {
    const q = ($('#productSearch').value || '').toLocaleLowerCase('pt-BR');
    const visible = products.filter(p => `${p.name} ${p.codigo}`.toLocaleLowerCase('pt-BR').includes(q));
    const photos = await Promise.all(visible.map(p => photo(p.image_path)));
    $('#productsList').innerHTML = visible.map((p,i) => `<div class="item" data-product="${escape(p.id)}">
      ${photos[i] ? `<img class="preview" src="${escape(photos[i])}" alt="">` : '<div class="preview empty">Sem foto</div>'}
      <div><div class="grid"><div><label>Nome</label><input class="name" maxlength="140" value="${escape(p.name)}"></div><div><label>Preço (R$)</label><input class="price" type="number" min="0" step="0.01" value="${escape(p.price)}"></div><div><label>Imagem</label><input class="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif"></div></div>
      <small>Código ${escape(p.codigo)} · ${escape(p.category)}</small><div class="actions"><button class="btn" data-action="save-product">Salvar</button><button class="btn secondary" data-action="remove-product-image" ${p.image_path ? '' : 'disabled'}>Apagar foto</button><button class="btn danger" data-action="hide-product">Apagar produto</button></div></div>
    </div>`).join('') || '<p>Nenhum produto encontrado.</p>';
  }
  async function renderBanners() {
    const photos = await Promise.all(banners.map(b => photo(b.image_path)));
    $('#bannersList').innerHTML = banners.map((b,i) => `<div class="item" data-banner="${b.id}">
      ${photos[i] ? `<img class="preview" src="${escape(photos[i])}" alt="">` : '<div class="preview empty">Sem imagem</div>'}
      <div><div class="grid"><div><label>Título</label><input class="title" maxlength="140" value="${escape(b.title)}"></div><div><label>Descrição</label><input class="description" maxlength="300" value="${escape(b.description)}"></div><div><label>Trocar imagem</label><input class="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif"></div></div>
      <div class="actions"><button class="btn" data-action="save-banner">Salvar</button><button class="btn secondary" data-action="up-banner" ${i===0?'disabled':''}>↑ Subir</button><button class="btn secondary" data-action="down-banner" ${i===banners.length-1?'disabled':''}>↓ Descer</button><button class="btn secondary" data-action="remove-banner-image" ${b.image_path?'':'disabled'}>Apagar imagem</button><button class="btn danger" data-action="hide-banner">Apagar banner</button></div></div>
    </div>`).join('') || '<p>Nenhum banner publicado.</p>';
  }
  async function refresh(text) { await load(); message(text); }
  async function sessionChanged() {
    const {data:{session}} = await db.auth.getSession();
    show('#login', !session); show('#dashboard', false); show('#denied', false);
    if (!session) return;
    const {data,error} = await db.rpc('is_site_admin');
    if (error || data !== true) { show('#denied', true); return; }
    show('#dashboard', true);
    await load();
  }
  $('#passwordLoginForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const email = $('#passwordEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;
    const {error} = await db.auth.signInWithPassword({email,password});
    $('#loginPassword').value = '';
    if (error) throw error;
    await sessionChanged();
  }); };
  $('#passwordSetupForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const password = $('#newPassword').value;
    if (password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
    if (password !== $('#confirmPassword').value) throw new Error('As senhas não coincidem.');
    const {error} = await db.auth.updateUser({password});
    if (error) throw error;
    event.target.reset();
    message('Senha salva. Você já pode entrar com e-mail e senha.');
  }); };
  $('#loginForm').onsubmit = event => { event.preventDefault(); run(async () => {
    email = $('#email').value.trim().toLowerCase();
    const {error} = await db.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+'/admin.html',shouldCreateUser:false}});
    if (error) throw error;
    message('Enviamos um novo link. Copie o mais recente sem abri-lo e cole no campo abaixo.');
  }); };
  $('#codeForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const {error} = await db.auth.verifyOtp({email:email || $('#email').value.trim(),token:$('#code').value.trim(),type:'email'});
    if (error) throw error;
    await sessionChanged();
  }); };
  $('#linkForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const link = new URL($('#accessLink').value.trim());
    if (link.hostname !== new URL(URL).hostname || link.pathname !== '/auth/v1/verify') throw new Error('Este link não é do projeto Supabase da loja.');
    const token_hash = link.searchParams.get('token'), type = link.searchParams.get('type');
    if (!token_hash || !['magiclink','email','signup'].includes(type)) throw new Error('Link de acesso inválido.');
    const {error} = await db.auth.verifyOtp({token_hash,type});
    if (error) throw error;
    $('#accessLink').value = '';
    await sessionChanged();
  }); };
  async function logout() { await db.auth.signOut(); await sessionChanged(); message('Sessão encerrada.'); }
  $('#logout').onclick = logout; $('#deniedLogout').onclick = logout;
  $('#tabProducts').onclick = () => { show('#productsPanel',true);show('#bannersPanel',false);$('#tabProducts').setAttribute('aria-selected','true');$('#tabBanners').setAttribute('aria-selected','false'); };
  $('#tabBanners').onclick = () => { show('#productsPanel',false);show('#bannersPanel',true);$('#tabProducts').setAttribute('aria-selected','false');$('#tabBanners').setAttribute('aria-selected','true'); };
  $('#productSearch').oninput = () => renderProducts().catch(failed);
  $('#productsList').onclick = event => { const button=event.target.closest('[data-action]'); if (!button) return; const row=button.closest('[data-product]'); const p=products.find(x=>x.id===row.dataset.product); if (!p) return; run(async()=>{
    const action=button.dataset.action;
    if (action==='hide-product') { if (!confirm(`Apagar ${p.name} do site?`)) return; const {error}=await db.from('products').update({is_active:false}).eq('id',p.id); if(error)throw error; await refresh('Produto retirado do site.'); return; }
    if (action==='remove-product-image') { const {error}=await db.from('products').update({image_path:null}).eq('id',p.id); if(error)throw error; await removePhoto(p.image_path).catch(console.warn); await refresh('Foto removida.'); return; }
    const name=row.querySelector('.name').value.trim(), price=Number(row.querySelector('.price').value);
    if (!name || !Number.isFinite(price) || price<0) throw new Error('Informe nome e preço válidos.');
    const old=p.image_path, image=await upload(row.querySelector('.image').files[0],'products');
    const {error}=await db.from('products').update({name,price,...(image?{image_path:image}:{})}).eq('id',p.id);
    if(error){await removePhoto(image);throw error;}
    if(image && old) await removePhoto(old).catch(console.warn);
    await refresh('Produto salvo.');
  }); };
  $('#newProduct').onsubmit = event => {event.preventDefault();run(async()=>{
    const name=$('#newName').value.trim(),price=Number($('#newPrice').value),codigo=$('#newCode').value.trim(),category_raw=$('#newCategory').value;
    if(!name || !codigo || !Number.isFinite(price) || price<0)throw new Error('Preencha nome, código e preço válidos.');
    const image_path=await upload($('#newImage').files[0],'products');
    const id=crypto.randomUUID(), slug=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)+'-'+id.slice(0,8);
    const {error}=await db.from('products').insert({id,codigo,name,price,category_raw,category:categoryNames[category_raw],slug,image_path,is_active:true});
    if(error){await removePhoto(image_path);throw error;}
    event.target.reset();await refresh('Produto criado.');
  });};
  $('#bannersList').onclick = event => {const button=event.target.closest('[data-action]');if(!button)return;const row=button.closest('[data-banner]'),b=banners.find(x=>x.id===Number(row.dataset.banner));if(!b)return;run(async()=>{
    const action=button.dataset.action;
    if(action==='hide-banner'){if(!confirm('Apagar este banner do site?'))return;const {error}=await db.from('site_banners').update({is_active:false}).eq('id',b.id);if(error)throw error;await refresh('Banner retirado do site.');return;}
    if(action==='up-banner'||action==='down-banner'){
      const i=banners.findIndex(x=>x.id===b.id),other=banners[i+(action==='up-banner'?-1:1)];if(!other)return;
      const updates=await Promise.all([db.from('site_banners').update({sort_order:other.sort_order}).eq('id',b.id),db.from('site_banners').update({sort_order:b.sort_order}).eq('id',other.id)]);
      if(updates[0].error||updates[1].error)throw updates[0].error||updates[1].error;
      await refresh('Ordem atualizada.');return;
    }
    if(action==='remove-banner-image'){const {error}=await db.from('site_banners').update({image_path:null}).eq('id',b.id);if(error)throw error;await removePhoto(b.image_path).catch(console.warn);await refresh('Imagem removida.');return;}
    const title=row.querySelector('.title').value.trim(),description=row.querySelector('.description').value.trim(),old=b.image_path,image=await upload(row.querySelector('.image').files[0],'banners');
    const {error}=await db.from('site_banners').update({title,description,...(image?{image_path:image}:{})}).eq('id',b.id);
    if(error){await removePhoto(image);throw error;}
    if(image&&old)await removePhoto(old).catch(console.warn);
    await refresh('Banner salvo.');
  });};
  $('#newBanner').onsubmit = event => {event.preventDefault();run(async()=>{
    const title=$('#newBannerTitle').value.trim(),description=$('#newBannerDescription').value.trim(),image_path=await upload($('#newBannerImage').files[0],'banners');
    if(!title||!image_path)throw new Error('Informe título e imagem.');
    const sort_order=Math.max(0,...banners.map(b=>b.sort_order))+1;
    const {error}=await db.from('site_banners').insert({title,description,image_path,sort_order,is_active:true});
    if(error){await removePhoto(image_path);throw error;}
    event.target.reset();await refresh('Banner adicionado.');
  });};
  db.auth.onAuthStateChange(()=>setTimeout(()=>sessionChanged().catch(failed),0));
  sessionChanged().catch(failed);
})();

