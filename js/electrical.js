/**
 * electrical.js
 * Realtime unit converter for electrical quantities.
 * Reuses the same generic pattern as measurement.js but scoped
 * to the electrical unit types.
 */

const ELECTRICAL_TYPES = ["voltage", "current", "resistance", "power", "frequency", "capacitance"];

let currentElecType = "voltage";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("type");
  currentElecType = ELECTRICAL_TYPES.includes(requested) ? requested : "voltage";

  window.History.add(currentElecType);
  renderElecTypeSelector();
  renderElecConverter(currentElecType);
  if (window.lucide) lucide.createIcons();
});

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
  const def = UNIT_DATA[type];
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
    input.addEventListener("input", () => onElecInput(type, input, inputs));
    input.addEventListener("focus", () => {
      list.querySelectorAll(".unit-row").forEach((r) => r.classList.remove("active-input"));
      input.closest(".unit-row").classList.add("active-input");
    });
  });
}

function onElecInput(type, sourceInput, allInputs) {
  const raw = sourceInput.value.replace(",", ".");
  const value = parseFloat(raw);

  if (raw.trim() === "" || isNaN(value)) {
    allInputs.forEach((inp) => { if (inp !== sourceInput) inp.value = ""; });
    return;
  }

  const def = UNIT_DATA[type];
  const fromFactor = def.units[sourceInput.dataset.unit].factor;
  const baseValue = value / fromFactor;

  allInputs.forEach((inp) => {
    if (inp === sourceInput) return;
    const toFactor = def.units[inp.dataset.unit].factor;
    inp.value = formatElecNumber(baseValue * toFactor);
  });
}

function formatElecNumber(num) {
  if (!isFinite(num)) return "";
  const rounded = Math.abs(num) < 0.0001 && num !== 0
    ? num.toExponential(4)
    : parseFloat(num.toFixed(6)).toString();
  return rounded;
}
