const CACHE_NAME = 'geocalcul-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap'
];

// Instal·lació: Guardem els fitxers a la memòria cau (cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache oberta: Guardant recursos per a ús offline');
      return cache.addAll(ASSETS);
    })
  );
});

// Activació: Netegem versions antigues de la cache si cal
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Netejant cache antiga');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estratègia "Cache First": Si el recurs està a la cache, l'entreguem. 
// Si no, anem a buscar-lo a la xarxa.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});