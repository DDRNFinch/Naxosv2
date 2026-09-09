const CACHE='naxosv2-v4';
const CORE=[
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './naxosv2-main-task-structure.json',
  './data/course-metadata.json',
  './data/6570-05/config.json',
  './data/6570-05/source/course-core.js',
  './data/6570-05/source/unit-102.js',
  './data/6570-05/source/units-234-235.js',
  './data/6570-05/source/unit-238.js',
  './data/6570-05/source/units-303-300-502.js',
  './data/6570-05/source/unit-313.js',
  './data/6570-05/source/unit-690.js',
  './data/6570-05/source/unit-701.js',
  './data/6570-05/source/unit-828.js',
  './data/6570-05/source/unit-837.js',
  './data/6570-05/normalise.js',
  './icons/icon.svg',
  './icons/icon-maskable.svg'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
