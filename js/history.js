/**
 * history.js
 * Track recently opened converters/tools using localStorage.
 */

const History = (() => {
  const KEY = "ame_recent";
  const MAX = 20;

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function add(id) {
    let list = getAll().filter((x) => x !== id);
    list.unshift(id);
    if (list.length > MAX) list = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function remove(id) {
    const list = getAll().filter((x) => x !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { getAll, add, remove, clear };
})();

window.History = History;
