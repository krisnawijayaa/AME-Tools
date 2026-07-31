/**
 * search.js
 * Realtime, multilingual (ID/EN + abbreviations) fuzzy-ish search
 * over TOOL_INDEX (data/aliases.js).
 */

// Curated popular search terms shown when the search box is focused/empty
const POPULAR_SEARCHES = ["mm", "psi", "torque", "voltage", "awg", "fraction", "temperature", "ohm's law"];

/** Tracks the user's own recent search queries (distinct from tool-open History). */
const SearchLog = (() => {
  const KEY = "ame_search_recent";
  const MAX = 6;

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function add(query) {
    const q = query.trim();
    if (!q) return;
    let list = getAll().filter((x) => x.toLowerCase() !== q.toLowerCase());
    list.unshift(q);
    if (list.length > MAX) list = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { getAll, add, clear };
})();

window.SearchLog = SearchLog;
window.POPULAR_SEARCHES = POPULAR_SEARCHES;

const Search = (() => {
  function normalize(str) {
    return str.toLowerCase().trim();
  }

  /**
   * Score a tool entry against a query.
   * Higher score = better match. 0 = no match.
   */
  function scoreEntry(entry, query) {
    const q = normalize(query);
    if (!q) return 0;

    let best = 0;

    // Exact keyword match = highest priority
    for (const kw of entry.keywords) {
      const k = normalize(kw);
      if (k === q) return 100;
      if (k.startsWith(q)) best = Math.max(best, 80);
      if (k.includes(q)) best = Math.max(best, 60);
    }

    // Title / subtitle match
    if (normalize(entry.title).includes(q)) best = Math.max(best, 50);
    if (normalize(entry.subtitle).includes(q)) best = Math.max(best, 40);

    return best;
  }

  function query(q) {
    if (!q || !q.trim()) return [];
    const results = window.TOOL_INDEX
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.entry);
    return results;
  }

  return { query };
})();

window.Search = Search;
