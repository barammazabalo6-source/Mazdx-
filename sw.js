const CACHE_NAME = "mazdx-shop-v1";
const CORE_ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(CORE_ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var url = new URL(event.request.url);
  // Never cache the live product data - always go to network for the sheet
  if (url.hostname.indexOf("google.com") > -1 || url.hostname.indexOf("googleusercontent.com") > -1){
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
