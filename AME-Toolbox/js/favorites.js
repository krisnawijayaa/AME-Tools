/**
 * favorites.js
 * Manage the user's favorite tools using localStorage.
 */

const Favorites = (() => {
  const KEY = "ame_favorites";

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function isFavorite(id) {
    return getAll().includes(id);
  }

  function toggle(id) {
    const list = getAll();
    const idx = list.indexOf(id);
    if (idx === -1) {
      list.unshift(id);
    } else {
      list.splice(idx, 1);
    }
    localStorage.setItem(KEY, JSON.stringify(list));
    return list.includes(id);
  }

  function remove(id) {
    const list = getAll().filter((x) => x !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  return { getAll, isFavorite, toggle, remove };
})();

window.Favorites = Favorites;
