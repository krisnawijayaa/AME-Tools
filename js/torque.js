/**
 * torque.js
 * Torque toolset:
 *  1. Unit Converter (Nm, lbf-ft, lbf-in, kgf-cm) - via converter-core.js
 *  2. Extension Torque Calculator - T_setting = T_desired * L / (L + E)
 *  3. Crowfoot Calculator - same physics as #2, for in-line crowfoot use
 *  4. Torque Angle Calculator - torque + turn-of-nut angle spec helper
 *  5. Fastener Torque Lookup - placeholder (Coming Soon)
 */

const TORQUE_TABS = [
  { id: "unit", label: "Unit Converter" },
  { id: "extension", label: "Extension Calc" },
  { id: "crowfoot", label: "Crowfoot Calc" },
  { id: "angle", label: "Torque Angle" },
  { id: "lookup", label: "Fastener Lookup" }
];

let activeTab = "unit";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tab");
  activeTab = TORQUE_TABS.some((t) => t.id === requested) ? requested : "unit";

  const idMap = { unit: "torque-unit", extension: "torque-extension", crowfoot: "torque-crowfoot", angle: "torque-angle", lookup: "torque-lookup" };
  window.History.add(idMap[activeTab]);

  renderTabs();
  renderTorqueUnitConverter();
  renderExtensionCalculator();
  renderCrowfootCalculator();
  renderAngleCalculator();
  renderFastenerLookup();
  switchTab(activeTab);
  if (window.lucide) lucide.createIcons();
});

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = TORQUE_TABS.map((t) => `<button class="type-pill ${t.id === activeTab ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("");
  tabs.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      history.replaceState(null, "", `?tab=${activeTab}`);
      const idMap = { unit: "torque-unit", extension: "torque-extension", crowfoot: "torque-crowfoot", angle: "torque-angle", lookup: "torque-lookup" };
      window.History.add(idMap[activeTab]);
      switchTab(activeTab);
    });
  });
}

function switchTab(tab) {
  document.querySelectorAll("#tabs .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("unitPanel").classList.toggle("hidden", tab !== "unit");
  document.getElementById("extensionPanel").classList.toggle("hidden", tab !== "extension");
  document.getElementById("crowfootPanel").classList.toggle("hidden", tab !== "crowfoot");
  document.getElementById("anglePanel").classList.toggle("hidden", tab !== "angle");
  document.getElementById("lookupPanel").classList.toggle("hidden", tab !== "lookup");
}

/* ---------------- Tab 1: Unit converter ---------------- */
function renderTorqueUnitConverter() {
  const list = document.getElementById("torqueConverterList");
  window.ConverterCore.render(list, "torque");
  const infoEl = document.getElementById("torqueUnitInfoPanel");
  if (infoEl && window.ToolInfo) window.ToolInfo.render(infoEl, "torque-unit-converter", "Torque");
}

function toMillimeters(value, unit) {
  if (unit === "mm") return value;
  if (unit === "cm") return value * 10;
  if (unit === "in") return value * 25.4;
  return value;
}

function lengthUnitSelect(id) {
  return `<select id="${id}"><option value="mm">mm</option><option value="cm">cm</option><option value="in">in</option></select>`;
}

function torqueUnitSelect(id) {
  const def = UNIT_DATA.torque.units;
  return `<select id="${id}">${Object.keys(def).map((k) => `<option value="${k}">${def[k].symbol}</option>`).join("")}</select>`;
}

/* ---------------- Tab 2: Extension Torque Calculator ---------------- */
function renderExtensionCalculator() {
  const panel = document.getElementById("extensionPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Extension Torque Calculator</h3>
      <p class="hint">Menghitung angka setting torque wrench saat menggunakan extension / adapter, agar torque aktual pada fastener tetap sesuai spesifikasi.</p>
      <div class="field"><label>Desired Torque (torque spec pada fastener)</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="extDesired" placeholder="0" autocomplete="off" />${torqueUnitSelect("extUnit")}</div></div>
      <div class="field"><label>Torque Wrench Length (L) — dari drive ke handle grip</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="extWrenchLen" placeholder="0" autocomplete="off" />${lengthUnitSelect("extLenUnit1")}</div></div>
      <div class="field"><label>Extension Length (E) — dari centerline drive ke square adapter</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="extExtLen" placeholder="0" autocomplete="off" />${lengthUnitSelect("extLenUnit2")}</div></div>
      <div class="result-box"><div class="r-label">Correct Torque Setting</div>
        <div><span class="r-value" id="extResultValue">–</span><span class="r-unit" id="extResultUnit"></span></div></div>
    </div>
    <div id="extInfoPanel"></div>`;
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("extInfoPanel"), "torque-extension");
  ["extDesired", "extWrenchLen", "extExtLen", "extUnit", "extLenUnit1", "extLenUnit2"].forEach((id) => {
    document.getElementById(id).addEventListener("input", calcExtensionTorque);
    document.getElementById(id).addEventListener("change", calcExtensionTorque);
  });
}

function calcExtensionTorque() {
  const desired = parseFloat(document.getElementById("extDesired").value.replace(",", "."));
  const L = toMillimeters(parseFloat(document.getElementById("extWrenchLen").value.replace(",", ".")), document.getElementById("extLenUnit1").value);
  const E = toMillimeters(parseFloat(document.getElementById("extExtLen").value.replace(",", ".")), document.getElementById("extLenUnit2").value);
  const torqueUnit = document.getElementById("extUnit").value;
  const resultValueEl = document.getElementById("extResultValue");
  const resultUnitEl = document.getElementById("extResultUnit");

  if (isNaN(desired) || isNaN(L) || isNaN(E) || L <= 0) { resultValueEl.textContent = "–"; resultUnitEl.textContent = ""; return; }

  const correctTorque = desired * (L / (L + E));
  resultValueEl.textContent = window.ConverterCore.formatNumber(correctTorque);
  resultUnitEl.textContent = UNIT_DATA.torque.units[torqueUnit].symbol;
}

/* ---------------- Tab 3: Crowfoot Calculator ---------------- */
function renderCrowfootCalculator() {
  const panel = document.getElementById("crowfootPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Crowfoot Calculator</h3>
      <p class="hint">Untuk crowfoot yang dipasang segaris (in-line) dengan wrench, gunakan rumus yang sama seperti extension. Jika crowfoot dipasang tegak lurus (90°) terhadap wrench, tidak perlu koreksi — setting = desired torque.</p>
      <div class="field"><label>Desired Torque (torque spec pada fastener)</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="cfDesired" placeholder="0" autocomplete="off" />${torqueUnitSelect("cfUnit")}</div></div>
      <div class="field"><label>Torque Wrench Length (L)</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="cfWrenchLen" placeholder="0" autocomplete="off" />${lengthUnitSelect("cfLenUnit1")}</div></div>
      <div class="field"><label>Crowfoot Length (E) — dari centerline drive ke titik cengkeram</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="cfExtLen" placeholder="0" autocomplete="off" />${lengthUnitSelect("cfLenUnit2")}</div></div>
      <div class="field"><label>Orientation</label>
        <div class="input-group"><select id="cfOrientation"><option value="inline">In-line (needs correction)</option><option value="perpendicular">Perpendicular / 90° (no correction)</option></select></div></div>
      <div class="result-box"><div class="r-label">Correct Torque Setting</div>
        <div><span class="r-value" id="cfResultValue">–</span><span class="r-unit" id="cfResultUnit"></span></div></div>
    </div>
    <div id="cfInfoPanel"></div>`;
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("cfInfoPanel"), "torque-crowfoot");
  ["cfDesired", "cfWrenchLen", "cfExtLen", "cfUnit", "cfLenUnit1", "cfLenUnit2", "cfOrientation"].forEach((id) => {
    document.getElementById(id).addEventListener("input", calcCrowfoot);
    document.getElementById(id).addEventListener("change", calcCrowfoot);
  });
}

function calcCrowfoot() {
  const desired = parseFloat(document.getElementById("cfDesired").value.replace(",", "."));
  const torqueUnit = document.getElementById("cfUnit").value;
  const resultValueEl = document.getElementById("cfResultValue");
  const resultUnitEl = document.getElementById("cfResultUnit");
  const orientation = document.getElementById("cfOrientation").value;

  if (isNaN(desired)) { resultValueEl.textContent = "–"; resultUnitEl.textContent = ""; return; }

  if (orientation === "perpendicular") {
    resultValueEl.textContent = window.ConverterCore.formatNumber(desired);
    resultUnitEl.textContent = UNIT_DATA.torque.units[torqueUnit].symbol;
    return;
  }

  const L = toMillimeters(parseFloat(document.getElementById("cfWrenchLen").value.replace(",", ".")), document.getElementById("cfLenUnit1").value);
  const E = toMillimeters(parseFloat(document.getElementById("cfExtLen").value.replace(",", ".")), document.getElementById("cfLenUnit2").value);
  if (isNaN(L) || isNaN(E) || L <= 0) { resultValueEl.textContent = "–"; resultUnitEl.textContent = ""; return; }

  const correctTorque = desired * (L / (L + E));
  resultValueEl.textContent = window.ConverterCore.formatNumber(correctTorque);
  resultUnitEl.textContent = UNIT_DATA.torque.units[torqueUnit].symbol;
}

/* ---------------- Tab 4: Torque Angle Calculator ---------------- */
function renderAngleCalculator() {
  const panel = document.getElementById("anglePanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Torque Angle Calculator</h3>
      <p class="hint">Untuk fastener torque-to-yield (TTY) yang dispesifikasikan sebagai "torque awal + rotasi tambahan". Alat ini merangkum spesifikasi menjadi satu ringkasan siap catat.</p>
      <div class="field"><label>Initial (Snug) Torque</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="angTorque" placeholder="0" autocomplete="off" />${torqueUnitSelect("angUnit")}</div></div>
      <div class="field"><label>Additional Rotation Angle</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="angDegrees" placeholder="0" autocomplete="off" /><span style="color:var(--text-dim);font-size:13px;">°</span></div></div>
      <div class="field"><label>Number of Passes / Steps</label>
        <div class="input-group"><input type="text" inputmode="numeric" id="angSteps" placeholder="1" autocomplete="off" /></div></div>
      <div class="result-box"><div class="r-label">Spec Summary</div>
        <div><span class="r-value" id="angResultValue" style="font-size:16px;">–</span></div></div>
    </div>
    <div id="angInfoPanel"></div>`;
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("angInfoPanel"), "torque-angle");
  ["angTorque", "angUnit", "angDegrees", "angSteps"].forEach((id) => {
    document.getElementById(id).addEventListener("input", calcAngle);
    document.getElementById(id).addEventListener("change", calcAngle);
  });
}

function calcAngle() {
  const torque = parseFloat(document.getElementById("angTorque").value.replace(",", "."));
  const unit = UNIT_DATA.torque.units[document.getElementById("angUnit").value].symbol;
  const degrees = parseFloat(document.getElementById("angDegrees").value.replace(",", "."));
  const steps = parseInt(document.getElementById("angSteps").value, 10) || 1;
  const resultEl = document.getElementById("angResultValue");

  if (isNaN(torque) || isNaN(degrees)) { resultEl.textContent = "–"; return; }

  const perStep = steps > 1 ? ` in ${steps} passes (${window.ConverterCore.formatNumber(degrees / steps)}° each)` : "";
  resultEl.textContent = `Snug to ${window.ConverterCore.formatNumber(torque)} ${unit}, then rotate an additional ${window.ConverterCore.formatNumber(degrees)}°${perStep}.`;
}

/* ---------------- Tab 5: Fastener Torque Lookup (placeholder) ---------------- */
function renderFastenerLookup() {
  const panel = document.getElementById("lookupPanel");
  panel.innerHTML = `
    <div class="panel" style="text-align:center;">
      <div class="cat-icon accent-orange" style="margin:0 auto 12px;">
        <i data-lucide="book-open" style="width:22px;height:22px"></i>
      </div>
      <h3>Fastener Torque Lookup</h3>
      <p class="hint">Database referensi torque spec per ukuran &amp; grade fastener sedang disiapkan.</p>
      <span class="badge-soon" style="position:static;display:inline-block;">Coming Soon</span>
    </div>`;
}
