/**
 * aircraft.js
 * Aircraft reference category: ATA Chapter Reference, Aviation Acronym
 * Dictionary (both loaded from JSON via DataLoader), plus Standard
 * Atmosphere / ISA Temperature / Pressure Altitude calculators (these
 * are physics formulas, not lookup data, so they're computed in JS).
 */

const AIRCRAFT_TOOLS = [
  { id: "ata", label: "ATA Chapters", toolId: "ata-chapters" },
  { id: "acronyms", label: "Acronyms", toolId: "aviation-acronyms" },
  { id: "stdatm", label: "Std. Atmosphere", toolId: "standard-atmosphere" },
  { id: "isatemp", label: "ISA Temperature", toolId: "isa-temperature" },
  { id: "pressurealt", label: "Pressure Altitude", toolId: "pressure-altitude" }
];

let activeAircraftTool = "ata";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  activeAircraftTool = toolFromUrl();
  window.History.add(currentToolId());
  renderNav();
  showTool(activeAircraftTool);
});

window.addEventListener("popstate", () => {
  activeAircraftTool = toolFromUrl();
  syncNavActive();
  showTool(activeAircraftTool);
});

function toolFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("tool");
  return AIRCRAFT_TOOLS.some((t) => t.id === requested) ? requested : "ata";
}
function currentToolId() {
  return AIRCRAFT_TOOLS.find((t) => t.id === activeAircraftTool).toolId;
}

function renderNav() {
  const nav = document.getElementById("typeSelector");
  nav.innerHTML = AIRCRAFT_TOOLS.map((t) => `<button class="type-pill ${t.id === activeAircraftTool ? "active" : ""}" data-tool="${t.id}">${t.label}</button>`).join("");
  nav.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeAircraftTool = btn.dataset.tool;
      history.pushState(null, "", `?tool=${activeAircraftTool}`);
      window.History.add(currentToolId());
      syncNavActive();
      showTool(activeAircraftTool);
    });
  });
}
function syncNavActive() {
  document.querySelectorAll("#typeSelector .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tool === activeAircraftTool));
}

function searchField(id, placeholder) {
  return `<div class="search-box" style="margin:0 0 12px;"><i data-lucide="search" style="width:16px;height:16px"></i><input type="text" id="${id}" placeholder="${placeholder}" autocomplete="off" /></div>`;
}

function showTool(id) {
  const container = document.getElementById("aircraftContent");
  container.innerHTML = `<div class="empty-state">Loading…</div>`;
  switch (id) {
    case "ata": renderAta(container); break;
    case "acronyms": renderAcronyms(container); break;
    case "stdatm": renderStandardAtmosphere(container); break;
    case "isatemp": renderIsaTemp(container); break;
    case "pressurealt": renderPressureAlt(container); break;
  }
  if (window.lucide) lucide.createIcons();
}

/* ---------------- ATA Chapter Reference ---------------- */
function renderAta(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>ATA Chapter Reference</h3>
      <p class="hint">Penomoran bab ATA iSpec 2200 — struktur umum manual pesawat.</p>
      ${searchField("ataSearchInput", "Cari: 27, flight controls...")}
      <div id="ataResults"></div>
    </div>`;
  window.DataLoader.load("../data/ata.json").then((db) => {
    const render = () => {
      const q = document.getElementById("ataSearchInput").value.trim().toLowerCase();
      const rows = db.chapters.filter((c) => !q || c.chapter.includes(q) || c.title.toLowerCase().includes(q));
      const el = document.getElementById("ataResults");
      el.innerHTML = rows.length === 0 ? window.UI.emptyState("Tidak ditemukan.") : `
        <div class="tool-list">${rows.map((c) => `
          <div class="tool-row"><div class="t-icon accent-blue" style="font-size:12px;font-weight:800;">${c.chapter}</div><div class="t-info"><div class="t-title">ATA ${c.chapter}</div><div class="t-sub">${c.title}</div></div></div>`).join("")}</div>`;
    };
    document.getElementById("ataSearchInput").addEventListener("input", render);
    render();
  });
}

/* ---------------- Aviation Acronym Dictionary ---------------- */
function renderAcronyms(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Aviation Acronym Dictionary</h3>
      ${searchField("acronymSearchInput", "Cari: MEL, AOG, NDT...")}
      <div id="acronymResults"></div>
    </div>`;
  window.DataLoader.load("../data/acronyms.json").then((db) => {
    const render = () => {
      const q = document.getElementById("acronymSearchInput").value.trim().toLowerCase();
      const rows = db.acronyms.filter((a) => !q || a.abbr.toLowerCase().includes(q) || a.meaning.toLowerCase().includes(q));
      const el = document.getElementById("acronymResults");
      el.innerHTML = rows.length === 0 ? window.UI.emptyState("Tidak ditemukan.") : `
        <div class="tool-list">${rows.map((a) => `
          <div class="tool-row"><div class="t-icon accent-purple" style="font-size:11px;font-weight:800;">${a.abbr}</div><div class="t-info"><div class="t-title">${a.abbr}</div><div class="t-sub">${a.meaning}</div></div></div>`).join("")}</div>`;
    };
    document.getElementById("acronymSearchInput").addEventListener("input", render);
    render();
  });
}

/* ---------------- Physics helpers (ISA model) ---------------- */
function isaTempC(altitudeFt) {
  return 15 - (altitudeFt / 1000) * 1.98; // standard lapse rate, troposphere
}
function isaPressureRatio(altitudeFt) {
  return Math.pow(1 - 6.8755856e-6 * altitudeFt, 5.2558797);
}

/* ---------------- Standard Atmosphere table ---------------- */
function renderStandardAtmosphere(container) {
  const altitudes = [0, 2000, 4000, 6000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 36089];
  container.innerHTML = `
    <div class="panel">
      <h3>Standard Atmosphere (ISA)</h3>
      <p class="hint">Model troposfer standar (lapse rate 1.98°C/1000ft) hingga tropopause ~36,089 ft.</p>
      <div class="tool-list">
        ${altitudes.map((ft) => `
          <div class="tool-row">
            <div class="t-info">
              <div class="t-title">${ft.toLocaleString()} ft</div>
              <div class="t-sub">${isaTempC(ft).toFixed(1)}°C &nbsp;•&nbsp; Pressure ratio ${isaPressureRatio(ft).toFixed(4)}</div>
            </div>
          </div>`).join("")}
      </div>
    </div>
    <div id="stdAtmInfoPanel"></div>`;
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("stdAtmInfoPanel"), "standard-atmosphere");
}

/* ---------------- ISA Temperature Calculator ---------------- */
function renderIsaTemp(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>ISA Temperature Calculator</h3>
      <p class="hint">Suhu standar (ISA) pada ketinggian tertentu, dan deviasi terhadap suhu aktual (ISA +/-).</p>
      <div class="field"><label>Altitude</label><div class="input-group"><input type="text" inputmode="decimal" id="isaAlt" placeholder="0" /><span style="color:var(--text-dim);font-size:13px;">ft</span></div></div>
      <div class="field"><label>Actual OAT (optional)</label><div class="input-group"><input type="text" inputmode="decimal" id="isaOat" placeholder="0" /><span style="color:var(--text-dim);font-size:13px;">°C</span></div></div>
      <div class="result-box"><div class="r-label">ISA Temperature</div><div><span class="r-value" id="isaResult">–</span><span class="r-unit">°C</span></div></div>
      <div class="result-box" style="margin-top:10px;" id="isaDevBox"><div class="r-label">ISA Deviation</div><div><span class="r-value" id="isaDevResult">–</span></div></div>
    </div>
    <div id="isaInfoPanel"></div>`;
  const calc = () => {
    const alt = parseFloat(document.getElementById("isaAlt").value.replace(",", "."));
    const oat = parseFloat(document.getElementById("isaOat").value.replace(",", "."));
    const resEl = document.getElementById("isaResult");
    const devEl = document.getElementById("isaDevResult");
    if (isNaN(alt)) { resEl.textContent = "–"; devEl.textContent = "–"; return; }
    const isa = isaTempC(alt);
    resEl.textContent = window.ConverterCore.formatNumber(isa);
    if (!isNaN(oat)) {
      const dev = oat - isa;
      devEl.textContent = `ISA ${dev >= 0 ? "+" : ""}${window.ConverterCore.formatNumber(dev)}°C`;
    } else {
      devEl.textContent = "–";
    }
  };
  document.getElementById("isaAlt").addEventListener("input", calc);
  document.getElementById("isaOat").addEventListener("input", calc);
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("isaInfoPanel"), "isa-temperature");
}

/* ---------------- Pressure Altitude Calculator ---------------- */
function renderPressureAlt(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Pressure Altitude Calculator</h3>
      <p class="hint">PA = Field Elevation + (29.92 − Altimeter Setting) × 1000</p>
      <div class="field"><label>Field Elevation</label><div class="input-group"><input type="text" inputmode="decimal" id="paElev" placeholder="0" /><span style="color:var(--text-dim);font-size:13px;">ft</span></div></div>
      <div class="field"><label>Altimeter Setting</label><div class="input-group"><input type="text" inputmode="decimal" id="paAlt" placeholder="29.92" /><span style="color:var(--text-dim);font-size:13px;">inHg</span></div></div>
      <div class="result-box"><div class="r-label">Pressure Altitude</div><div><span class="r-value" id="paResult">–</span><span class="r-unit">ft</span></div></div>
    </div>
    <div id="paInfoPanel"></div>`;
  const calc = () => {
    const elev = parseFloat(document.getElementById("paElev").value.replace(",", "."));
    const setting = parseFloat(document.getElementById("paAlt").value.replace(",", "."));
    const resEl = document.getElementById("paResult");
    if (isNaN(elev) || isNaN(setting)) { resEl.textContent = "–"; return; }
    const pa = elev + (29.92 - setting) * 1000;
    resEl.textContent = window.ConverterCore.formatNumber(pa);
  };
  document.getElementById("paElev").addEventListener("input", calc);
  document.getElementById("paAlt").addEventListener("input", calc);
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("paInfoPanel"), "pressure-altitude");
}
