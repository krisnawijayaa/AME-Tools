/**
 * torque.js
 * Two tabs:
 *  1. Torque unit converter (Nm, lbf-ft, lbf-in, kgf-cm) - realtime, reuses UNIT_DATA.torque
 *  2. Extension Torque Calculator - computes the setting to dial into the
 *     wrench when using a rigid extension (e.g. crowfoot, adapter).
 *
 *     Correct Torque Setting = Desired Torque * (L / (L + E))
 *     where L = torque wrench length, E = extension length (measured from
 *     the wrench's square drive centerline / pivot point to the fastener).
 */

let activeTab = "unit";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tab");
  activeTab = requested === "extension" ? "extension" : "unit";

  window.History.add(activeTab === "unit" ? "torque-unit" : "torque-extension");

  renderTabs();
  renderTorqueUnitConverter();
  renderExtensionCalculator();
  switchTab(activeTab);
  if (window.lucide) lucide.createIcons();
});

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = `
    <button class="tab-btn" data-tab="unit">Unit Converter</button>
    <button class="tab-btn" data-tab="extension">Extension Calculator</button>
  `;
  tabs.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      history.replaceState(null, "", `?tab=${activeTab}`);
      window.History.add(activeTab === "unit" ? "torque-unit" : "torque-extension");
      switchTab(activeTab);
    });
  });
}

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("unitPanel").classList.toggle("hidden", tab !== "unit");
  document.getElementById("extensionPanel").classList.toggle("hidden", tab !== "extension");
}

/* ---------------- Tab 1: Unit converter ---------------- */
function renderTorqueUnitConverter() {
  const list = document.getElementById("torqueConverterList");
  const def = UNIT_DATA.torque;
  const unitKeys = Object.keys(def.units);

  list.innerHTML = unitKeys.map((key) => {
    const u = def.units[key];
    return `
      <div class="unit-row" data-unit="${key}">
        <div class="unit-labels">
          <div class="u-symbol">${u.symbol}</div>
          <div class="u-name">${u.name}</div>
        </div>
        <input type="text" inputmode="decimal" placeholder="0" data-unit="${key}" autocomplete="off" />
      </div>
    `;
  }).join("");

  const inputs = list.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => onTorqueInput(input, inputs));
    input.addEventListener("focus", () => {
      list.querySelectorAll(".unit-row").forEach((r) => r.classList.remove("active-input"));
      input.closest(".unit-row").classList.add("active-input");
    });
  });
}

function onTorqueInput(sourceInput, allInputs) {
  const raw = sourceInput.value.replace(",", ".");
  const value = parseFloat(raw);
  if (raw.trim() === "" || isNaN(value)) {
    allInputs.forEach((inp) => { if (inp !== sourceInput) inp.value = ""; });
    return;
  }
  const def = UNIT_DATA.torque;
  const fromFactor = def.units[sourceInput.dataset.unit].factor;
  const baseValue = value / fromFactor;

  allInputs.forEach((inp) => {
    if (inp === sourceInput) return;
    const toFactor = def.units[inp.dataset.unit].factor;
    inp.value = formatTorque(baseValue * toFactor);
  });
}

function formatTorque(num) {
  if (!isFinite(num)) return "";
  return parseFloat(num.toFixed(4)).toString();
}

/* ---------------- Tab 2: Extension Torque Calculator ---------------- */
function renderExtensionCalculator() {
  const panel = document.getElementById("extensionPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Extension Torque Calculator</h3>
      <p class="hint">Menghitung angka setting torque wrench saat menggunakan extension / adapter, agar torque aktual pada fastener tetap sesuai spesifikasi.</p>

      <div class="field">
        <label>Desired Torque (torque spec pada fastener)</label>
        <div class="input-group">
          <input type="text" inputmode="decimal" id="extDesired" placeholder="0" autocomplete="off" />
          <select id="extUnit">
            <option value="nm">N·m</option>
            <option value="lbfft">lbf·ft</option>
            <option value="lbfin">lbf·in</option>
            <option value="kgfcm">kgf·cm</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Torque Wrench Length (L) — from drive to handle grip</label>
        <div class="input-group">
          <input type="text" inputmode="decimal" id="extWrenchLen" placeholder="0" autocomplete="off" />
          <select id="extLenUnit1">
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Extension Length (E) — from wrench drive centerline to adapter square</label>
        <div class="input-group">
          <input type="text" inputmode="decimal" id="extExtLen" placeholder="0" autocomplete="off" />
          <select id="extLenUnit2">
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>
      </div>

      <div class="result-box">
        <div class="r-label">Correct Torque Setting</div>
        <div><span class="r-value" id="extResultValue">–</span><span class="r-unit" id="extResultUnit"></span></div>
      </div>
    </div>
  `;

  const ids = ["extDesired", "extWrenchLen", "extExtLen", "extUnit", "extLenUnit1", "extLenUnit2"];
  ids.forEach((id) => {
    document.getElementById(id).addEventListener("input", calcExtensionTorque);
    document.getElementById(id).addEventListener("change", calcExtensionTorque);
  });
}

function calcExtensionTorque() {
  const desired = parseFloat(document.getElementById("extDesired").value.replace(",", "."));
  const wrenchLenRaw = parseFloat(document.getElementById("extWrenchLen").value.replace(",", "."));
  const extLenRaw = parseFloat(document.getElementById("extExtLen").value.replace(",", "."));

  const torqueUnit = document.getElementById("extUnit").value;
  const lenUnit1 = document.getElementById("extLenUnit1").value;
  const lenUnit2 = document.getElementById("extLenUnit2").value;

  const resultValueEl = document.getElementById("extResultValue");
  const resultUnitEl = document.getElementById("extResultUnit");

  if (isNaN(desired) || isNaN(wrenchLenRaw) || isNaN(extLenRaw) || wrenchLenRaw <= 0) {
    resultValueEl.textContent = "–";
    resultUnitEl.textContent = "";
    return;
  }

  // Normalize both lengths to mm for consistent math
  const L = toMillimeters(wrenchLenRaw, lenUnit1);
  const E = toMillimeters(extLenRaw, lenUnit2);

  const correctTorque = desired * (L / (L + E));

  resultValueEl.textContent = formatTorque(correctTorque);
  resultUnitEl.textContent = UNIT_DATA.torque.units[torqueUnit].symbol;
}

function toMillimeters(value, unit) {
  if (unit === "mm") return value;
  if (unit === "cm") return value * 10;
  if (unit === "in") return value * 25.4;
  return value;
}
