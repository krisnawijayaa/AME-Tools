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
  { id: "maintenance", name: "Maintenance", nameId: "Perawatan", icon: "calendar", color: "orange", url: "#", comingSoon: true, desc: "Task tracking (soon)" }
];

// Tools promoted on Home as "Popular" (curated, most-used by AMEs)
const POPULAR_IDS = ["length", "pressure", "torque-unit", "temperature", "voltage", "weight"];

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderPopular();
  renderRecent();
  renderFavorites();
  initSearch();
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

function renderRecent() {
  const section = document.getElementById("recentSection");
  const list = document.getElementById("recentList");
  if (!list) return;
  const ids = window.History.getAll();
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
      suggestBox.classList.add("hidden");
      suggestBox.innerHTML = "";
      return;
    }

    const results = window.Search.query(q);
    suggestBox.classList.remove("hidden");

    if (results.length === 0) {
      suggestBox.innerHTML = `<div class="suggestion-empty">No results for "${escapeHtml(q)}"</div>`;
      return;
    }

    suggestBox.innerHTML = results.slice(0, 8).map((t) => `
      <a class="suggestion-item" href="${t.url}" onclick="History.add('${t.id}')">
        <div class="suggestion-icon accent-${t.color}">${iconSvg(t.icon, 18)}</div>
        <div class="suggestion-text">
          <span class="t">${t.title}</span>
          <span class="s">${t.subtitle}</span>
        </div>
      </a>
    `).join("");
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

/* ---------------- Toast ---------------- */
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
window.showToast = showToast;

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
