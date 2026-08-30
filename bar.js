/* Barra Hub — striscia in basso per passare da un'app all'altra, dentro ogni app.
   Niente iframe: ogni app resta sé stessa (su iPhone le cornici non scorrono col dito).
   Si include con:  <script src="/hub/bar.js" defer></script>  */
(function(){
  if (window.top !== window.self) return;          // dentro una cornice non serve
  if (document.getElementById('hubbar')) return;

  var H = 52;                                       // altezza barra
  var APPS = [
    { k:'tempo',   name:'TEMPO',  color:'#b8492c', path:'/tempo/',
      icon:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 12.5l2.5 2.5L16 9"/>' },
    { k:'cicogna', name:'Cicogna',color:'#d8688a', path:'/Cicogna2/',
      icon:'<path d="M12 20.5S4 15.5 4 9.8C4 7 6 5.3 8.2 5.3c1.6 0 3 .9 3.8 2.3.8-1.4 2.2-2.3 3.8-2.3C20 5.3 20 7 20 9.8c0 5.7-8 10.7-8 10.7z"/>' },
    { k:'migross', name:'Spesa',  color:'#6b8f71', path:'/migro/',
      icon:'<path d="M3 4h2.2l2 12h10.2l2-8.5H6.5"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>' }
  ];

  var here = location.pathname.toLowerCase();
  var current = null;
  APPS.forEach(function(a){ if (here.indexOf(a.path.toLowerCase()) === 0) current = a.k; });

  document.body.classList.add('hub');               // le app possono adattarsi (vedi TEMPO)
  /* TEMPO ha già una barra in basso: gli faccio usare il suo layout con le sezioni
     nella striscia verticale a destra, così non si impilano due barre. */
  if (current === 'tempo') document.body.classList.add('embed');

  var css = ''
    /* reset: ogni app ha font e interlinea propri, qui vanno neutralizzati
       o la barra risulta impaginata in modo diverso da un'app all'altra */
    + '#hubbar,#hubbar *{box-sizing:border-box;margin:0;padding:0;border:0;'
    + 'font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-style:normal;'
    + 'line-height:normal;letter-spacing:normal;text-transform:none;text-indent:0;'
    + 'vertical-align:baseline;background:none;text-decoration:none}'
    + '#hubbar{position:fixed;left:0;right:0;bottom:0;height:calc(' + H + 'px + env(safe-area-inset-bottom));'
    + 'z-index:2147483000;display:flex;align-items:stretch;padding-bottom:env(safe-area-inset-bottom);'
    + 'background:rgba(250,249,245,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);'
    + 'border-top:1px solid rgba(0,0,0,.09)}'
    + '#hubbar a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;'
    + '-webkit-tap-highlight-color:transparent}'
    + '#hubbar a svg{display:block;width:21px;height:21px;flex:none;fill:none;stroke:#9a938a;stroke-width:2;'
    + 'stroke-linecap:round;stroke-linejoin:round}'
    + '#hubbar a span{display:block;height:12px;font-size:10px;line-height:12px;font-weight:700;color:#9a938a;'
    + 'letter-spacing:.01em;white-space:nowrap}'
    + '#hubbar a.on svg{stroke:var(--hubc)}#hubbar a.on span{color:var(--hubc)}'
    + 'body{padding-bottom:calc(' + H + 'px + env(safe-area-inset-bottom))!important}'
    + '@media (prefers-color-scheme:dark){#hubbar{background:rgba(28,26,21,.96);border-top-color:rgba(255,255,255,.12)}'
    + '#hubbar a svg{stroke:#8b8378}#hubbar a span{color:#8b8378}}';

  /* elementi ancorati in basso che altrimenti finirebbero sotto la barra, app per app */
  var lift = 'calc(' + H + 'px + env(safe-area-inset-bottom))';
  var perApp = {
    tempo:   '.nav{bottom:' + lift + '!important}'
           + '.fab{bottom:calc(' + H + 'px + var(--nav-h,64px) + 18px + env(safe-area-inset-bottom))!important}'
           + '.sheet,.wiz{bottom:' + lift + '!important}'
           + '.toast{bottom:calc(' + H + 'px + var(--nav-h,64px) + 26px + env(safe-area-inset-bottom))!important}',
    cicogna: '.foot{bottom:' + lift + '!important}'
           + '.toast{bottom:calc(' + H + 'px + 84px)!important}',
    migross: '#fabContainer{bottom:' + lift + '!important}'
  };
  if (current && perApp[current]) css += perApp[current];

  var st = document.createElement('style');
  st.id = 'hubbar-style';
  st.textContent = css;
  document.head.appendChild(st);

  var nav = document.createElement('nav');
  nav.id = 'hubbar';
  nav.setAttribute('aria-label', 'Le mie app');
  nav.innerHTML = APPS.map(function(a){
    var on = a.k === current;
    return '<a href="' + a.path + '" aria-label="' + a.name + '"'
      + (on ? ' class="on" aria-current="page" style="--hubc:' + a.color + '"' : '')
      + '><svg viewBox="0 0 24 24">' + a.icon + '</svg><span>' + a.name + '</span></a>';
  }).join('');
  document.body.appendChild(nav);
})();
