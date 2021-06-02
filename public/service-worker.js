const FILES_TO_CACHE = [
    `/`,
    `/index.html`,
    '/index.js',
    `/icons/icon-192x192.png`
    `/icons/icon-512x512.png`
    `/manifest.webmanifest`
    `/styles.css`
    `https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css`
    `https://cdn.jsdelivr.net/npm/chart.js@2.8.0`


]


const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => {
            console.log('files have been pre-cached');
            return cache.addAll(FILES_TO_CACHE);
        })
        .then(self.skipWaiting())
    );
  });