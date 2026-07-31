/**
 * electrical.js
 * Electrical section controller: two modes reused via the existing
 * tabs component — "Converters" (unit converters, powered by
 * converter-core.js) and "Calculators" (Ohm's Law, voltage drop, etc,
 * implemented in electrical-calc.js).
 */

const ELECTRICAL_TYPES = ["voltage", "current", "resistance", "power", "frequency", "capacitance"];

let currentElecType = "voltage";
let elecMode = "converters";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get("type");
  const requestedMode = params.get("mode");
  currentElecType = ELECTRICAL_TYPES.includes(requestedType) ? requestedType : "voltage";
  elecMode = requestedMode === "calc" ? "calc" : "converters";

  window.History.add(elecMode === "calc" ? "ohms-law" : currentElecType);

  renderModeTabs();
  renderElecTypeSelector();
  renderElecConverter(currentElecType);
  if (window.ElectricalCalc) window.ElectricalCalc.init(document.getElementById("calcPanel"));
  switchMode(elecMode);
  if (window.lucide) lucide.createIcons();
});

function renderModeTabs() {
  const tabs = document.getElementById("modeTabs");
  if (!tabs) return;
  tabs.innerHTML = `
    <button class="tab-btn" data-mode="converters">Converters</button>
    <button class="tab-btn" data-mode="calc">Calculators</button>
  `;
  tabs.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      elecMode = btn.dataset.mode;
      history.replaceState(null, "", `?mode=${elecMode}`);
      window.History.add(elecMode === "calc" ? "ohms-law" : currentElecType);
      switchMode(elecMode);
    });
  });
}

function switchMode(mode) {
  document.querySelectorAll("#modeTabs .tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  document.getElementById("converterMode").classList.toggle("hidden", mode !== "converters");
  document.getElementById("calcMode").classList.toggle("hidden", mode !== "calc");
}

function renderElecTypeSelector() {
  const wrap = document.getElementById("typeSelector");
  wrap.innerHTML = ELECTRICAL_TYPES.map((type) => {
    const label = UNIT_DATA[type].label;
    return `<button class="type-pill ${type === currentElecType ? "active" : ""}" data-type="${type}">${label}</button>`;
  }).join("");

  wrap.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentElecType = btn.dataset.type;
      history.replaceState(null, "", `?type=${currentElecType}`);
      window.History.add(currentElecType);
      wrap.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderElecConverter(currentElecType);
    });
  });
}

function renderElecConverter(type) {
  const list = document.getElementById("converterList");
  document.getElementById("pageTitle").textContent = UNIT_DATA[type].label + " Converter";
  window.ConverterCore.render(list, type);
}
