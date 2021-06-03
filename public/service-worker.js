console.log('this is the service worker!')

//Week 18 stu mini project as a guide 
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/manifest.webmanifest",
    "/styles.css",
    "/db.js",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"


]


const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

//install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => {
            console.log('files have been pre-cached');
            return cache.addAll(FILES_TO_CACHE);
        })
        //activated after install
        .then(self.skipWaiting())
    );
  });

  //activate handler to clean up old caches 

  self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME]
    event.waitUntil(
        caches
        .keys()
        .then(cacheNames => {
          // return array of cache names that are old to delete
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
         );
        })
        .then(cachesToDelete => {
           return Promise.all(
            cachesToDelete.map(chacesToDelete => {
                return caches.delete(chacesToDelete);
            })
         )
        })
        .then(() => self.clients.claim())
    )
})


self.addEventListener("fetch", function(event){

    if (event.request.url.includes("/api/")) {
        //if involves api 
        event.respondWith(
            caches.open(RUNTIME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            console.log('status 200 clone/store data')
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    }).catch(err => {
                        console.log('status offline')
                        return cache.match(event.request);
                    });
            }).catch((error) => console.log(error))
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
