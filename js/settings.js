/**
 * settings.js
 * Tiny key/value settings store in localStorage (e.g. calculator angle mode).
 * Kept generic so future settings can reuse the same get/set helpers.
 */

const Settings = (() => {
  const KEY = "ame_settings";

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function get(key, fallback) {
    const all = getAll();
    return Object.prototype.hasOwnProperty.call(all, key) ? all[key] : fallback;
  }

  function set(key, value) {
    const all = getAll();
    all[key] = value;
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  return { get, set };
})();

window.Settings = Settings;
