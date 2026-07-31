/**
 * service-worker.js
 * Cache-first strategy for app shell + assets so AME Toolbox works offline.
 * Bump CACHE_VERSION whenever any cached file changes so old caches get purged.
 */

const CACHE_VERSION = "ame-toolbox-v1";
const SCOPE = self.registration.scope; // works correctly under GitHub Pages subpaths too

// Build absolute URLs relative to the service worker's registration scope
const CORE_ASSETS = [
  "",
  "index.html",
  "manifest.json",
  "css/main.css",
  "css/responsive.css",
  "js/app.js",
  "js/search.js",
  "js/favorites.js",
  "js/history.js",
  "js/measurement.js",
  "js/torque.js",
  "js/electrical.js",
  "js/general.js",
  "data/units.js",
  "data/aliases.js",
  "pages/measurement.html",
  "pages/torque.html",
  "pages/electrical.html",
  "pages/general.html",
  "assets/icons/icon-72.png",
  "assets/icons/icon-96.png",
  "assets/icons/icon-128.png",
  "assets/icons/icon-144.png",
  "assets/icons/icon-152.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-384.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png"
].map((path) => new URL(path, SCOPE).toString());

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch(() => {
            // Ignore individual failures (e.g. offline first install) so
            // the rest of the shell still gets cached.
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Cache same-origin successful responses and opaque CDN responses for next time
          if (res && (res.status === 200 || res.type === "opaque")) {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => {
          // Offline fallback: for navigations, serve the cached index shell
          if (req.mode === "navigate") {
            return caches.match(new URL("index.html", SCOPE).toString());
          }
          return new Response("", { status: 408, statusText: "Offline" });
        });
    })
  );
});
