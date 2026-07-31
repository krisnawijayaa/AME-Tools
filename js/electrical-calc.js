/**
 * electrical-calc.js
 * Electrical calculators: Ohm's Law, Power, Voltage Drop, Series/Parallel
 * Resistance, Battery Capacity/Runtime, AWG <-> mm2, Wire Resistance.
 * Rendered inside electrical.html's "Calculators" tab (#calcPanel).
 */

const ElectricalCalc = (() => {
  const TOOLS = [
    { id: "ohm", label: "Ohm's Law" },
    { id: "power", label: "Power" },
    { id: "vdrop", label: "Voltage Drop" },
    { id: "series", label: "Series R" },
    { id: "parallel", label: "Parallel R" },
    { id: "battcap", label: "Battery Capacity" },
    { id: "battrun", label: "Battery Runtime" },
    { id: "awg", label: "AWG ↔ mm²" },
    { id: "wirer", label: "Wire Resistance" }
  ];

  // AWG cross-section reference table (mm2) - common gauges used in aviation wiring
  const AWG_TABLE = {
    "0000": 107.2, "000": 85.03, "00": 67.43, "0": 53.48, "1": 42.41, "2": 33.63,
    "4": 21.15, "6": 13.3, "8": 8.366, "10": 5.261, "12": 3.309, "14": 2.081,
    "16": 1.309, "18": 0.8228, "20": 0.5176, "22": 0.3255, "24": 0.2047
  };
  // Copper resistivity (ohm*mm2/m)
  const COPPER_RESISTIVITY = 0.0171;

  let container;

  function init(el) {
    container = el;
    container.innerHTML = `
      <div class="type-selector" id="calcTypeSelector"></div>
      <div id="calcContent"></div>
    `;
    renderSelector();
    show("ohm");
  }

  function renderSelector() {
    const sel = container.querySelector("#calcTypeSelector");
    sel.innerHTML = TOOLS.map((t) => `<button class="type-pill" data-calc="${t.id}">${t.label}</button>`).join("");
    sel.querySelectorAll(".type-pill").forEach((btn) => {
      btn.addEventListener("click", () => show(btn.dataset.calc));
    });
  }

  function show(id) {
    container.querySelectorAll(".type-pill").forEach((b) => b.classList.toggle("active", b.dataset.calc === id));
    const content = container.querySelector("#calcContent");
    content.innerHTML = panelHtml(id);
    bindPanel(id);
    if (window.lucide) lucide.createIcons();
  }

  function field(label, id, unitLabel, placeholder = "0") {
    return `
      <div class="field">
        <label>${label}</label>
        <div class="input-group">
          <input type="text" inputmode="decimal" id="${id}" placeholder="${placeholder}" autocomplete="off" />
          ${unitLabel ? `<span style="color:var(--text-dim);font-size:13px;">${unitLabel}</span>` : ""}
        </div>
      </div>
    `;
  }

  function resultBox(id, label = "Result") {
    return `
      <div class="result-box">
        <div class="r-label">${label}</div>
        <div><span class="r-value" id="${id}">–</span><span class="r-unit" id="${id}Unit"></span></div>
      </div>
    `;
  }

  function panelHtml(id) {
    switch (id) {
      case "ohm":
        return `<div class="panel"><h3>Ohm's Law</h3><p class="hint">Isi dua nilai (Voltage, Current, atau Resistance), nilai ketiga otomatis dihitung.</p>
          ${field("Voltage (V)", "ohmV", "V")}
          ${field("Current (I)", "ohmI", "A")}
          ${field("Resistance (R)", "ohmR", "Ω")}
          ${resultBox("ohmResult", "Calculated")}</div>`;
      case "power":
        return `<div class="panel"><h3>Power Calculator</h3><p class="hint">P = V × I. Isi Voltage &amp; Current untuk menghitung Power (atau kombinasi lain).</p>
          ${field("Voltage (V)", "pwrV", "V")}
          ${field("Current (I)", "pwrI", "A")}
          ${resultBox("pwrResult", "Power (W)")}</div>`;
      case "vdrop":
        return `<div class="panel"><h3>Voltage Drop</h3><p class="hint">Menghitung voltage drop pada kabel tembaga berdasarkan arus, panjang, dan luas penampang.</p>
          ${field("Current (I)", "vdI", "A")}
          ${field("Wire Length (one-way)", "vdLen", "m")}
          ${field("Cross-section Area", "vdArea", "mm²")}
          ${resultBox("vdResult", "Voltage Drop (V)")}</div>`;
      case "series":
        return `<div class="panel"><h3>Series Resistance</h3><p class="hint">Total = R1 + R2 + R3 + ... Pisahkan tiap nilai resistor dengan koma.</p>
          ${field("Resistor values (Ω), comma separated", "seriesR", null, "e.g. 100, 220, 330")}
          ${resultBox("seriesResult", "Total Resistance (Ω)")}</div>`;
      case "parallel":
        return `<div class="panel"><h3>Parallel Resistance</h3><p class="hint">1/Total = 1/R1 + 1/R2 + ... Pisahkan tiap nilai resistor dengan koma.</p>
          ${field("Resistor values (Ω), comma separated", "parR", null, "e.g. 100, 220, 330")}
          ${resultBox("parResult", "Total Resistance (Ω)")}</div>`;
      case "battcap":
        return `<div class="panel"><h3>Battery Capacity Calculator</h3><p class="hint">Menghitung energi (Wh) dari kapasitas (Ah) dan tegangan nominal.</p>
          ${field("Capacity", "battAh", "Ah")}
          ${field("Nominal Voltage", "battV", "V")}
          ${resultBox("battCapResult", "Energy (Wh)")}</div>`;
      case "battrun":
        return `<div class="panel"><h3>Battery Runtime Calculator</h3><p class="hint">Estimasi waktu pakai (jam) = Kapasitas (Ah) ÷ Beban Arus (A).</p>
          ${field("Battery Capacity", "runAh", "Ah")}
          ${field("Load Current", "runI", "A")}
          ${resultBox("runResult", "Estimated Runtime (hours)")}</div>`;
      case "awg":
        return `<div class="panel"><h3>AWG ↔ mm²</h3><p class="hint">Pilih AWG untuk melihat luas penampang, atau isi mm² untuk mencari AWG terdekat.</p>
          <div class="field"><label>AWG</label><div class="input-group">
            <select id="awgSelect" style="flex:1;background:none;border:none;color:var(--text);font-size:16px;font-weight:600;outline:none;">
              ${Object.keys(AWG_TABLE).map((g) => `<option value="${g}">${g} AWG</option>`).join("")}
            </select>
          </div></div>
          ${field("or enter mm² directly", "awgMm2", "mm²")}
          ${resultBox("awgResult", "Cross-section (mm²)")}</div>`;
      case "wirer":
        return `<div class="panel"><h3>Wire Resistance Calculator</h3><p class="hint">R = ρ × L / A (kabel tembaga, ρ = 0.0171 Ω·mm²/m).</p>
          ${field("Wire Length", "wrLen", "m")}
          ${field("Cross-section Area", "wrArea", "mm²")}
          ${resultBox("wrResult", "Resistance (Ω)")}</div>`;
      default:
        return "";
    }
  }

  function bindPanel(id) {
    const on = (elId, fn) => { const el = document.getElementById(elId); if (el) el.addEventListener("input", fn); };
    const onChange = (elId, fn) => { const el = document.getElementById(elId); if (el) el.addEventListener("change", fn); };
    const num = (elId) => parseFloat((document.getElementById(elId).value || "").replace(",", "."));
    const setResult = (elId, value, unit = "") => {
      document.getElementById(elId).textContent = isFinite(value) ? window.ConverterCore.formatNumber(value) : "–";
      const unitEl = document.getElementById(elId + "Unit");
      if (unitEl) unitEl.textContent = unit;
    };

    if (id === "ohm") {
      ["ohmV", "ohmI", "ohmR"].forEach((f) => on(f, () => {
        const V = num("ohmV"), I = num("ohmI"), R = num("ohmR");
        if (!isNaN(V) && !isNaN(I) && isNaN(R)) setResult("ohmResult", V / I, "Ω (R)");
        else if (!isNaN(V) && !isNaN(R) && isNaN(I)) setResult("ohmResult", V / R, "A (I)");
        else if (!isNaN(I) && !isNaN(R) && isNaN(V)) setResult("ohmResult", I * R, "V (V)");
        else setResult("ohmResult", NaN);
      }));
    }

    if (id === "power") {
      ["pwrV", "pwrI"].forEach((f) => on(f, () => {
        const V = num("pwrV"), I = num("pwrI");
        setResult("pwrResult", V * I, "W");
      }));
    }

    if (id === "vdrop") {
      ["vdI", "vdLen", "vdArea"].forEach((f) => on(f, () => {
        const I = num("vdI"), L = num("vdLen"), A = num("vdArea");
        // Round-trip length (2x one-way) is standard for voltage drop calcs
        const drop = (2 * COPPER_RESISTIVITY * L * I) / A;
        setResult("vdResult", drop, "V");
      }));
    }

    if (id === "series") {
      on("seriesR", () => {
        const vals = document.getElementById("seriesR").value.split(",").map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v));
        const total = vals.reduce((a, b) => a + b, 0);
        setResult("seriesResult", vals.length ? total : NaN, "Ω");
      });
    }

    if (id === "parallel") {
      on("parR", () => {
        const vals = document.getElementById("parR").value.split(",").map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v) && v > 0);
        const invTotal = vals.reduce((a, b) => a + 1 / b, 0);
        setResult("parResult", vals.length ? 1 / invTotal : NaN, "Ω");
      });
    }

    if (id === "battcap") {
      ["battAh", "battV"].forEach((f) => on(f, () => setResult("battCapResult", num("battAh") * num("battV"), "Wh")));
    }

    if (id === "battrun") {
      ["runAh", "runI"].forEach((f) => on(f, () => setResult("runResult", num("runAh") / num("runI"), "hrs")));
    }

    if (id === "awg") {
      const sync = () => setResult("awgResult", AWG_TABLE[document.getElementById("awgSelect").value], "mm²");
      onChange("awgSelect", sync);
      on("awgMm2", () => {
        const target = num("awgMm2");
        if (isNaN(target)) return;
        // Find nearest AWG by cross-section
        let closest = null, closestDiff = Infinity;
        Object.entries(AWG_TABLE).forEach(([g, mm2]) => {
          const diff = Math.abs(mm2 - target);
          if (diff < closestDiff) { closestDiff = diff; closest = g; }
        });
        document.getElementById("awgResult").textContent = `${closest} AWG`;
        document.getElementById("awgResultUnit").textContent = "(nearest)";
      });
      sync();
    }

    if (id === "wirer") {
      ["wrLen", "wrArea"].forEach((f) => on(f, () => {
        const L = num("wrLen"), A = num("wrArea");
        setResult("wrResult", (COPPER_RESISTIVITY * L) / A, "Ω");
      }));
    }
  }

  return { init };
})();

window.ElectricalCalc = ElectricalCalc;
