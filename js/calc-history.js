/**
 * calc-history.js
 * Stores calculation results (e.g. from the Scientific Calculator) in
 * localStorage — distinct from history.js (which just tracks which
 * *tool* was opened for the Home "Recent" section).
 * Max 20 entries. Supports copy / delete-one / clear-all.
 */

const CalcHistory = (() => {
  const KEY = "ame_calc_history";
  const MAX = 20;

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function add(expression, result) {
    let list = getAll();
    list.unshift({ id: Date.now() + Math.random().toString(36).slice(2, 6), expression, result, ts: Date.now() });
    if (list.length > MAX) list = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
    return list;
  }

  function remove(id) {
    const list = getAll().filter((x) => x.id !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
    return list;
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { getAll, add, remove, clear };
})();

window.CalcHistory = CalcHistory;
