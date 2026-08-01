/**
 * service-worker.js
 * Cache-first strategy for app shell + assets so AME Toolbox works offline.
 * Bump CACHE_VERSION whenever any cached file changes so old caches get purged.
 */

const CACHE_VERSION = "ame-toolbox-v4";
const SCOPE = self.registration.scope; // works correctly under GitHub Pages subpaths too

// Build absolute URLs relative to the service worker's registration scope
const CORE_ASSETS = [
  "",
  "index.html",
  "offline.html",
  "manifest.json",
  "css/main.css",
  "css/responsive.css",
  "js/toast.js",
  "js/ripple.js",
  "js/version.js",
  "js/app.js",
  "js/search.js",
  "js/favorites.js",
  "js/history.js",
  "js/settings.js",
  "js/settings-page.js",
  "js/export-import.js",
  "js/notes.js",
  "js/calc-history.js",
  "js/converter-core.js",
  "js/tool-info.js",
  "js/data-loader.js",
  "js/ui-components.js",
  "js/measurement.js",
  "js/torque.js",
  "js/electrical.js",
  "js/electrical-calc.js",
  "js/general.js",
  "js/general-calc.js",
  "js/calculator.js",
  "js/tools.js",
  "js/tool-compass.js",
  "js/tool-timer.js",
  "js/tool-level.js",
  "js/tool-flashlight.js",
  "js/fastener.js",
  "js/aircraft.js",
  "js/maintenance.js",
  "js/maintenance-data.js",
  "data/units.js",
  "data/aliases.js",
  "data/tool-info.js",
  "data/ata.json",
  "data/acronyms.json",
  "data/torque.json",
  "data/threadchart.json",
  "data/drillsizes.json",
  "data/rivets.json",
  "data/boltgrades.json",
  "pages/measurement.html",
  "pages/torque.html",
  "pages/electrical.html",
  "pages/general.html",
  "pages/tools.html",
  "pages/calculator.html",
  "pages/settings.html",
  "pages/about.html",
  "pages/fastener.html",
  "pages/aircraft.html",
  "pages/maintenance.html",
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

  // Reference databases (data/*.json): stale-while-revalidate, so the
  // app responds instantly from cache but silently refreshes in the
  // background whenever online, without blocking the UI.
  if (req.url.endsWith(".json") && req.url.includes("/data/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req).then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

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
          // Offline fallback: for navigations, try the cached shell first,
          // then the dedicated offline page as a last resort.
          if (req.mode === "navigate") {
            return caches.match(new URL("index.html", SCOPE).toString())
              .then((shell) => shell || caches.match(new URL("offline.html", SCOPE).toString()));
          }
          return new Response("", { status: 408, statusText: "Offline" });
        });
    })
  );
});
