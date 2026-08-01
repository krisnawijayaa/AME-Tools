/**
 * notes.js
 * Minimal free-text notes, one per tool id, stored in localStorage.
 * Kept intentionally small — mainly exists so Export/Import has real
 * "Notes" data to work with, and so tool pages can offer a quick
 * personal-note field (e.g. "our shop uses 1.1x on this torque spec").
 */

const Notes = (() => {
  const KEY = "ame_notes";

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function get(toolId) {
    return getAll()[toolId] || "";
  }

  function set(toolId, text) {
    const all = getAll();
    if (text && text.trim()) all[toolId] = text.trim();
    else delete all[toolId];
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  return { getAll, get, set };
})();

window.Notes = Notes;
