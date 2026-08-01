/**
 * general-calc.js
 * Extra General tools: Percentage, Ratio, Scientific Notation, Date
 * Difference, and Time (Time reuses converter-core.js / UNIT_DATA.time
 * so no conversion math is duplicated).
 */

const GeneralCalc = (() => {
  function initAll() {
    renderPercentage();
    renderRatio();
    renderScientificNotation();
    renderDateDiff();
    renderTime();
  }

  /* ---------------- Percentage Calculator ---------------- */
  function renderPercentage() {
    const panel = document.getElementById("percentagePanel");
    if (!panel) return;
    panel.innerHTML = `
      <div class="panel">
        <h3>Percentage Calculator</h3>
        <p class="hint">X adalah berapa % dari Y? Dan: berapa X% dari Y?</p>
        <div class="field"><label>X</label><div class="input-group"><input type="text" inputmode="decimal" id="pctX" placeholder="0" autocomplete="off" /></div></div>
        <div class="field"><label>Y</label><div class="input-group"><input type="text" inputmode="decimal" id="pctY" placeholder="0" autocomplete="off" /></div></div>
        <div class="result-box"><div class="r-label">X is what % of Y</div><div><span class="r-value" id="pctOfResult">–</span><span class="r-unit">%</span></div></div>
        <div class="result-box" style="margin-top:10px;"><div class="r-label">X% of Y</div><div><span class="r-value" id="pctValResult">–</span></div></div>
      </div>
      <div id="pctInfoPanel"></div>`;
    if (window.ToolInfo) window.ToolInfo.render(document.getElementById("pctInfoPanel"), "percentage-calculator");
    const calc = () => {
      const x = parseFloat(document.getElementById("pctX").value.replace(",", "."));
      const y = parseFloat(document.getElementById("pctY").value.replace(",", "."));
      document.getElementById("pctOfResult").textContent = (!isNaN(x) && !isNaN(y) && y !== 0) ? window.ConverterCore.formatNumber((x / y) * 100) : "–";
      document.getElementById("pctValResult").textContent = (!isNaN(x) && !isNaN(y)) ? window.ConverterCore.formatNumber((x / 100) * y) : "–";
    };
    document.getElementById("pctX").addEventListener("input", calc);
    document.getElementById("pctY").addEventListener("input", calc);
  }

  /* ---------------- Ratio Calculator ---------------- */
  function renderRatio() {
    const panel = document.getElementById("ratioPanel");
    if (!panel) return;
    panel.innerHTML = `
      <div class="panel">
        <h3>Ratio Calculator</h3>
        <p class="hint">A : B = C : ?  — isi 3 nilai untuk mendapatkan nilai ke-4.</p>
        <div class="field"><label>A</label><div class="input-group"><input type="text" inputmode="decimal" id="ratA" placeholder="0" autocomplete="off" /></div></div>
        <div class="field"><label>B</label><div class="input-group"><input type="text" inputmode="decimal" id="ratB" placeholder="0" autocomplete="off" /></div></div>
        <div class="field"><label>C</label><div class="input-group"><input type="text" inputmode="decimal" id="ratC" placeholder="0" autocomplete="off" /></div></div>
        <div class="result-box"><div class="r-label">D (A:B = C:D)</div><div><span class="r-value" id="ratResult">–</span></div></div>
      </div>
      <div id="ratInfoPanel"></div>`;
    if (window.ToolInfo) window.ToolInfo.render(document.getElementById("ratInfoPanel"), "ratio-calculator");
    const calc = () => {
      const a = parseFloat(document.getElementById("ratA").value.replace(",", "."));
      const b = parseFloat(document.getElementById("ratB").value.replace(",", "."));
      const c = parseFloat(document.getElementById("ratC").value.replace(",", "."));
      const el = document.getElementById("ratResult");
      el.textContent = (!isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) ? window.ConverterCore.formatNumber((b * c) / a) : "–";
    };
    ["ratA", "ratB", "ratC"].forEach((id) => document.getElementById(id).addEventListener("input", calc));
  }

  /* ---------------- Scientific Notation ---------------- */
  function renderScientificNotation() {
    const panel = document.getElementById("scinotationPanel");
    if (!panel) return;
    panel.innerHTML = `
      <div class="panel">
        <h3>Scientific Notation</h3>
        <p class="hint">Konversi angka biasa ke notasi ilmiah, atau sebaliknya.</p>
        <div class="field"><label>Standard Number</label><div class="input-group"><input type="text" inputmode="decimal" id="sciStandard" placeholder="e.g. 0.00045" autocomplete="off" /></div></div>
        <div class="result-box"><div class="r-label">Scientific Notation</div><div><span class="r-value" id="sciResult" style="font-size:20px;">–</span></div></div>
        <div class="field" style="margin-top:14px;"><label>Or enter: mantissa × 10^exponent</label>
          <div class="input-group"><input type="text" inputmode="decimal" id="sciMantissa" placeholder="mantissa" style="text-align:left;" autocomplete="off" /></div>
          <div class="input-group" style="margin-top:8px;"><input type="text" inputmode="numeric" id="sciExponent" placeholder="exponent" style="text-align:left;" autocomplete="off" /></div>
        </div>
        <div class="result-box" style="margin-top:10px;"><div class="r-label">Standard Value</div><div><span class="r-value" id="sciBackResult">–</span></div></div>
      </div>
      <div id="sciInfoPanel"></div>`;
    if (window.ToolInfo) window.ToolInfo.render(document.getElementById("sciInfoPanel"), "scientific-notation");
    document.getElementById("sciStandard").addEventListener("input", () => {
      const v = parseFloat(document.getElementById("sciStandard").value.replace(",", "."));
      document.getElementById("sciResult").textContent = isNaN(v) ? "–" : v.toExponential(4).replace("e", " × 10^");
    });
    const back = () => {
      const m = parseFloat(document.getElementById("sciMantissa").value.replace(",", "."));
      const e = parseInt(document.getElementById("sciExponent").value, 10);
      document.getElementById("sciBackResult").textContent = (!isNaN(m) && !isNaN(e)) ? window.ConverterCore.formatNumber(m * Math.pow(10, e)) : "–";
    };
    document.getElementById("sciMantissa").addEventListener("input", back);
    document.getElementById("sciExponent").addEventListener("input", back);
  }

  /* ---------------- Date Difference ---------------- */
  function renderDateDiff() {
    const panel = document.getElementById("datediffPanel");
    if (!panel) return;
    panel.innerHTML = `
      <div class="panel">
        <h3>Date Difference</h3>
        <p class="hint">Hitung selisih antara dua tanggal — berguna untuk due date perawatan, kalibrasi, dsb.</p>
        <div class="field"><label>From</label><div class="input-group"><input type="date" id="ddFrom" style="color:var(--text);background:none;border:none;outline:none;font-size:15px;flex:1;" /></div></div>
        <div class="field"><label>To</label><div class="input-group"><input type="date" id="ddTo" style="color:var(--text);background:none;border:none;outline:none;font-size:15px;flex:1;" /></div></div>
        <div class="result-box"><div class="r-label">Difference</div><div><span class="r-value" id="ddResult">–</span></div></div>
      </div>
      <div id="ddInfoPanel"></div>`;
    if (window.ToolInfo) window.ToolInfo.render(document.getElementById("ddInfoPanel"), "date-difference");
    const calc = () => {
      const from = document.getElementById("ddFrom").value;
      const to = document.getElementById("ddTo").value;
      const el = document.getElementById("ddResult");
      if (!from || !to) { el.textContent = "–"; return; }
      const d1 = new Date(from), d2 = new Date(to);
      const diffDays = Math.round((d2 - d1) / 86400000);
      const years = Math.floor(Math.abs(diffDays) / 365);
      const remDays = Math.abs(diffDays) % 365;
      el.textContent = `${diffDays} days${years > 0 ? ` (~${years}y ${remDays}d)` : ""}`;
    };
    document.getElementById("ddFrom").addEventListener("change", calc);
    document.getElementById("ddTo").addEventListener("change", calc);
  }

  /* ---------------- Time Converter (reuses converter-core + UNIT_DATA.time) ---------------- */
  function renderTime() {
    const panel = document.getElementById("timePanel");
    if (!panel) return;
    panel.innerHTML = `<div class="converter-list" id="timeConverterList" style="padding-top:2px;"></div>`;
    window.ConverterCore.render(document.getElementById("timeConverterList"), "time");
  }

  return { initAll };
})();

window.GeneralCalc = GeneralCalc;
