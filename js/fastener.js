/**
 * fastener.js
 * Fastener reference category: Thread Chart, Drill Size Reference,
 * Rivet Guide, Bolt Grade, and the Torque Lookup database.
 * All data loaded from data/*.json via DataLoader (no hardcoded tables).
 */

const FASTENER_TOOLS = [
  { id: "torquelookup", label: "Torque Lookup", toolId: "torque-lookup" },
  { id: "threadchart", label: "Thread Chart", toolId: "thread-chart" },
  { id: "drillsize", label: "Drill Sizes", toolId: "drill-size-reference" },
  { id: "rivets", label: "Rivet Guide", toolId: "rivet-guide" },
  { id: "boltgrade", label: "Bolt Grade", toolId: "bolt-grade" }
];

let activeFastenerTool = "torquelookup";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  activeFastenerTool = toolFromUrl();
  window.History.add(currentToolId());
  renderNav();
  showTool(activeFastenerTool, { push: false });
});

window.addEventListener("popstate", () => {
  activeFastenerTool = toolFromUrl();
  syncNavActive();
  showTool(activeFastenerTool, { push: false });
});

function toolFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("tool");
  return FASTENER_TOOLS.some((t) => t.id === requested) ? requested : "torquelookup";
}

function currentToolId() {
  return FASTENER_TOOLS.find((t) => t.id === activeFastenerTool).toolId;
}

function renderNav() {
  const nav = document.getElementById("typeSelector");
  nav.innerHTML = FASTENER_TOOLS.map((t) => `<button class="type-pill ${t.id === activeFastenerTool ? "active" : ""}" data-tool="${t.id}">${t.label}</button>`).join("");
  nav.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFastenerTool = btn.dataset.tool;
      history.pushState(null, "", `?tool=${activeFastenerTool}`);
      window.History.add(currentToolId());
      syncNavActive();
      showTool(activeFastenerTool, { push: false });
    });
  });
}

function syncNavActive() {
  document.querySelectorAll("#typeSelector .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tool === activeFastenerTool));
}

function showTool(id) {
  const container = document.getElementById("fastenerContent");
  container.innerHTML = `<div class="empty-state">Loading…</div>`;
  switch (id) {
    case "torquelookup": renderTorqueLookup(container); break;
    case "threadchart": renderThreadChart(container); break;
    case "drillsize": renderDrillSizes(container); break;
    case "rivets": renderRivets(container); break;
    case "boltgrade": renderBoltGrade(container); break;
  }
}

function disclaimerHtml(text) {
  return `<div class="disclaimer-box">${window.UI.icon("alert-triangle", 15)} <span>${text}</span></div>`;
}

function searchField(id, placeholder) {
  return `<div class="search-box" style="margin:0 0 12px;"><i data-lucide="search" style="width:16px;height:16px"></i><input type="text" id="${id}" placeholder="${placeholder}" autocomplete="off" /></div>`;
}

/* ---------------- Torque Lookup ---------------- */
function renderTorqueLookup(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Fastener Torque Lookup</h3>
      ${disclaimerHtml("Nilai referensi umum — selalu verifikasi ke Maintenance Manual/IPC resmi sebelum digunakan.")}
      ${searchField("torqueSearchInput", "Cari: AN3, AN4, MS, NAS...")}
      <div id="torqueResults"></div>
    </div>`;
  if (window.lucide) lucide.createIcons();

  window.DataLoader.load("../data/torque.json").then((db) => {
    const render = () => {
      const q = document.getElementById("torqueSearchInput").value.trim().toLowerCase();
      const rows = db.bolts.filter((b) => !q || b.designation.toLowerCase().includes(q) || b.series.toLowerCase().includes(q));
      const resultsEl = document.getElementById("torqueResults");
      if (rows.length === 0) { resultsEl.innerHTML = window.UI.emptyState("Tidak ada hasil untuk pencarian ini."); return; }
      resultsEl.innerHTML = rows.map((b) => `
        <div class="data-row">
          <div class="data-row-head"><span class="data-row-title">${b.designation}</span><span class="data-row-badge">${b.series}</span></div>
          <div class="data-row-grid">
            <div><span class="data-label">Diameter</span>${b.diameter_in}</div>
            <div><span class="data-label">TPI</span>${b.threads_per_inch}</div>
            <div><span class="data-label">Material</span>${b.material}</div>
            <div><span class="data-label">Torque</span>${b.torque_min}–${b.torque_max} ${db.unit}</div>
          </div>
          <div class="data-row-ref">${b.reference}</div>
        </div>`).join("");
    };
    document.getElementById("torqueSearchInput").addEventListener("input", render);
    render();
  }).catch(() => {
    document.getElementById("torqueResults").innerHTML = window.UI.emptyState("Gagal memuat database (coba lagi saat online pertama kali).", "wifi-off");
  });
}

/* ---------------- Thread Chart ---------------- */
function renderThreadChart(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Thread Chart (UNC/UNF)</h3>
      <p class="hint">Ukuran mayor, threads-per-inch, dan tap drill yang direkomendasikan.</p>
      ${searchField("threadSearchInput", "Cari ukuran: 1/4-28, #10...")}
      <div id="threadResults"></div>
    </div>`;
  window.DataLoader.load("../data/threadchart.json").then((db) => {
    const render = () => {
      const q = document.getElementById("threadSearchInput").value.trim().toLowerCase();
      const rows = db.threads.filter((t) => !q || t.size.toLowerCase().includes(q));
      const el = document.getElementById("threadResults");
      el.innerHTML = rows.length === 0 ? window.UI.emptyState("Tidak ditemukan.") : rows.map((t) => `
        <div class="data-row">
          <div class="data-row-head"><span class="data-row-title">${t.size}</span></div>
          <div class="data-row-grid">
            <div><span class="data-label">Major Dia.</span>${t.major_dia_in}"</div>
            <div><span class="data-label">TPI</span>${t.tpi}</div>
            <div><span class="data-label">Tap Drill</span>${t.tap_drill}</div>
          </div>
        </div>`).join("");
    };
    document.getElementById("threadSearchInput").addEventListener("input", render);
    render();
  });
}

/* ---------------- Drill Size Reference ---------------- */
function renderDrillSizes(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Drill Size Reference</h3>
      <p class="hint">Number, letter, dan fraction drill size ke nilai desimal inch.</p>
      ${searchField("drillSearchInput", "Cari: #30, 1/4, F...")}
      <div id="drillResults"></div>
    </div>`;
  window.DataLoader.load("../data/drillsizes.json").then((db) => {
    const render = () => {
      const q = document.getElementById("drillSearchInput").value.trim().toLowerCase();
      const rows = db.sizes.filter((s) => !q || s.size.toLowerCase().includes(q));
      const el = document.getElementById("drillResults");
      el.innerHTML = rows.length === 0 ? window.UI.emptyState("Tidak ditemukan.") : `
        <div class="frac-result" style="grid-template-columns:repeat(3,1fr);">
          ${rows.map((s) => `<div class="f-item"><div class="f-val">${s.size}</div><div class="f-label">${s.decimal_in}"</div></div>`).join("")}
        </div>`;
    };
    document.getElementById("drillSearchInput").addEventListener("input", render);
    render();
  });
}

/* ---------------- Rivet Guide ---------------- */
function renderRivets(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Rivet Guide</h3>
      <p class="hint">Panduan umum — untuk aplikasi struktural selalu ikuti SRM.</p>
      ${searchField("rivetSearchInput", "Cari: AN470, MS20426...")}
      <div id="rivetResults"></div>
    </div>`;
  window.DataLoader.load("../data/rivets.json").then((db) => {
    const render = () => {
      const q = document.getElementById("rivetSearchInput").value.trim().toLowerCase();
      const rows = db.rivets.filter((r) => !q || r.type.toLowerCase().includes(q));
      const el = document.getElementById("rivetResults");
      el.innerHTML = rows.length === 0 ? window.UI.emptyState("Tidak ditemukan.") : rows.map((r) => `
        <div class="data-row">
          <div class="data-row-head"><span class="data-row-title">${r.type}</span></div>
          <div class="data-row-grid">
            <div><span class="data-label">Diameter</span>${r.diameter_in}"</div>
            <div><span class="data-label">Head</span>${r.head}</div>
            <div><span class="data-label">Material</span>${r.material}</div>
            <div><span class="data-label">Drill</span>${r.typical_hole_drill}</div>
          </div>
          <div class="data-row-ref">${r.grip_range_in}</div>
        </div>`).join("");
    };
    document.getElementById("rivetSearchInput").addEventListener("input", render);
    render();
  });
}

/* ---------------- Bolt Grade ---------------- */
function renderBoltGrade(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Bolt Grade Identification</h3>
      <p class="hint">Marking kepala baut umum (hardware bengkel, bukan pengganti part number AN/NAS/MS).</p>
      <div id="gradeResults"></div>
    </div>`;
  window.DataLoader.load("../data/boltgrades.json").then((db) => {
    document.getElementById("gradeResults").innerHTML = db.grades.map((g) => `
      <div class="data-row">
        <div class="data-row-head"><span class="data-row-title">${g.standard}</span><span class="data-row-badge">${g.marking}</span></div>
        <div class="data-row-grid">
          <div><span class="data-label">Material</span>${g.material}</div>
          <div><span class="data-label">Min. Tensile</span>${g.min_tensile_psi.toLocaleString()} psi</div>
        </div>
      </div>`).join("");
  });
}
