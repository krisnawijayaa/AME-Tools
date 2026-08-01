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
    const exact = window.TOOL_INDEX
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.entry);

    if (exact.length > 0) return exact;

    // Typo tolerance fallback: only kicks in when normal matching finds
    // nothing, so it never outranks a real match.
    return fuzzyQuery(q);
  }

  /** Simple Levenshtein distance, used only as a typo-tolerance fallback. */
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const row = Array(n + 1);
    for (let j = 0; j <= n; j++) row[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = row[j];
        row[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, row[j], row[j - 1]);
        prev = tmp;
      }
    }
    return row[n];
  }

  function fuzzyQuery(q) {
    const query = normalize(q);
    const maxDistance = query.length <= 4 ? 1 : 2;
    const matches = [];

    window.TOOL_INDEX.forEach((entry) => {
      let best = Infinity;
      [...entry.keywords, entry.title].forEach((kw) => {
        normalize(kw).split(/\s+/).forEach((word) => {
          const d = levenshtein(query, word);
          if (d < best) best = d;
        });
      });
      if (best <= maxDistance) matches.push({ entry, dist: best });
    });

    return matches.sort((a, b) => a.dist - b.dist).map((m) => m.entry);
  }

  return { query };
})();

window.Search = Search;
