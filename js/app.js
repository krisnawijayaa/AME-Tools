/**
 * app.js
 * Home page controller: renders search suggestions, categories,
 * popular tools, recent, and favorites. Also registers the service worker.
 */

const CATEGORIES = [
  { id: "measurement", name: "Measurement", nameId: "Pengukuran", icon: "ruler", color: "blue", url: "pages/measurement.html", desc: "Length, area, volume & more" },
  { id: "torque", name: "Torque", nameId: "Torsi", icon: "wrench", color: "orange", url: "pages/torque.html", desc: "Unit & extension calculator" },
  { id: "electrical", name: "Electrical", nameId: "Elektrik", icon: "zap", color: "green", url: "pages/electrical.html", desc: "Voltage, current, power" },
  { id: "fastener", name: "Fastener", nameId: "Fastener", icon: "cog", color: "purple", url: "#", comingSoon: true, desc: "Bolts, threads & specs" },
  { id: "aircraft", name: "Aircraft", nameId: "Pesawat", icon: "plane", color: "blue", url: "#", comingSoon: true, desc: "Quick reference data" },
  { id: "general", name: "General", nameId: "Umum", icon: "calculator", color: "purple", url: "pages/general.html", desc: "Fraction, binary, hex" },
  { id: "tools", name: "Tools", nameId: "Alat", icon: "compass", color: "green", url: "pages/tools.html", desc: "Compass, stopwatch, level" },
  { id: "maintenance", name: "Maintenance", nameId: "Perawatan", icon: "calendar", color: "orange", url: "#", comingSoon: true, desc: "Task tracking (soon)" }
];

// Tools promoted on Home as "Popular" (curated, most-used by AMEs)
const POPULAR_IDS = ["length", "pressure", "torque-unit", "temperature", "voltage", "weight"];

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  renderCategories();
  renderPopular();
  renderLastOpened();
  renderRecent();
  renderFavorites();
  renderQuickAccess();
  renderFooterVersion();
  initSearch();
  initOfflineBanner();
  initGlobalErrorHandling();
  registerServiceWorker();
});

function iconSvg(name, size = 20) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

function findToolEntry(id) {
  return window.TOOL_INDEX.find((t) => t.id === id);
}

function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map((cat) => `
    <a class="category-card ${cat.comingSoon ? "disabled" : ""}" href="${cat.comingSoon ? "javascript:void(0)" : cat.url}" ${cat.comingSoon ? `onclick="showToast('${cat.name} — Coming Soon')"` : ""}>
      ${cat.comingSoon ? '<span class="badge-soon">Soon</span>' : ""}
      <div class="cat-icon accent-${cat.color}">${iconSvg(cat.icon, 22)}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-desc">${cat.desc}</div>
    </a>
  `).join("");
  if (window.lucide) lucide.createIcons();
}

function renderPopular() {
  const wrap = document.getElementById("popularScroll");
  if (!wrap) return;
  const items = POPULAR_IDS.map(findToolEntry).filter(Boolean);
  wrap.innerHTML = items.map((t) => `
    <a class="chip" href="${t.url}" onclick="History.add('${t.id}')">
      <span class="chip-icon accent-${t.color}">${iconSvg(t.icon, 14)}</span>
      ${t.title.replace(" Converter", "")}
    </a>
  `).join("");
  if (window.lucide) lucide.createIcons();
}

function renderLastOpened() {
  const section = document.getElementById("lastOpenedSection");
  const list = document.getElementById("lastOpenedList");
  if (!list) return;
  const ids = window.History.getAll();
  if (ids.length === 0) {
    section.classList.add("hidden");
    return;
  }
  const last = findToolEntry(ids[0]);
  if (!last) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  list.innerHTML = toolRowHtml(last);
  if (window.lucide) lucide.createIcons();
  bindFavButtons(list);
}

function renderRecent() {
  const section = document.getElementById("recentSection");
  const list = document.getElementById("recentList");
  if (!list) return;
  // Skip the first entry — it's already shown in "Last Opened" above.
  const ids = window.History.getAll().slice(1);
  if (ids.length === 0) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  const items = ids.map(findToolEntry).filter(Boolean);
  list.innerHTML = items.map(toolRowHtml).join("");
  if (window.lucide) lucide.createIcons();
  bindFavButtons(list);
}

function renderFavorites() {
  const section = document.getElementById("favoritesSection");
  const list = document.getElementById("favoritesList");
  if (!list) return;
  const ids = window.Favorites.getAll();
  if (ids.length === 0) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  const items = ids.map(findToolEntry).filter(Boolean);
  list.innerHTML = items.map(toolRowHtml).join("");
  if (window.lucide) lucide.createIcons();
  bindFavButtons(list);
}

function toolRowHtml(t) {
  const isFav = window.Favorites.isFavorite(t.id);
  return `
    <div class="tool-row">
      <a href="${t.url}" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0" onclick="History.add('${t.id}')">
        <div class="t-icon accent-${t.color}">${iconSvg(t.icon, 18)}</div>
        <div class="t-info">
          <div class="t-title">${t.title}</div>
          <div class="t-sub">${t.subtitle}</div>
        </div>
      </a>
      <button class="fav-btn ${isFav ? "active" : ""}" data-id="${t.id}" aria-label="Toggle favorite">
        ${iconSvg("star", 18)}
      </button>
    </div>
  `;
}

function bindFavButtons(container) {
  container.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const active = window.Favorites.toggle(id);
      btn.classList.toggle("active", active);
      showToast(active ? "Added to favorites" : "Removed from favorites");
      renderFavorites();
    });
  });
}

/* ---------------- Search ---------------- */
function initSearch() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClear");
  const suggestBox = document.getElementById("searchSuggestions");
  if (!input) return;

  function runSearch() {
    const q = input.value;
    clearBtn.classList.toggle("hidden", q.length === 0);

    if (!q.trim()) {
      renderSearchLanding(suggestBox);
      return;
    }

    const results = window.Search.query(q);
    suggestBox.classList.remove("hidden");

    if (results.length === 0) {
      suggestBox.innerHTML = `<div class="suggestion-empty">No results for "${escapeHtml(q)}"</div>`;
      return;
    }

    suggestBox.innerHTML = results.slice(0, 8).map((t) => `
      <a class="suggestion-item" href="${t.url}" data-search-pick="${t.id}">
        <div class="suggestion-icon accent-${t.color}">${iconSvg(t.icon, 18)}</div>
        <div class="suggestion-text">
          <span class="t">${t.title}</span>
          <span class="s">${t.subtitle}</span>
        </div>
      </a>
    `).join("");
    suggestBox.querySelectorAll("[data-search-pick]").forEach((el) => {
      el.addEventListener("click", () => {
        History.add(el.dataset.searchPick);
        window.SearchLog.add(input.value);
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  /** Shown when the search box is focused but empty: recent + popular searches. */
  function renderSearchLanding(box) {
    const recent = window.SearchLog.getAll();
    const popular = window.POPULAR_SEARCHES;

    if (recent.length === 0 && popular.length === 0) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }

    box.classList.remove("hidden");
    box.innerHTML = `
      ${recent.length ? `
        <div class="suggestion-empty" style="text-align:left;padding:10px 14px 4px;font-weight:700;color:var(--text-dim);">Recent Searches</div>
        ${recent.map((q) => `<a class="suggestion-item" data-fill="${escapeHtml(q)}"><div class="suggestion-icon accent-blue">${iconSvg("history", 16)}</div><div class="suggestion-text"><span class="t">${escapeHtml(q)}</span></div></a>`).join("")}
      ` : ""}
      <div class="suggestion-empty" style="text-align:left;padding:10px 14px 4px;font-weight:700;color:var(--text-dim);">Popular Searches</div>
      ${popular.map((q) => `<a class="suggestion-item" data-fill="${escapeHtml(q)}"><div class="suggestion-icon accent-orange">${iconSvg("trending-up", 16)}</div><div class="suggestion-text"><span class="t">${escapeHtml(q)}</span></div></a>`).join("")}
    `;
    box.querySelectorAll("[data-fill]").forEach((el) => {
      el.addEventListener("click", () => {
        input.value = el.dataset.fill;
        runSearch();
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  input.addEventListener("input", runSearch);
  input.addEventListener("focus", runSearch);

  clearBtn.addEventListener("click", () => {
    input.value = "";
    input.focus();
    runSearch();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      suggestBox.classList.add("hidden");
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------- Quick Access ---------------- */
const QUICK_ACCESS = [
  { name: "Scientific Calculator", icon: "calculator", color: "purple", url: "pages/calculator.html", desc: "Trig, log, memory" },
  { name: "Settings", icon: "settings", color: "blue", url: "pages/settings.html", desc: "Appearance, units, backup" },
  { name: "About", icon: "info", color: "green", url: "pages/about.html", desc: "Version, changelog, license" },
  { name: "Tools", icon: "compass", color: "orange", url: "pages/tools.html", desc: "Compass, stopwatch, level" }
];

function renderQuickAccess() {
  const grid = document.getElementById("quickAccessGrid");
  if (!grid) return;
  grid.innerHTML = QUICK_ACCESS.map((q) => `
    <a class="category-card" href="${q.url}">
      <div class="cat-icon accent-${q.color}">${iconSvg(q.icon, 22)}</div>
      <div class="cat-name">${q.name}</div>
      <div class="cat-desc">${q.desc}</div>
    </a>
  `).join("");
  if (window.lucide) lucide.createIcons();
}

/* ---------------- Footer version ---------------- */
function renderFooterVersion() {
  const el = document.getElementById("footerVersion");
  if (el) el.textContent = `AME Toolbox v${window.APP_VERSION || "?"}`;
}

/* ---------------- Offline banner ---------------- */
function initOfflineBanner() {
  const banner = document.getElementById("offlineBanner");
  if (!banner) return;
  const update = () => banner.classList.toggle("hidden", navigator.onLine);
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

/* ---------------- Global error handling ---------------- */
function initGlobalErrorHandling() {
  window.addEventListener("error", () => {
    // Keep it low-key: a script error shouldn't feel like a crash to the user.
    if (window.showToast) window.showToast("Something went wrong. Please try again.");
  });
  window.addEventListener("unhandledrejection", () => {
    if (window.showToast) window.showToast("Something went wrong. Please try again.");
  });
}

/* ---------------- Service Worker ---------------- */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Registered with root scope so it also handles requests from /pages/*
      navigator.serviceWorker.register("service-worker.js", { scope: "./" }).catch(() => {
        // Fails silently offline / on file:// — app still works.
      });
    });
  }
}
