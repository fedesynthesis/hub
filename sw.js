/* Hub service worker — solo il guscio (le app dentro gli iframe hanno i loro SW) */
const CACHE='hub-v2';
const CORE=['./','./index.html','./manifest.json','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;              // le app negli iframe si gestiscono da sole
  if(!url.pathname.startsWith('/hub/')) return;         // fuori dal guscio: nessuna intromissione

  const accept=req.headers.get('accept')||'';
  const isDoc = req.mode==='navigate' || req.destination==='document' || accept.includes('text/html');
  if(isDoc){                                            // documento: sempre network-first
    e.respondWith(
      fetch(req).then(r=>{const cl=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cl));return r})
                .catch(()=>caches.match('./index.html').then(c=>c||caches.match(req)))
    );
    return;
  }
  e.respondWith(caches.match(req).then(c=>c||fetch(req)));
});
