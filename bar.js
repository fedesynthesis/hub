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
    { k:'nido',    name:'Nido',   color:'#4fa269', path:'/Cicogna2/',
      icon:'<path d="M12 20c-4.4 0-7.6-2.8-7.6-6.4 0-2.2 1.2-3.8 3-4.8.6-2.2 2.2-3.6 4.6-3.6s4 1.4 4.6 3.6c1.8 1 3 2.6 3 4.8 0 3.6-3.2 6.4-7.6 6.4z"/><circle cx="9.4" cy="13" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.6" cy="13" r="1.1" fill="currentColor" stroke="none"/><path d="M10.4 16.2c1 .9 2.2.9 3.2 0"/><path d="M12 6.1c.2-1.2 1-1.9 2-1.8"/>' },
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
    + '#hubbar a svg{stroke:#8b8378}#hubbar a span{color:#8b8378}}'
    /* iOS ignora l'orientamento dichiarato nel manifest: in orizzontale, sui telefoni,
       copro l'app e chiedo di rimettere in verticale (su monitor non compare mai) */
    + '#hubrot{display:none}'
    + '@media (orientation:landscape) and (max-height:500px) and (pointer:coarse){'
    + '#hubrot{display:flex;position:fixed;inset:0;z-index:2147483600;flex-direction:column;'
    + 'align-items:center;justify-content:center;gap:14px;background:#faf9f5;color:#4a443a;'
    + 'font-family:-apple-system,system-ui,sans-serif;text-align:center;padding:24px}'
    + '#hubrot b{font-size:17px;font-weight:600}#hubrot span{font-size:14px;opacity:.75}'
    + '#hubrot svg{width:44px;height:44px;fill:none;stroke:#9a938a;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}'
    + '#hubbar{display:none}}'
    + '@media (orientation:landscape) and (max-height:500px) and (pointer:coarse){'
    + 'body{padding-bottom:0!important}}';

  /* elementi ancorati in basso che altrimenti finirebbero sotto la barra, app per app */
  var lift = 'calc(' + H + 'px + env(safe-area-inset-bottom))';
  var perApp = {
    tempo:   '.nav{bottom:' + lift + '!important}'
           + '.fab{bottom:calc(' + H + 'px + var(--nav-h,64px) + 18px + env(safe-area-inset-bottom))!important}'
           + '.sheet,.wiz{bottom:' + lift + '!important}'
           + '.toast{bottom:calc(' + H + 'px + var(--nav-h,64px) + 26px + env(safe-area-inset-bottom))!important}',
    nido:    '.toast{bottom:calc(' + H + 'px + 44px)!important}'
           // il foglio di inserimento non deve finire sotto la barra
           + '.sheet{padding-bottom:calc(28px + ' + H + 'px + env(safe-area-inset-bottom))!important}'
           + '.sheet{max-height:calc(88dvh - ' + H + 'px)!important}',
    migross: '#fabContainer{bottom:' + lift + '!important}'
           // i pannelli che salgono dal basso: i tasti in fondo finivano sotto la barra
           + '.modal,.vcard{padding-bottom:calc(28px + ' + H + 'px + env(safe-area-inset-bottom))!important}'
           + '.modal,.vcard{max-height:calc(88dvh - ' + H + 'px)!important}'
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

  var rot = document.createElement('div');
  rot.id = 'hubrot';
  rot.innerHTML = '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/>'
    + '<path d="M3.5 15a9 9 0 0 0 3 5"/><path d="M20.5 9a9 9 0 0 0-3-5"/></svg>'
    + '<b>Gira il telefono in verticale</b><span>L\'app si usa in verticale</span>';
  document.body.appendChild(rot);
})();
