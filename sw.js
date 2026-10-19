const C='itimer-v2',F=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
if(q.mode==='navigate'){
// network first (with 3s timeout) so new versions show up right away; cache when offline
const net=fetch(q,{cache:'no-cache'}).then(n=>{if(n.ok){const c=n.clone();caches.open(C).then(x=>x.put('./index.html',c))}return n});
const cached=()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'));
e.respondWith(Promise.race([net,new Promise((_,j)=>setTimeout(j,3000))]).catch(()=>cached().then(r=>r||net)));return}
e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(n=>{const c=n.clone();caches.open(C).then(x=>x.put(q,c));return n})))});
