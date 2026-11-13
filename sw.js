/* keeps the student page on the phone so it opens on a weak or missing connection */
const C='exam-v2';const FILES=['./','./index.html','./config.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('admin.html'))return;
  e.respondWith(new Promise(res=>{let done=false;const fromCache=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'));
    const t=setTimeout(()=>{fromCache().then(r=>{if(r&&!done){done=true;res(r)}})},3500);
    fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}if(!done){done=true;clearTimeout(t);res(r)}}).catch(()=>{clearTimeout(t);fromCache().then(r=>{if(!done){done=true;res(r||Response.error())}})})}))});
