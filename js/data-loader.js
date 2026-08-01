/**
 * data-loader.js
 * Fetches JSON reference databases (data/*.json) on demand and caches
 * them in memory so repeated tab switches don't re-fetch. The service
 * worker pre-caches these files for offline access; this module just
 * avoids re-parsing them every time a panel re-renders.
 */

const DataLoader = (() => {
  const cache = {};
  // Path is relative to the calling page; pass the correct prefix ("" for
  // root pages, "../" for pages/*.html) since fetch() is relative to the URL.
  function load(path) {
    if (cache[path]) return cache[path];
    cache[path] = fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        return res.json();
      })
      .catch((err) => {
        delete cache[path];
        throw err;
      });
    return cache[path];
  }

  return { load };
})();

window.DataLoader = DataLoader;
