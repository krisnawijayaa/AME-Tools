/**
 * converter-core.js
 * Reusable realtime unit-converter UI component.
 * Renders a list of ".unit-row" inputs for a given UNIT_DATA entry and keeps
 * them all in sync as the user types. Used by measurement.js, electrical.js,
 * the Torque unit-converter tab, and the General "Time" tool — so the
 * fill-one-field-updates-all-others logic lives in exactly one place.
 */

const ConverterCore = (() => {
  /**
   * @param {HTMLElement} listEl - container to render unit-rows into
   * @param {string} typeKey - key into UNIT_DATA (e.g. "length")
   * @param {object} [opts]
   * @param {function} [opts.onInput] - called after every successful conversion
   */
  function render(listEl, typeKey, opts = {}) {
    const def = window.UNIT_DATA[typeKey];
    if (!def) return;
    const unitKeys = Object.keys(def.units);

    listEl.innerHTML = unitKeys.map((key) => {
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

    const inputs = listEl.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        propagate(typeKey, input, inputs);
        if (opts.onInput) opts.onInput(input.value, input.dataset.unit);
      });
      input.addEventListener("focus", () => {
        listEl.querySelectorAll(".unit-row").forEach((r) => r.classList.remove("active-input"));
        input.closest(".unit-row").classList.add("active-input");
      });
    });

    return inputs;
  }

  function propagate(typeKey, sourceInput, allInputs) {
    const raw = sourceInput.value.replace(",", ".");
    const value = parseFloat(raw);

    if (raw.trim() === "" || isNaN(value)) {
      allInputs.forEach((inp) => { if (inp !== sourceInput) inp.value = ""; });
      return;
    }

    const sourceUnit = sourceInput.dataset.unit;
    allInputs.forEach((inp) => {
      if (inp === sourceInput) return;
      const result = convert(typeKey, value, sourceUnit, inp.dataset.unit);
      inp.value = formatNumber(result);
    });
  }

  /** Convert a value from one unit to another within a given type. */
  function convert(typeKey, value, fromUnit, toUnit) {
    if (typeKey === "temperature") return convertTemperature(value, fromUnit, toUnit);
    const def = window.UNIT_DATA[typeKey];
    const baseValue = value / def.units[fromUnit].factor;
    return baseValue * def.units[toUnit].factor;
  }

  /** Temperature needs offset math, not pure multiplication. */
  function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    switch (fromUnit) {
      case "c": celsius = value; break;
      case "f": celsius = (value - 32) * (5 / 9); break;
      case "k": celsius = value - 273.15; break;
      case "r": celsius = (value - 491.67) * (5 / 9); break;
    }
    switch (toUnit) {
      case "c": return celsius;
      case "f": return celsius * (9 / 5) + 32;
      case "k": return celsius + 273.15;
      case "r": return (celsius + 273.15) * (9 / 5);
    }
  }

  function formatNumber(num) {
    if (!isFinite(num)) return "";
    return Math.abs(num) < 0.0001 && num !== 0
      ? num.toExponential(4)
      : parseFloat(num.toFixed(6)).toString();
  }

  return { render, convert, formatNumber };
})();

window.ConverterCore = ConverterCore;
