/**
 * measurement.js
 * Generic realtime unit converter used for: length, area, volume,
 * weight, pressure, speed, time, angle (linear factor-based),
 * plus a special-cased handler for temperature (non-linear).
 */

const MEASUREMENT_TYPES = ["length", "area", "volume", "weight", "pressure", "temperature", "speed", "time", "angle"];

let currentType = "length";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("type");
  currentType = MEASUREMENT_TYPES.includes(requested) ? requested : "length";

  window.History.add(currentType === "length" ? "length" : currentType);
  renderTypeSelector();
  renderConverter(currentType);
  if (window.lucide) lucide.createIcons();
});

function renderTypeSelector() {
  const wrap = document.getElementById("typeSelector");
  wrap.innerHTML = MEASUREMENT_TYPES.map((type) => {
    const label = UNIT_DATA[type].label;
    return `<button class="type-pill ${type === currentType ? "active" : ""}" data-type="${type}">${label}</button>`;
  }).join("");

  wrap.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentType = btn.dataset.type;
      history.replaceState(null, "", `?type=${currentType}`);
      window.History.add(currentType);
      wrap.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderConverter(currentType);
    });
  });
}

function renderConverter(type) {
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
    input.addEventListener("input", () => onUnitInput(type, input, inputs));
    input.addEventListener("focus", () => {
      list.querySelectorAll(".unit-row").forEach((r) => r.classList.remove("active-input"));
      input.closest(".unit-row").classList.add("active-input");
    });
  });
}

function onUnitInput(type, sourceInput, allInputs) {
  const raw = sourceInput.value.replace(",", ".");
  const value = parseFloat(raw);

  if (raw.trim() === "" || isNaN(value)) {
    allInputs.forEach((inp) => {
      if (inp !== sourceInput) inp.value = "";
    });
    return;
  }

  const sourceUnit = sourceInput.dataset.unit;

  allInputs.forEach((inp) => {
    if (inp === sourceInput) return;
    const targetUnit = inp.dataset.unit;
    const result = convert(type, value, sourceUnit, targetUnit);
    inp.value = formatNumber(result);
  });
}

/**
 * Convert a value from one unit to another within a given type.
 */
function convert(type, value, fromUnit, toUnit) {
  if (type === "temperature") {
    return convertTemperature(value, fromUnit, toUnit);
  }
  const def = UNIT_DATA[type];
  const fromFactor = def.units[fromUnit].factor;
  const toFactor = def.units[toUnit].factor;
  const baseValue = value / fromFactor;
  return baseValue * toFactor;
}

/**
 * Temperature requires offset math, not pure multiplication.
 */
function convertTemperature(value, fromUnit, toUnit) {
  // Convert to Celsius first
  let celsius;
  switch (fromUnit) {
    case "c": celsius = value; break;
    case "f": celsius = (value - 32) * (5 / 9); break;
    case "k": celsius = value - 273.15; break;
    case "r": celsius = (value - 491.67) * (5 / 9); break;
  }
  // Convert from Celsius to target
  switch (toUnit) {
    case "c": return celsius;
    case "f": return celsius * (9 / 5) + 32;
    case "k": return celsius + 273.15;
    case "r": return (celsius + 273.15) * (9 / 5);
  }
}

function formatNumber(num) {
  if (!isFinite(num)) return "";
  // Trim to a sensible number of decimals, drop trailing zeros
  const rounded = Math.abs(num) < 0.0001 && num !== 0
    ? num.toExponential(4)
    : parseFloat(num.toFixed(6)).toString();
  return rounded;
}
