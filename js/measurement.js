/**
 * measurement.js
 * Realtime unit converter page for: length, area, volume, weight,
 * pressure, temperature, speed, density, flow rate, angle, force, energy.
 * Actual conversion math lives in converter-core.js (shared/reused).
 */

const MEASUREMENT_TYPES = [
  "length", "area", "volume", "weight", "pressure", "temperature",
  "speed", "density", "flowrate", "angle", "force", "energy"
];

let currentType = "length";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("type");
  currentType = MEASUREMENT_TYPES.includes(requested) ? requested : "length";

  window.History.add(currentType);
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
  window.ConverterCore.render(list, type);

  const infoEl = document.getElementById("measurementInfoPanel");
  if (infoEl && window.ToolInfo) window.ToolInfo.render(infoEl, "measure-" + type, UNIT_DATA[type].label);
}
