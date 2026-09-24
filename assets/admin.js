(() => {
  const URL = 'https://wpyzjukssdnoxpvrfmti.supabase.co';
  const KEY = 'sb_publishable_BwWltgSCyPETg1IFCTrFXQ_l0rvPv3u';
  const ADMIN_USER = 'adminnarguilele1';
  const ADMIN_EMAIL = 'juniorloiola777@gmail.com';
  const db = SiteDB.createClient(URL, KEY);
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const categoryOptions = [
    {raw:'APERITIVO', label:'Aperitivos', site:'Alimentos'},
    {raw:'BEBIDAS', label:'Bebidas', site:'Bebidas'},
    {raw:'ENERGETICOS', label:'Energéticos', site:'Bebidas'},
    {raw:'REFRIGERANTE', label:'Refrigerantes', site:'Bebidas'},
    {raw:'ACESSORIOS', label:'Acessórios', site:'Acessórios'},
    {raw:'OUTROS', label:'Outros', site:'Outros'}
  ];
  const fallbackTitles = {1:'Seu espaço. Sua escolha.',2:'Encontre o que precisa.',3:'Monte o pedido. A gente leva.'};
  const PAGE_SIZE = 12;
  let products = [], banners = [], busy = false, selectedCategory = 'all', productPage = 1, defaultArtwork = '';
  const categoryFor = raw => categoryOptions.find(c => c.raw === raw);
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
    $('#productCount').textContent = `${products.length} publicados`;
    $('#productCountHome').textContent = products.length;
    $('#bannerCount').textContent = banners.length;
    $('#newCategory').innerHTML = categoryOptions.map(c => `<option value="${c.raw}">${c.label}</option>`).join('');
    if (!defaultArtwork) {
      try { defaultArtwork = (await import('/src/data/assets.js')).ASSETS.mascot; }
      catch (error) { console.warn('[narguilele] Arte padrão indisponível', error); }
    }
    renderCategoryFilters();
    await renderProducts();
    await renderBanners();
  }
  function renderCategoryFilters() {
    const counts = new Map();
    products.forEach(p => counts.set(p.category_raw, (counts.get(p.category_raw) || 0) + 1));
    $('#categoryFilters').innerHTML = [{raw:'all',label:'Todos',count:products.length}, ...categoryOptions.filter(c => counts.has(c.raw)).map(c => ({...c,count:counts.get(c.raw)}))]
      .map(c => `<button type="button" data-category="${c.raw}" aria-pressed="${selectedCategory === c.raw}">${c.label}<span>${c.count}</span></button>`).join('');
  }
  async function renderProducts() {
    const q = ($('#productSearch').value || '').trim().toLocaleLowerCase('pt-BR');
    const filtered = products.filter(p => (selectedCategory === 'all' || p.category_raw === selectedCategory) && `${p.name} ${p.codigo}`.toLocaleLowerCase('pt-BR').includes(q));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    productPage = Math.min(productPage, pages);
    const visible = filtered.slice((productPage - 1) * PAGE_SIZE, productPage * PAGE_SIZE);
    const photos = await Promise.all(visible.map(p => photo(p.image_path)));
    $('#productsResult').textContent = `${filtered.length} produto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;
    $('#pageInfo').textContent = `Página ${productPage} de ${pages}`;
    $('#prevPage').disabled = productPage === 1;
    $('#nextPage').disabled = productPage === pages;
    show('.pagination', pages > 1);
    $('#productsList').innerHTML = visible.map((p,i) => `<article class="product-row" data-product="${escape(p.id)}">
      ${photos[i] ? `<img class="preview" src="${escape(photos[i])}" alt="Foto de ${escape(p.name)}">` : '<div class="preview empty">Imagem em breve</div>'}
      <div><div class="grid"><div><label>Nome</label><input class="name" aria-label="Nome de ${escape(p.name)}" maxlength="140" value="${escape(p.name)}"></div><div><label>Preço (R$)</label><input class="price" aria-label="Preço de ${escape(p.name)}" type="number" min="0" step="0.01" value="${escape(p.price)}"></div><div><label>Categoria</label><select class="category" aria-label="Categoria de ${escape(p.name)}">${categoryOptions.map(c => `<option value="${c.raw}" ${c.raw === p.category_raw ? 'selected' : ''}>${c.label}</option>`).join('')}</select></div></div>
      <div class="item-meta">Código ${escape(p.codigo)} · ${escape(categoryFor(p.category_raw)?.label || p.category_raw)}</div><label>Foto do produto</label><input class="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-label="Trocar foto de ${escape(p.name)}">
      <div class="actions"><button type="button" class="btn" data-action="save-product">Salvar alterações</button><button type="button" class="btn secondary" data-action="remove-product-image" ${p.image_path ? '' : 'disabled'}>Apagar foto</button><button type="button" class="btn danger" data-action="hide-product">Retirar do site</button></div></div>
    </article>`).join('') || '<div class="card">Nenhum produto encontrado nesta categoria.</div>';
  }
  async function renderBanners() {
    const photos = await Promise.all(banners.map(b => photo(b.image_path)));
    $('#bannersList').innerHTML = banners.map((b,i) => {
      const title = b.title || fallbackTitles[b.id] || 'Destaque';
      const preview = photos[i]
        ? `<div class="banner-visual is-uploaded"><img src="${escape(photos[i])}" alt="Imagem atual do banner ${i + 1}"><span class="banner-overlay">${escape(title)}</span></div>`
        : fallbackTitles[b.id]
          ? `<div class="banner-visual is-default"><span class="banner-default-title">${escape(title)}</span><img data-default-image alt="Arte padrão do banner ${i + 1}"></div>`
          : '<div class="banner-visual is-empty">Sem imagem</div>';
      return `<article class="banner-card" data-banner="${b.id}"><div class="banner-head"><strong>Banner ${i + 1}</strong><small>${photos[i] ? 'Foto personalizada' : fallbackTitles[b.id] ? 'Arte padrão do site' : 'Sem imagem'}</small></div>${preview}
      <div class="banner-fields"><div class="grid"><div><label>Título</label><input class="title" maxlength="140" value="${escape(b.title)}" placeholder="${escape(fallbackTitles[b.id] || 'Título do banner')}"></div><div><label>Descrição</label><input class="description" maxlength="300" value="${escape(b.description)}"></div></div>
      <label>Substituir imagem (recomendado: 1920 × 617 px)</label><input class="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif"></div>
      <div class="actions"><button type="button" class="btn" data-action="save-banner">Salvar alterações</button><button type="button" class="btn secondary" data-action="up-banner" ${i===0?'disabled':''}>↑ Subir</button><button type="button" class="btn secondary" data-action="down-banner" ${i===banners.length-1?'disabled':''}>↓ Descer</button><button type="button" class="btn secondary" data-action="remove-banner-image" ${b.image_path?'':'disabled'}>Remover foto</button><button type="button" class="btn danger" data-action="hide-banner">Excluir banner</button></div></article>`;
    }).join('') || '<div class="card">Nenhum banner publicado. Adicione um abaixo.</div>';
    if (defaultArtwork) document.querySelectorAll('[data-default-image]').forEach(img => { img.src = defaultArtwork; });
  }
  async function refresh(text) { await load(); message(text); }
  async function sessionChanged() {
    const {data:{session}} = await db.auth.getSession();
    show('#login', !session); show('#dashboard', false); show('#denied', false); show('#siteHeader', false);
    if (!session) return;
    const {data,error} = await db.rpc('is_site_admin');
    if (error || data !== true) { show('#denied', true); return; }
    show('#siteHeader', true);
    show('#dashboard', true);
    await load();
  }
  $('#passwordLoginForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const username = $('#username').value.trim();
    const password = $('#loginPassword').value;
    $('#loginPassword').value = '';
    if (username !== ADMIN_USER) throw new Error('Usuário ou senha inválidos.');
    const {error} = await db.auth.signInWithPassword({email:ADMIN_EMAIL,password});
    if (error) throw new Error('Usuário ou senha inválidos.');
    await sessionChanged();
    message('');
  }); };
  $('#passwordSetupForm').onsubmit = event => { event.preventDefault(); run(async () => {
    const password = $('#newPassword').value;
    if (password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
    if (password !== $('#confirmPassword').value) throw new Error('As senhas não coincidem.');
    const {error} = await db.auth.updateUser({password});
    if (error) throw error;
    event.target.reset();
    message('Senha salva. Você já pode entrar com usuário e senha.');
  }); };
  async function logout() { await db.auth.signOut(); await sessionChanged(); message(''); }
  $('#logout').onclick = logout; $('#deniedLogout').onclick = logout;
  function selectTab(name) {
    const home = name === 'home';
    show('#homePanel', home); show('#productsPanel', !home);
    [['#tabHome',home],['#tabProducts',!home]].forEach(([id,active]) => {
      $(id).setAttribute('aria-selected', String(active));
      $(id).tabIndex = active ? 0 : -1;
    });
  }
  $('#tabHome').onclick = () => selectTab('home');
  $('#tabProducts').onclick = () => selectTab('products');
  document.querySelector('.main-tabs').onkeydown = event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'ArrowRight' ? $('#tabProducts') : $('#tabHome');
    selectTab(target === $('#tabHome') ? 'home' : 'products');
    target.focus();
  };
  $('#productSearch').oninput = () => { productPage = 1; renderProducts().catch(failed); };
  $('#categoryFilters').onclick = event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    productPage = 1;
    document.querySelectorAll('[data-category]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    renderProducts().catch(failed);
  };
  $('#prevPage').onclick = () => { if (productPage > 1) { productPage--; renderProducts().catch(failed); } };
  $('#nextPage').onclick = () => { productPage++; renderProducts().catch(failed); };
  $('#productsList').onclick = event => { const button=event.target.closest('[data-action]'); if (!button) return; const row=button.closest('[data-product]'); const p=products.find(x=>x.id===row.dataset.product); if (!p) return; run(async()=>{
    const action=button.dataset.action;
    if (action==='hide-product') { if (!confirm(`Apagar ${p.name} do site?`)) return; const {error}=await db.from('products').update({is_active:false}).eq('id',p.id); if(error)throw error; await refresh('Produto retirado do site.'); return; }
    if (action==='remove-product-image') { const {error}=await db.from('products').update({image_path:null}).eq('id',p.id); if(error)throw error; await removePhoto(p.image_path).catch(console.warn); await refresh('Foto removida.'); return; }
    const name=row.querySelector('.name').value.trim(), price=Number(row.querySelector('.price').value), category_raw=row.querySelector('.category').value;
    if (!name || !Number.isFinite(price) || price<0) throw new Error('Informe nome e preço válidos.');
    const category = categoryFor(category_raw)?.site;
    if (!category) throw new Error('Escolha uma categoria válida.');
    const old=p.image_path, image=await upload(row.querySelector('.image').files[0],'products');
    const {error}=await db.from('products').update({name,price,category_raw,category,...(image?{image_path:image}:{})}).eq('id',p.id);
    if(error){await removePhoto(image);throw error;}
    if(image && old) await removePhoto(old).catch(console.warn);
    await refresh('Produto salvo.');
  }); };
  $('#newProduct').onsubmit = event => {event.preventDefault();run(async()=>{
    const name=$('#newName').value.trim(),price=Number($('#newPrice').value),codigo=$('#newCode').value.trim(),category_raw=$('#newCategory').value;
    if(!name || !codigo || !Number.isFinite(price) || price<0)throw new Error('Preencha nome, código e preço válidos.');
    const category = categoryFor(category_raw)?.site;
    if (!category) throw new Error('Escolha uma categoria válida.');
    const existing = await db.from('products').select('id').eq('codigo',codigo).limit(1);
    if (existing.error) throw existing.error;
    if (existing.data.length) throw new Error('Já existe um produto com este código.');
    const image_path=await upload($('#newImage').files[0],'products');
    const id=crypto.randomUUID(), slug=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)+'-'+id.slice(0,8);
    const {error}=await db.from('products').insert({id,codigo,name,price,category_raw,category,slug,image_path,is_active:true});
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

