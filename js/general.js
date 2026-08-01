/**
 * general.js
 * General tools controller (pill-nav, reuses .type-selector/.type-pill).
 * Owns: Decimal<->Fraction, Number Base (Binary/Decimal/Hex/Octal/ASCII).
 * Percentage / Ratio / Scientific Notation / Date Diff / Time live in
 * general-calc.js; Scientific Calculator is a separate page (calculator.html).
 */

const GENERAL_TOOLS = [
  { id: "dec2frac", label: "Dec→Frac", toolId: "decimal-fraction" },
  { id: "frac2dec", label: "Frac→Dec", toolId: "fraction-decimal" },
  { id: "base", label: "Number Base", toolId: "number-base" },
  { id: "percentage", label: "Percentage", toolId: "percentage-calculator" },
  { id: "ratio", label: "Ratio", toolId: "ratio-calculator" },
  { id: "scinotation", label: "Sci. Notation", toolId: "scientific-notation" },
  { id: "datediff", label: "Date Diff", toolId: "date-difference" },
  { id: "time", label: "Time", toolId: "time-general" }
];

let activeGeneralTab = "dec2frac";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tab");
  activeGeneralTab = GENERAL_TOOLS.some((t) => t.id === requested) ? requested : "dec2frac";

  logHistory(activeGeneralTab);

  renderTabs();
  renderDec2Frac();
  renderFrac2Dec();
  renderBaseConverter();
  if (window.GeneralCalc) window.GeneralCalc.initAll();
  switchGeneralTab(activeGeneralTab);
  if (window.lucide) lucide.createIcons();
});

window.addEventListener("popstate", () => {
  const requested = new URLSearchParams(window.location.search).get("tab");
  activeGeneralTab = GENERAL_TOOLS.some((t) => t.id === requested) ? requested : "dec2frac";
  document.querySelectorAll("#tabs .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tab === activeGeneralTab));
  switchGeneralTab(activeGeneralTab);
});

function logHistory(tabId) {
  const tool = GENERAL_TOOLS.find((t) => t.id === tabId);
  if (tool) window.History.add(tool.toolId);
}

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = GENERAL_TOOLS.map((t) => `<button class="type-pill ${t.id === activeGeneralTab ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("");
  tabs.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeGeneralTab = btn.dataset.tab;
      history.pushState(null, "", `?tab=${activeGeneralTab}`);
      logHistory(activeGeneralTab);
      switchGeneralTab(activeGeneralTab);
    });
  });
}

function switchGeneralTab(tab) {
  document.querySelectorAll("#tabs .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  const panelIds = { dec2frac: "dec2fracPanel", frac2dec: "frac2decPanel", base: "basePanel", percentage: "percentagePanel", ratio: "ratioPanel", scinotation: "scinotationPanel", datediff: "datediffPanel", time: "timePanel" };
  Object.entries(panelIds).forEach(([key, elId]) => {
    const el = document.getElementById(elId);
    if (el) el.classList.toggle("hidden", key !== tab);
  });
}

/* ---------------- Decimal -> Fraction ---------------- */
function renderDec2Frac() {
  const panel = document.getElementById("dec2fracPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Decimal → Fraction (Inch)</h3>
      <p class="hint">Masukkan nilai desimal inch (contoh: 0.375). Hasil dibulatkan ke pecahan terdekat, presisi hingga 1/64".</p>
      <div class="field"><label>Decimal (inch)</label>
        <div class="input-group"><input type="text" inputmode="decimal" id="decInput" placeholder="0.000" autocomplete="off" /><span style="color:var(--text-dim);font-size:13px;">in</span></div></div>
      <div class="frac-result">
        <div class="f-item"><div class="f-val" id="frac64">–</div><div class="f-label">Nearest 1/64"</div></div>
        <div class="f-item"><div class="f-val" id="frac32">–</div><div class="f-label">Nearest 1/32"</div></div>
        <div class="f-item"><div class="f-val" id="frac16">–</div><div class="f-label">Nearest 1/16"</div></div>
        <div class="f-item"><div class="f-val" id="fracExact">–</div><div class="f-label">Simplified</div></div>
      </div>
    </div>
    <div id="d2fInfoPanel"></div>`;
  document.getElementById("decInput").addEventListener("input", calcDec2Frac);
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("d2fInfoPanel"), "decimal-fraction");
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function toFraction(decimalPart, denominator) {
  let numerator = Math.round(decimalPart * denominator);
  if (numerator === 0) return "0";
  if (numerator === denominator) return "1";
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  const denom = denominator / divisor;
  return `${numerator}/${denom}`;
}

function calcDec2Frac() {
  const raw = document.getElementById("decInput").value.replace(",", ".");
  const value = parseFloat(raw);
  const el64 = document.getElementById("frac64"), el32 = document.getElementById("frac32"), el16 = document.getElementById("frac16"), elExact = document.getElementById("fracExact");

  if (raw.trim() === "" || isNaN(value)) { [el64, el32, el16, elExact].forEach((el) => (el.textContent = "–")); return; }

  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const whole = Math.floor(abs);
  const frac = abs - whole;
  const wholePrefix = whole > 0 ? `${whole} ` : "";

  el64.textContent = frac === 0 ? (whole || "0") + '"' : `${sign}${wholePrefix}${toFraction(frac, 64)}"`;
  el32.textContent = frac === 0 ? (whole || "0") + '"' : `${sign}${wholePrefix}${toFraction(frac, 32)}"`;
  el16.textContent = frac === 0 ? (whole || "0") + '"' : `${sign}${wholePrefix}${toFraction(frac, 16)}"`;
  elExact.textContent = frac === 0 ? (whole || "0") + '"' : `${sign}${wholePrefix}${toFraction(frac, 64)}"`;
}

/* ---------------- Fraction -> Decimal ---------------- */
function renderFrac2Dec() {
  const panel = document.getElementById("frac2decPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Fraction → Decimal</h3>
      <p class="hint">Masukkan pecahan, contoh: 3/8 atau 1 1/2 (angka bulat + pecahan).</p>
      <div class="field"><label>Fraction</label>
        <div class="input-group"><input type="text" id="fracInput" placeholder='e.g. 3/8 or 1 1/2' autocomplete="off" /></div></div>
      <div class="result-box"><div class="r-label">Decimal</div>
        <div><span class="r-value" id="fracDecResult">–</span><span class="r-unit">in</span></div></div>
    </div>
    <div id="f2dInfoPanel"></div>`;
  document.getElementById("fracInput").addEventListener("input", calcFrac2Dec);
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("f2dInfoPanel"), "fraction-decimal");
}

function calcFrac2Dec() {
  const raw = document.getElementById("fracInput").value.trim();
  const resultEl = document.getElementById("fracDecResult");
  if (!raw) { resultEl.textContent = "–"; return; }

  const mixedMatch = raw.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  const simpleMatch = raw.match(/^(-?\d+)\/(\d+)$/);
  const decimalMatch = raw.match(/^-?\d*\.?\d+$/);
  let result = null;

  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10), num = parseInt(mixedMatch[2], 10), den = parseInt(mixedMatch[3], 10);
    if (den !== 0) { const sign = whole < 0 ? -1 : 1; result = whole + sign * (num / den); }
  } else if (simpleMatch) {
    const num = parseInt(simpleMatch[1], 10), den = parseInt(simpleMatch[2], 10);
    if (den !== 0) result = num / den;
  } else if (decimalMatch) {
    result = parseFloat(raw);
  }

  resultEl.textContent = result === null || isNaN(result) ? "Invalid" : parseFloat(result.toFixed(6)).toString();
}

/* ---------------- Binary / Decimal / Hex / Octal / ASCII ---------------- */
function renderBaseConverter() {
  const panel = document.getElementById("basePanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Binary / Decimal / Hex / Octal / ASCII</h3>
      <p class="hint">Isi salah satu field, field lain menyesuaikan otomatis.</p>
      <div class="base-grid">
        <div class="base-row"><div class="b-label">Binary</div><input type="text" id="baseBinary" placeholder="e.g. 01001000" autocomplete="off" /></div>
        <div class="base-row"><div class="b-label">Decimal</div><input type="text" id="baseDecimal" placeholder="e.g. 72" autocomplete="off" /></div>
        <div class="base-row"><div class="b-label">Octal</div><input type="text" id="baseOctal" placeholder="e.g. 110" autocomplete="off" /></div>
        <div class="base-row"><div class="b-label">Hex</div><input type="text" id="baseHex" placeholder="e.g. 48" autocomplete="off" /></div>
        <div class="base-row"><div class="b-label">ASCII</div><input type="text" id="baseAscii" placeholder="e.g. H" autocomplete="off" maxlength="1" /></div>
      </div>
      <p class="hint" style="margin-top:10px;">Catatan: ASCII hanya mendukung 1 karakter (0–255).</p>
    </div>
    <div id="baseInfoPanel"></div>`;
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("baseInfoPanel"), "number-base");

  const binEl = document.getElementById("baseBinary"), decEl = document.getElementById("baseDecimal"), octEl = document.getElementById("baseOctal"), hexEl = document.getElementById("baseHex"), asciiEl = document.getElementById("baseAscii");

  binEl.addEventListener("input", () => updateBaseFields(parseInt(binEl.value.replace(/[^01]/g, ""), 2), binEl));
  decEl.addEventListener("input", () => updateBaseFields(parseInt(decEl.value.replace(/[^0-9]/g, ""), 10), decEl));
  octEl.addEventListener("input", () => updateBaseFields(parseInt(octEl.value.replace(/[^0-7]/g, ""), 8), octEl));
  hexEl.addEventListener("input", () => updateBaseFields(parseInt(hexEl.value.replace(/[^0-9a-fA-F]/g, ""), 16), hexEl));
  asciiEl.addEventListener("input", () => {
    const ch = asciiEl.value;
    updateBaseFields(ch.length > 0 ? ch.charCodeAt(0) : NaN, asciiEl);
  });

  function updateBaseFields(n, sourceEl) {
    const all = [binEl, decEl, octEl, hexEl, asciiEl];
    if (isNaN(n) || n < 0) { all.forEach((el) => { if (el !== sourceEl) el.value = ""; }); return; }
    if (sourceEl !== binEl) binEl.value = n.toString(2);
    if (sourceEl !== decEl) decEl.value = n.toString(10);
    if (sourceEl !== octEl) octEl.value = n.toString(8);
    if (sourceEl !== hexEl) hexEl.value = n.toString(16).toUpperCase();
    if (sourceEl !== asciiEl) asciiEl.value = (n >= 0 && n <= 255) ? String.fromCharCode(n) : "";
  }
}
