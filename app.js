(() => {
  'use strict';

  const CONFIG = {
    supabaseUrl: 'https://wpyzjukssdnoxpvrfmti.supabase.co',
    supabaseKey: 'sb_publishable_BwWltgSCyPETg1IFCTrFXQ_l0rvPv3u',
    whatsapp: '556130250654',
    storeName: 'Narguilé-Lê',
    city: 'Cidade Ocidental e região'
  };

  const state = {
    products: [],
    query: '',
    category: '',
    sort: 'default',
    visible: 24,
    cart: loadCart()
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem('nlcart') || '{}') || {};
    } catch {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem('nlcart', JSON.stringify(state.cart));
    renderCart();
  }

  function icon(name, size = 20) {
    const common = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
    const paths = {
      cart: '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5H18a2 2 0 0 0 2-1.6L21 8H6"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
      arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      minus: '<path d="M5 12h14"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      whatsapp: '<path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.4A8.4 8.4 0 1 1 20.5 11.7Z"/><path d="M8.3 7.8c.3-.6.6-.6.9-.6h.7c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.7.8c-.2.2-.2.4 0 .7.4.8 1 1.5 1.7 2 .8.6 1.5 1 2.3 1.2.3.1.5 0 .7-.2l.9-1.1c.2-.3.5-.3.8-.2l1.8.9c.3.1.5.3.5.6 0 .4-.2 1.4-.8 2-.6.6-1.5.9-2.4.8-1.5-.2-3.4-.9-5.5-2.7-2-1.7-3.2-3.7-3.6-5.2-.2-.8-.1-1.4.3-2Z"/>',
      shield: '<path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
      truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
      bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>'
    };
    return `<svg ${common}>${paths[name] || paths.arrow}</svg>`;
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root{--bg:#07090d;--bg2:#0d1118;--panel:#111722;--panel2:#151d29;--line:#232c39;--text:#f5f7fb;--muted:#8d99aa;--red:#ef334d;--blue:#2f7cf4;--green:#25d366;--max:1240px;--r:24px;--shadow:0 28px 80px rgba(0,0,0,.38)}
      *{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--bg)}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}body.lock{overflow:hidden}button,input,select{font:inherit}button,a{touch-action:manipulation}button{color:inherit}a{color:inherit;text-decoration:none}.wrap{width:min(var(--max),calc(100% - 40px));margin:auto}.muted{color:var(--muted)}
      .header{position:fixed;inset:0 0 auto;z-index:80;transition:.25s}.header.scrolled{background:rgba(7,9,13,.86);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.07)}.header-in{height:80px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px}.brand{display:flex;align-items:center;gap:12px;min-width:170px}.brand-logo{width:48px;height:48px;object-fit:contain;display:none}.brand-logo.ready{display:block}.wordmark{font-weight:900;letter-spacing:-.05em;font-size:20px;white-space:nowrap}.wordmark .r{color:var(--red)}.wordmark .b{color:var(--blue)}.nav{justify-self:center;display:flex;gap:2px;border:1px solid rgba(255,255,255,.07);padding:5px;border-radius:999px;background:rgba(255,255,255,.025)}.nav a{font-size:13px;font-weight:700;color:#9da8b6;padding:10px 15px;border-radius:999px;transition:.2s}.nav a:hover{color:#fff;background:#171d26}.actions{display:flex;gap:8px;align-items:center}.icon-btn{height:44px;min-width:44px;border:1px solid #28313e;background:#10151d;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:9px;cursor:pointer;transition:.2s}.icon-btn:hover{transform:translateY(-1px);border-color:#3a4655;background:#151c26}.cart-count{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--red);display:grid;place-items:center;font-size:11px;font-weight:900}.menu{display:none}
      .hero{min-height:100svh;display:flex;align-items:center;padding:132px 0 72px;position:relative;isolation:isolate}.hero:before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(65% 55% at 82% 42%,rgba(47,124,244,.16),transparent 60%),radial-gradient(55% 48% at 8% 78%,rgba(239,51,77,.11),transparent 62%)}.hero:after{content:"";position:absolute;inset:0;z-index:-1;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,transparent,#000 22%,transparent 96%)}.hero-grid{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(360px,.88fr);gap:70px;align-items:center}.eyebrow{display:flex;align-items:center;gap:10px;color:#aab4c2;font-size:11px;text-transform:uppercase;letter-spacing:.18em;font-weight:850}.eyebrow:before{content:"";width:32px;height:1px;background:linear-gradient(90deg,var(--red),var(--blue))}.hero h1{font-size:clamp(58px,8.3vw,112px);line-height:.84;letter-spacing:-.075em;margin:22px 0 28px;max-width:820px}.hero h1 span{display:block}.hero h1 .soft{color:#aeb8c6}.hero p{font-size:clamp(16px,1.5vw,20px);line-height:1.65;color:#98a4b4;max-width:610px;margin:0 0 32px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.btn{height:52px;padding:0 20px;border-radius:15px;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-size:14px;font-weight:850;cursor:pointer;transition:.2s}.btn:hover{transform:translateY(-2px)}.btn-light{background:#f4f6f9;color:#080a0e}.btn-dark{background:#111720;border-color:#2b3542}.btn-whats{background:var(--green);color:#05150a}.hero-meta{display:flex;gap:30px;margin-top:46px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);max-width:620px}.hero-meta strong{display:block;font-size:15px}.hero-meta span{display:block;color:#7d8999;font-size:12px;margin-top:5px}.showcase{min-height:560px;position:relative;display:grid;place-items:center}.showcase-card{width:min(100%,460px);aspect-ratio:.86;border-radius:34px;border:1px solid #252e3a;background:linear-gradient(145deg,#151d28,#0a0e14 68%);box-shadow:var(--shadow);position:relative;overflow:hidden}.showcase-card:before{content:"";position:absolute;width:330px;height:330px;border:1px solid rgba(255,255,255,.08);border-radius:50%;left:50%;top:45%;transform:translate(-50%,-50%);box-shadow:0 0 0 55px rgba(255,255,255,.016),0 0 0 110px rgba(255,255,255,.008)}.show-top{position:absolute;left:28px;right:28px;top:28px;display:flex;justify-content:space-between;color:#6e7a89;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:800}.show-main{position:absolute;inset:90px 34px 106px;display:grid;place-items:center;text-align:center}.show-main .big{font-size:clamp(64px,9vw,108px);font-weight:950;letter-spacing:-.08em;line-height:.78}.show-main .big .r{color:var(--red)}.show-main .big .b{color:var(--blue)}.show-main p{font-size:13px;color:#7f8a99;max-width:270px;margin:28px auto 0}.show-foot{position:absolute;left:28px;right:28px;bottom:28px;padding-top:20px;border-top:1px solid #26303c;display:flex;justify-content:space-between;gap:20px}.show-foot b{font-size:17px}.show-foot span{font-size:11px;color:#6f7a89}.float{position:absolute;border:1px solid #2b3542;background:rgba(13,18,25,.9);backdrop-filter:blur(12px);border-radius:13px;padding:11px 13px;font-size:11px;font-weight:850;box-shadow:0 14px 34px rgba(0,0,0,.22)}.float.red{left:-18px;top:27%;color:#ff6f82}.float.blue{right:-16px;bottom:20%;color:#79a9ff}
      .strip{border-top:1px solid #1a212b;border-bottom:1px solid #1a212b;background:#0a0e13}.strip-grid{display:grid;grid-template-columns:repeat(4,1fr)}.strip-item{padding:23px 24px;border-right:1px solid #1d2530;display:flex;align-items:center;gap:11px;color:#c7ced8;font-size:12px;font-weight:750}.strip-item:last-child{border-right:0}.dot{width:7px;height:7px;border-radius:50%;background:#647184;box-shadow:0 0 0 5px rgba(255,255,255,.025)}
      .section{padding:104px 0}.section.alt{background:#0a0e14;border-top:1px solid #171e27;border-bottom:1px solid #171e27}.section-head{display:grid;grid-template-columns:1fr auto;gap:26px;align-items:end;margin-bottom:34px}.section-head h2{font-size:clamp(36px,5vw,64px);line-height:.95;letter-spacing:-.055em;margin:10px 0 0;max-width:760px}.section-head p{max-width:430px;color:#8d99a9;line-height:1.65;margin:0;font-size:15px}.categories{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid #242d39;border-radius:24px;overflow:hidden;background:#0d1219}.cat{min-height:186px;border:0;border-right:1px solid #242d39;background:transparent;text-align:left;padding:24px;cursor:pointer;position:relative;transition:.2s}.cat:last-child{border-right:0}.cat:hover{background:#141b24}.cat .num{display:block;color:#606c7a;font-size:10px;letter-spacing:.16em;margin-bottom:54px}.cat strong{display:block;font-size:17px;margin-bottom:6px}.cat small{color:#788494}.cat:after{content:"↗";position:absolute;right:20px;top:18px;color:#536071;transition:.2s}.cat:hover:after{color:#fff;transform:translate(2px,-2px)}
      .tools{display:grid;grid-template-columns:minmax(260px,1fr) auto;gap:10px;margin-bottom:14px}.search{height:50px;border:1px solid #29333f;background:#10161e;border-radius:14px;display:flex;align-items:center;gap:11px;padding:0 15px;color:#8490a0}.search input{width:100%;border:0;outline:0;background:transparent;color:#fff}.search input::placeholder{color:#5e6a79}.select{height:50px;min-width:178px;border:1px solid #29333f;background:#10161e;color:#dce1e8;border-radius:14px;padding:0 14px;outline:0}.filters{display:flex;gap:8px;overflow:auto;padding:3px 0 18px;scrollbar-width:none}.filters::-webkit-scrollbar{display:none}.filter{white-space:nowrap;border:1px solid #28323d;background:#0e131a;color:#8e9aa9;border-radius:999px;padding:9px 13px;cursor:pointer;font-size:12px;font-weight:800}.filter:hover,.filter.active{color:#fff;background:#18202b;border-color:#445064}.result{font-size:12px;color:#6f7b8b;margin:3px 0 20px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}.card{border:1px solid #232d39;background:#0f151d;border-radius:20px;overflow:hidden;transition:.23s;min-width:0}.card:hover{transform:translateY(-4px);background:#121a23;border-color:#3a4654}.card-art{height:190px;position:relative;padding:20px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(145deg,#151d28,#0b1017)}.card-art:before{content:"";position:absolute;width:130px;height:130px;border:1px solid rgba(255,255,255,.05);border-radius:50%;right:-30px;bottom:-32px}.tag{align-self:flex-start;border:1px solid #303b49;border-radius:999px;padding:6px 9px;color:#8f9bad;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.code{font-size:11px;color:#586575;letter-spacing:.12em;text-transform:uppercase}.art-title{font-size:28px;font-weight:900;letter-spacing:-.055em;line-height:.95;max-width:180px;color:#dfe4eb}.card-body{padding:18px}.card h3{font-size:15px;line-height:1.35;margin:0 0 16px;min-height:41px}.price-row{display:flex;align-items:end;justify-content:space-between;gap:12px}.price{font-size:20px;font-weight:900;letter-spacing:-.04em}.add{width:42px;height:42px;border:1px solid #2d3845;background:#161e28;border-radius:12px;display:grid;place-items:center;cursor:pointer}.add:hover{background:#f3f5f8;color:#080a0d}.load{display:flex;justify-content:center;margin-top:26px}.empty{grid-column:1/-1;padding:64px 20px;text-align:center;border:1px dashed #293440;border-radius:18px;color:#748192}
      .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:68px;align-items:center}.about-copy h2{font-size:clamp(42px,6vw,76px);line-height:.93;letter-spacing:-.06em;margin:14px 0 24px}.about-copy p{color:#909cad;line-height:1.75;max-width:590px}.about-panel{border:1px solid #26313d;border-radius:28px;background:#0e141c;padding:30px}.feature{display:grid;grid-template-columns:48px 1fr;gap:15px;padding:20px 0;border-bottom:1px solid #202a35}.feature:last-child{border-bottom:0}.feature-ic{width:48px;height:48px;border:1px solid #2e3946;border-radius:15px;display:grid;place-items:center;color:#cdd5df}.feature strong{display:block;margin:3px 0 6px}.feature span{color:#788596;font-size:13px;line-height:1.55}.cta{padding:42px;border-radius:30px;border:1px solid #26313e;background:linear-gradient(120deg,#111925,#0b1017);display:flex;align-items:center;justify-content:space-between;gap:34px}.cta h3{font-size:clamp(28px,4vw,48px);letter-spacing:-.05em;margin:0 0 10px}.cta p{margin:0;color:#8491a2}.footer{padding:36px 0 110px;color:#707c8c;font-size:12px}.footer-in{display:flex;justify-content:space-between;gap:24px;border-top:1px solid #1c2430;padding-top:24px}
      .drawer,.mobile-panel{position:fixed;z-index:100;top:0;bottom:0;width:min(430px,92vw);background:#0c1118;border-left:1px solid #28323e;right:0;transform:translateX(105%);transition:.28s ease;box-shadow:-30px 0 80px rgba(0,0,0,.42)}.drawer.open,.mobile-panel.open{transform:none}.mobile-panel{width:min(330px,86vw)}.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(4px);z-index:90;opacity:0;pointer-events:none;transition:.25s}.backdrop.show{opacity:1;pointer-events:auto}.drawer-head{height:80px;padding:0 22px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #202a35}.drawer-body{height:calc(100% - 170px);overflow:auto;padding:18px 22px}.drawer-foot{height:90px;border-top:1px solid #202a35;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}.drawer-total span{display:block;color:#758192;font-size:11px}.drawer-total strong{font-size:20px}.cart-line{display:grid;grid-template-columns:1fr auto;gap:15px;padding:17px 0;border-bottom:1px solid #1f2833}.cart-line h4{font-size:13px;margin:0 0 5px}.cart-line small{color:#728092}.qty{display:flex;gap:7px;margin-top:11px}.qty button{width:30px;height:30px;border:1px solid #2a3542;background:#131b25;border-radius:9px;display:grid;place-items:center;cursor:pointer}.empty-cart{text-align:center;padding:60px 12px;color:#718091}.mobile-nav{padding:100px 22px 22px;display:grid;gap:6px}.mobile-nav a{padding:14px 12px;border-bottom:1px solid #1f2934;font-weight:800}.mobile-close{position:absolute;right:20px;top:20px}.toast{position:fixed;z-index:140;left:50%;bottom:28px;transform:translate(-50%,22px);background:#f5f7f9;color:#080a0d;border-radius:12px;padding:12px 16px;font-size:12px;font-weight:850;opacity:0;pointer-events:none;transition:.22s}.toast.show{opacity:1;transform:translate(-50%,0)}
      .age{position:fixed;z-index:200;inset:0;background:#07090d;display:grid;place-items:center;padding:24px}.age.hidden{display:none}.age-box{width:min(520px,100%);border:1px solid #29333f;border-radius:28px;background:#0f151d;padding:34px;box-shadow:var(--shadow)}.age-mark{font-size:56px;font-weight:950;letter-spacing:-.08em;margin-bottom:20px}.age-box h2{font-size:34px;letter-spacing:-.04em;margin:0 0 12px}.age-box p{color:#8996a7;line-height:1.65;margin:0 0 24px}.age-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.age-note{display:block;color:#667385;font-size:11px;margin-top:16px;line-height:1.5}
      [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}[data-reveal].visible{opacity:1;transform:none}
      @media (max-width:1000px){.nav{display:none}.menu{display:inline-flex}.hero-grid{grid-template-columns:1fr;gap:46px}.showcase{min-height:auto}.showcase-card{max-width:520px}.categories{grid-template-columns:repeat(2,1fr)}.cat{border-bottom:1px solid #242d39}.cat:nth-child(2n){border-right:0}.grid{grid-template-columns:repeat(3,1fr)}.strip-grid{grid-template-columns:repeat(2,1fr)}.strip-item:nth-child(2){border-right:0}.strip-item:nth-child(-n+2){border-bottom:1px solid #1d2530}.about-grid{grid-template-columns:1fr;gap:34px}}
      @media (max-width:720px){.wrap{width:min(100% - 24px,var(--max))}.header-in{height:70px}.brand{min-width:0}.brand-logo{width:42px;height:42px}.wordmark{font-size:18px}.actions .cart-label{display:none}.hero{padding:116px 0 58px;min-height:auto}.hero-grid{gap:36px}.hero h1{font-size:clamp(54px,18vw,82px)}.hero-meta{gap:18px;justify-content:space-between}.showcase{display:none}.section{padding:72px 0}.section-head{grid-template-columns:1fr;gap:14px}.section-head h2{font-size:42px}.categories{grid-template-columns:1fr 1fr}.cat{min-height:156px;padding:20px}.cat .num{margin-bottom:40px}.tools{grid-template-columns:1fr}.select{width:100%}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.card-art{height:155px;padding:15px}.art-title{font-size:22px}.card-body{padding:14px}.card h3{font-size:13px}.price{font-size:17px}.add{width:38px;height:38px}.strip-grid{grid-template-columns:1fr 1fr}.strip-item{padding:17px 14px}.about-copy h2{font-size:48px}.about-panel{padding:20px}.cta{padding:28px;display:grid}.footer-in{display:grid}.age-box{padding:26px}.age-actions{grid-template-columns:1fr}}
      @media (max-width:420px){.grid{grid-template-columns:1fr}.card-art{height:176px}.categories{grid-template-columns:1fr}.cat{border-right:0}.hero-meta{display:grid;grid-template-columns:1fr 1fr}.header .wordmark{display:none}}
      @media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}[data-reveal]{opacity:1!important;transform:none!important;transition:none!important}.card,.btn,.icon-btn{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function renderApp() {
    document.title = `${CONFIG.storeName} | Tabacaria`;
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="header" id="header">
        <div class="wrap header-in">
          <a class="brand" href="#inicio" aria-label="Narguilé-Lê início">
            <img class="brand-logo" id="brandLogo" src="./logo-mascote.png" alt="Mascote Narguilé-Lê">
            <span class="wordmark"><span class="r">Nar</span><span class="b">guilé-</span><span class="r">Lê</span></span>
          </a>
          <nav class="nav" aria-label="Navegação principal">
            <a href="#inicio">Início</a><a href="#categorias">Categorias</a><a href="#produtos">Produtos</a><a href="#sobre">Sobre</a>
          </nav>
          <div class="actions">
            <button class="icon-btn cart-open" aria-label="Abrir carrinho">${icon('cart')}<span class="cart-label">Carrinho</span><span class="cart-count">0</span></button>
            <button class="icon-btn menu" id="menuOpen" aria-label="Abrir menu">${icon('menu')}</button>
          </div>
        </div>
      </header>

      <main>
        <section class="hero" id="inicio">
          <div class="wrap hero-grid">
            <div data-reveal>
              <div class="eyebrow">Hookah lounge • Loja online</div>
              <h1><span>Seu ritual.</span><span class="soft">Seu estilo.</span><span>Narguilé-Lê.</span></h1>
              <p>Catálogo direto, atendimento rápido e pedido simples pelo WhatsApp. Encontre narguilés, essências, carvão, acessórios e bebidas em poucos cliques.</p>
              <div class="hero-actions">
                <a class="btn btn-light" href="#produtos">Ver produtos ${icon('arrow',18)}</a>
                <a class="btn btn-dark" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp',18)} Falar no WhatsApp</a>
              </div>
              <div class="hero-meta">
                <div><strong>Catálogo atualizado</strong><span>Dados via Supabase</span></div>
                <div><strong>Pedido rápido</strong><span>Finalização no WhatsApp</span></div>
                <div><strong>Atendimento local</strong><span>${CONFIG.city}</span></div>
              </div>
            </div>
            <div class="showcase" data-reveal>
              <div class="showcase-card">
                <div class="show-top"><span>Narguilé-Lê</span><span>18+</span></div>
                <div class="show-main"><div><div class="big"><span class="r">N</span><span class="b">L</span></div><p>Uma loja pensada para encontrar o que você quer sem perder tempo.</p></div></div>
                <div class="show-foot"><div><b>Escolha. Adicione.</b><br><span>Finalize direto no WhatsApp.</span></div><span>ONLINE</span></div>
              </div>
              <span class="float red">CATÁLOGO AO VIVO</span><span class="float blue">PEDIDO DIRETO</span>
            </div>
          </div>
        </section>

        <section class="strip">
          <div class="wrap strip-grid">
            <div class="strip-item"><span class="dot"></span>Catálogo conectado</div>
            <div class="strip-item"><span class="dot"></span>Carrinho salvo</div>
            <div class="strip-item"><span class="dot"></span>Pedido pelo WhatsApp</div>
            <div class="strip-item"><span class="dot"></span>Uso exclusivo para maiores de 18</div>
          </div>
        </section>

        <section class="section" id="categorias">
          <div class="wrap">
            <div class="section-head" data-reveal><div><div class="eyebrow">Explore a loja</div><h2>Encontre por categoria.</h2></div><p>Selecione uma categoria e vá direto aos itens que interessam.</p></div>
            <div class="categories" id="categories" data-reveal></div>
          </div>
        </section>

        <section class="section alt" id="produtos">
          <div class="wrap">
            <div class="section-head" data-reveal><div><div class="eyebrow">Catálogo</div><h2>Produtos disponíveis.</h2></div><p>Pesquise, filtre e adicione ao carrinho. O pedido é enviado para confirmação no WhatsApp.</p></div>
            <div class="tools" data-reveal>
              <label class="search">${icon('search',18)}<input id="searchInput" type="search" placeholder="Buscar produto, código ou categoria..." autocomplete="off"></label>
              <select class="select" id="sortSelect" aria-label="Ordenar produtos"><option value="default">Ordenar: padrão</option><option value="az">Nome A–Z</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select>
            </div>
            <div class="filters" id="filters"></div>
            <div class="result" id="resultInfo">Carregando catálogo...</div>
            <div class="grid" id="productGrid"><div class="empty">Carregando produtos...</div></div>
            <div class="load"><button class="btn btn-dark" id="loadMore" hidden>Mostrar mais</button></div>
          </div>
        </section>

        <section class="section" id="sobre">
          <div class="wrap about-grid">
            <div class="about-copy" data-reveal><div class="eyebrow">Narguilé-Lê</div><h2>Compra simples. Atendimento humano.</h2><p>O site foi desenhado para ser rápido no celular e no computador. Você monta o carrinho, confere o valor estimado e envia o pedido para o atendimento confirmar disponibilidade e entrega.</p></div>
            <div class="about-panel" data-reveal>
              <div class="feature"><div class="feature-ic">${icon('bag')}</div><div><strong>Catálogo em tempo real</strong><span>Os produtos ativos são carregados diretamente do banco da loja.</span></div></div>
              <div class="feature"><div class="feature-ic">${icon('shield')}</div><div><strong>Sem cadastro obrigatório</strong><span>Você navega e monta o pedido sem criar conta.</span></div></div>
              <div class="feature"><div class="feature-ic">${icon('truck')}</div><div><strong>Confirmação no atendimento</strong><span>Disponibilidade, entrega e detalhes finais são confirmados pelo WhatsApp.</span></div></div>
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="wrap"><div class="cta" data-reveal><div><h3>Quer fazer seu pedido agora?</h3><p>Abra o carrinho ou fale direto com a equipe.</p></div><a class="btn btn-whats" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp',18)} Abrir WhatsApp</a></div></div>
        </section>
      </main>

      <footer class="footer"><div class="wrap footer-in"><span>© ${new Date().getFullYear()} Narguilé-Lê.</span><span>Conteúdo destinado a maiores de 18 anos.</span></div></footer>

      <div class="backdrop" id="backdrop"></div>
      <aside class="drawer" id="cartDrawer" aria-label="Carrinho">
        <div class="drawer-head"><strong>Seu carrinho</strong><button class="icon-btn" id="cartClose" aria-label="Fechar carrinho">${icon('close')}</button></div>
        <div class="drawer-body" id="cartBody"></div>
        <div class="drawer-foot"><div class="drawer-total"><span>Total estimado</span><strong id="cartTotal">R$ 0,00</strong></div><button class="btn btn-whats" id="checkout">Finalizar</button></div>
      </aside>
      <aside class="mobile-panel" id="mobilePanel"><button class="icon-btn mobile-close" id="menuClose" aria-label="Fechar menu">${icon('close')}</button><nav class="mobile-nav"><a href="#inicio">Início</a><a href="#categorias">Categorias</a><a href="#produtos">Produtos</a><a href="#sobre">Sobre</a><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></nav></aside>
      <div class="toast" id="toast"></div>

      <div class="age ${localStorage.getItem('nl_age_ok') === '1' ? 'hidden' : ''}" id="ageGate">
        <div class="age-box"><div class="age-mark"><span style="color:var(--red)">18</span><span style="color:var(--blue)">+</span></div><h2>Conteúdo para maiores de 18 anos.</h2><p>Confirme sua idade para acessar o catálogo da Narguilé-Lê.</p><div class="age-actions"><button class="btn btn-light" id="ageYes">Tenho 18 anos ou mais</button><button class="btn btn-dark" id="ageNo">Sair</button></div><span class="age-note">Ao continuar, você declara ter idade legal para visualizar este conteúdo.</span></div>
      </div>
    `;
  }

  function setupLogo() {
    const logo = $('#brandLogo');
    logo.addEventListener('load', () => logo.classList.add('ready'));
    logo.addEventListener('error', () => logo.remove());
    if (logo.complete && logo.naturalWidth) logo.classList.add('ready');
  }

  async function fetchProducts() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const url = `${CONFIG.supabaseUrl}/rest/v1/products?select=id,codigo,name,price,category_raw,category,slug&is_active=eq.true&order=id.asc&limit=1000`;
      const response = await fetch(url, { headers: { apikey: CONFIG.supabaseKey }, signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      state.products = Array.isArray(rows) ? rows.map(row => ({ ...row, price: Number(row.price) || 0 })) : [];
      renderCategories();
      renderFilters();
      renderProducts();
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
      $('#resultInfo').textContent = 'Catálogo temporariamente indisponível';
      $('#productGrid').innerHTML = `<div class="empty"><strong>Não foi possível carregar os produtos.</strong><br><br><span>Tente atualizar a página ou fale com a loja pelo WhatsApp.</span><br><br><a class="btn btn-whats" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp',18)} Abrir WhatsApp</a></div>`;
      $('#categories').innerHTML = '<div class="empty">As categorias aparecerão aqui quando o catálogo estiver disponível.</div>';
    } finally {
      clearTimeout(timeout);
    }
  }

  function categoryCounts() {
    return state.products.reduce((acc, product) => {
      const category = product.category || product.category_raw || 'Outros';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }

  function renderCategories() {
    const counts = categoryCounts();
    const preferred = ['Narguilés', 'Essências', 'Carvão', 'Acessórios', 'Bebidas'];
    const available = [...new Set([...preferred.filter(c => counts[c]), ...Object.keys(counts)])].slice(0, 5);
    $('#categories').innerHTML = available.map((category, index) => `
      <button class="cat" data-category="${escapeHTML(category)}"><span class="num">0${index + 1}</span><strong>${escapeHTML(category)}</strong><small>${counts[category]} ${counts[category] === 1 ? 'produto' : 'produtos'}</small></button>
    `).join('') || '<div class="empty">Nenhuma categoria disponível.</div>';
    $$('[data-category]').forEach(button => button.addEventListener('click', () => {
      state.category = button.dataset.category;
      state.visible = 24;
      $('#produtos').scrollIntoView({ behavior: 'smooth' });
      renderFilters();
      renderProducts();
    }));
  }

  function renderFilters() {
    const counts = categoryCounts();
    const categories = Object.keys(counts).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    $('#filters').innerHTML = [`<button class="filter ${state.category ? '' : 'active'}" data-filter="">Todos (${state.products.length})</button>`, ...categories.map(category => `<button class="filter ${state.category === category ? 'active' : ''}" data-filter="${escapeHTML(category)}">${escapeHTML(category)} (${counts[category]})</button>`)].join('');
    $$('.filter').forEach(button => button.addEventListener('click', () => {
      state.category = button.dataset.filter;
      state.visible = 24;
      renderFilters();
      renderProducts();
    }));
  }

  function filteredProducts() {
    let list = state.products.filter(product => {
      const category = product.category || product.category_raw || 'Outros';
      const matchCategory = !state.category || category === state.category;
      const haystack = normalize(`${product.name} ${product.codigo} ${category}`);
      const matchQuery = !state.query || haystack.includes(normalize(state.query));
      return matchCategory && matchQuery;
    });
    if (state.sort === 'az') list.sort((a, b) => String(a.name).localeCompare(String(b.name), 'pt-BR'));
    if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
    return list;
  }

  function productCard(product) {
    const category = product.category || product.category_raw || 'Produto';
    const shortName = String(product.name || 'Produto').split(/\s+/).slice(0, 3).join(' ');
    return `
      <article class="card" data-reveal>
        <div class="card-art"><span class="tag">${escapeHTML(category)}</span><div class="art-title">${escapeHTML(shortName)}</div><span class="code">Cód. ${escapeHTML(product.codigo || product.id)}</span></div>
        <div class="card-body"><h3>${escapeHTML(product.name || 'Produto')}</h3><div class="price-row"><div class="price">${money(product.price)}</div><button class="add" data-add="${escapeHTML(product.id)}" aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">${icon('plus',18)}</button></div></div>
      </article>`;
  }

  function renderProducts() {
    const list = filteredProducts();
    const visible = list.slice(0, state.visible);
    $('#resultInfo').textContent = `${list.length} ${list.length === 1 ? 'produto encontrado' : 'produtos encontrados'} • ${state.products.length} no catálogo`;
    $('#productGrid').innerHTML = visible.length ? visible.map(productCard).join('') : '<div class="empty">Nenhum produto encontrado com esse filtro.</div>';
    const loadMore = $('#loadMore');
    loadMore.hidden = state.visible >= list.length;
    $$('[data-add]').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.add)));
    setupReveal();
  }

  function addToCart(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    toast('Produto adicionado ao carrinho');
  }

  function cartItems() {
    return Object.entries(state.cart).map(([id, quantity]) => ({ product: state.products.find(item => String(item.id) === String(id)), quantity })).filter(item => item.product && item.quantity > 0);
  }

  function renderCart() {
    const items = cartItems();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    $$('.cart-count').forEach(el => el.textContent = count);
    $('#cartTotal').textContent = money(total);
    $('#cartBody').innerHTML = items.length ? items.map(({ product, quantity }) => `
      <div class="cart-line"><div><h4>${quantity}x ${escapeHTML(product.name)}</h4><small>${money(product.price)} • Cód. ${escapeHTML(product.codigo || product.id)}</small><div class="qty"><button data-qty="${escapeHTML(product.id)}" data-delta="-1">${icon('minus',14)}</button><button data-qty="${escapeHTML(product.id)}" data-delta="1">${icon('plus',14)}</button></div></div><strong>${money(product.price * quantity)}</strong></div>
    `).join('') : `<div class="empty-cart">${icon('cart',28)}<h3>Carrinho vazio</h3><p>Adicione produtos do catálogo.</p></div>`;
    $$('[data-qty]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.qty;
      state.cart[id] = (state.cart[id] || 0) + Number(button.dataset.delta);
      if (state.cart[id] <= 0) delete state.cart[id];
      saveCart();
    }));
  }

  function checkout() {
    const items = cartItems();
    if (!items.length) return toast('Adicione algum produto primeiro');
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const message = [
      `Olá! Quero fazer um pedido pelo site da ${CONFIG.storeName}:`,
      '',
      ...items.map(({ product, quantity }) => `• ${quantity}x ${product.name} — ${money(product.price)}`),
      '',
      `Total estimado: ${money(total)}`,
      '',
      'Pode confirmar disponibilidade e delivery?'
    ].join('\n');
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__nlToast);
    window.__nlToast = setTimeout(() => el.classList.remove('show'), 1700);
  }

  function openLayer(layer) {
    layer.classList.add('open');
    $('#backdrop').classList.add('show');
    document.body.classList.add('lock');
  }

  function closeLayers() {
    $('#cartDrawer').classList.remove('open');
    $('#mobilePanel').classList.remove('open');
    $('#backdrop').classList.remove('show');
    document.body.classList.remove('lock');
  }

  function setupEvents() {
    window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', window.scrollY > 12), { passive: true });
    $$('.cart-open').forEach(button => button.addEventListener('click', () => openLayer($('#cartDrawer'))));
    $('#cartClose').addEventListener('click', closeLayers);
    $('#backdrop').addEventListener('click', closeLayers);
    $('#menuOpen').addEventListener('click', () => openLayer($('#mobilePanel')));
    $('#menuClose').addEventListener('click', closeLayers);
    $$('.mobile-nav a').forEach(link => link.addEventListener('click', closeLayers));
    $('#searchInput').addEventListener('input', event => { state.query = event.target.value; state.visible = 24; renderProducts(); });
    $('#sortSelect').addEventListener('change', event => { state.sort = event.target.value; renderProducts(); });
    $('#loadMore').addEventListener('click', () => { state.visible += 24; renderProducts(); });
    $('#checkout').addEventListener('click', checkout);
    $('#ageYes').addEventListener('click', () => { localStorage.setItem('nl_age_ok', '1'); $('#ageGate').classList.add('hidden'); });
    $('#ageNo').addEventListener('click', () => { window.location.href = 'https://www.google.com/'; });
  }

  function setupReveal() {
    const items = $$('[data-reveal]:not(.visible)');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
    items.forEach(item => observer.observe(item));
  }

  function init() {
    injectStyles();
    renderApp();
    setupLogo();
    setupEvents();
    renderCart();
    setupReveal();
    fetchProducts();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
