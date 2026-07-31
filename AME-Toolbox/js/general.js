/**
 * general.js
 * Three tabs:
 *  1. Decimal -> Fraction (inch), rounded to nearest common denominator (1/64")
 *  2. Fraction -> Decimal
 *  3. Binary / Decimal / Hex / ASCII realtime converter
 */

let activeGeneralTab = "dec2frac";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tab");
  const valid = ["dec2frac", "frac2dec", "base"];
  activeGeneralTab = valid.includes(requested) ? requested : "dec2frac";

  const toolIdMap = { dec2frac: "decimal-fraction", frac2dec: "fraction-decimal", base: "number-base" };
  window.History.add(toolIdMap[activeGeneralTab]);

  renderTabs();
  renderDec2Frac();
  renderFrac2Dec();
  renderBaseConverter();
  switchGeneralTab(activeGeneralTab);
  if (window.lucide) lucide.createIcons();
});

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = `
    <button class="tab-btn" data-tab="dec2frac">Dec→Frac</button>
    <button class="tab-btn" data-tab="frac2dec">Frac→Dec</button>
    <button class="tab-btn" data-tab="base">Base/ASCII</button>
  `;
  tabs.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeGeneralTab = btn.dataset.tab;
      history.replaceState(null, "", `?tab=${activeGeneralTab}`);
      switchGeneralTab(activeGeneralTab);
    });
  });
}

function switchGeneralTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("dec2fracPanel").classList.toggle("hidden", tab !== "dec2frac");
  document.getElementById("frac2decPanel").classList.toggle("hidden", tab !== "frac2dec");
  document.getElementById("basePanel").classList.toggle("hidden", tab !== "base");
}

/* ---------------- Tab 1: Decimal -> Fraction ---------------- */
function renderDec2Frac() {
  const panel = document.getElementById("dec2fracPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Decimal → Fraction (Inch)</h3>
      <p class="hint">Masukkan nilai desimal inch (contoh: 0.375). Hasil dibulatkan ke pecahan terdekat, presisi hingga 1/64".</p>
      <div class="field">
        <label>Decimal (inch)</label>
        <div class="input-group">
          <input type="text" inputmode="decimal" id="decInput" placeholder="0.000" autocomplete="off" />
          <span style="color:var(--text-dim);font-size:13px;">in</span>
        </div>
      </div>
      <div class="frac-result">
        <div class="f-item"><div class="f-val" id="frac64">–</div><div class="f-label">Nearest 1/64"</div></div>
        <div class="f-item"><div class="f-val" id="frac32">–</div><div class="f-label">Nearest 1/32"</div></div>
        <div class="f-item"><div class="f-val" id="frac16">–</div><div class="f-label">Nearest 1/16"</div></div>
        <div class="f-item"><div class="f-val" id="fracExact">–</div><div class="f-label">Simplified</div></div>
      </div>
    </div>
  `;
  document.getElementById("decInput").addEventListener("input", calcDec2Frac);
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
  const el64 = document.getElementById("frac64");
  const el32 = document.getElementById("frac32");
  const el16 = document.getElementById("frac16");
  const elExact = document.getElementById("fracExact");

  if (raw.trim() === "" || isNaN(value)) {
    [el64, el32, el16, elExact].forEach((el) => (el.textContent = "–"));
    return;
  }

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

/* ---------------- Tab 2: Fraction -> Decimal ---------------- */
function renderFrac2Dec() {
  const panel = document.getElementById("frac2decPanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Fraction → Decimal</h3>
      <p class="hint">Masukkan pecahan, contoh: 3/8 atau 1 1/2 (angka bulat + pecahan).</p>
      <div class="field">
        <label>Fraction</label>
        <div class="input-group">
          <input type="text" id="fracInput" placeholder='e.g. 3/8 or 1 1/2' autocomplete="off" />
        </div>
      </div>
      <div class="result-box">
        <div class="r-label">Decimal</div>
        <div><span class="r-value" id="fracDecResult">–</span><span class="r-unit">in</span></div>
      </div>
    </div>
  `;
  document.getElementById("fracInput").addEventListener("input", calcFrac2Dec);
}

function calcFrac2Dec() {
  const raw = document.getElementById("fracInput").value.trim();
  const resultEl = document.getElementById("fracDecResult");

  if (!raw) {
    resultEl.textContent = "–";
    return;
  }

  // Support formats: "3/8", "1 1/2", "-1 3/4", "0.5" (plain decimal passthrough)
  const mixedMatch = raw.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  const simpleMatch = raw.match(/^(-?\d+)\/(\d+)$/);
  const decimalMatch = raw.match(/^-?\d*\.?\d+$/);

  let result = null;

  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den !== 0) {
      const sign = whole < 0 ? -1 : 1;
      result = whole + sign * (num / den);
    }
  } else if (simpleMatch) {
    const num = parseInt(simpleMatch[1], 10);
    const den = parseInt(simpleMatch[2], 10);
    if (den !== 0) result = num / den;
  } else if (decimalMatch) {
    result = parseFloat(raw);
  }

  resultEl.textContent = result === null || isNaN(result) ? "Invalid" : parseFloat(result.toFixed(6)).toString();
}

/* ---------------- Tab 3: Binary / Decimal / Hex / ASCII ---------------- */
function renderBaseConverter() {
  const panel = document.getElementById("basePanel");
  panel.innerHTML = `
    <div class="panel">
      <h3>Binary / Decimal / Hex / ASCII</h3>
      <p class="hint">Isi salah satu field, field lain menyesuaikan otomatis.</p>
      <div class="base-grid">
        <div class="base-row">
          <div class="b-label">Binary</div>
          <input type="text" id="baseBinary" placeholder="e.g. 01001000" autocomplete="off" />
        </div>
        <div class="base-row">
          <div class="b-label">Decimal</div>
          <input type="text" id="baseDecimal" placeholder="e.g. 72" autocomplete="off" />
        </div>
        <div class="base-row">
          <div class="b-label">Hex</div>
          <input type="text" id="baseHex" placeholder="e.g. 48" autocomplete="off" />
        </div>
        <div class="base-row">
          <div class="b-label">ASCII</div>
          <input type="text" id="baseAscii" placeholder="e.g. H" autocomplete="off" maxlength="1" />
        </div>
      </div>
      <p class="hint" style="margin-top:10px;">Catatan: ASCII hanya mendukung 1 karakter (0–255). Untuk teks lebih panjang, gunakan Binary/Decimal/Hex per-karakter.</p>
    </div>
  `;

  const binEl = document.getElementById("baseBinary");
  const decEl = document.getElementById("baseDecimal");
  const hexEl = document.getElementById("baseHex");
  const asciiEl = document.getElementById("baseAscii");

  binEl.addEventListener("input", () => {
    const n = parseInt(binEl.value.replace(/[^01]/g, ""), 2);
    updateBaseFields(n, binEl);
  });
  decEl.addEventListener("input", () => {
    const n = parseInt(decEl.value.replace(/[^0-9]/g, ""), 10);
    updateBaseFields(n, decEl);
  });
  hexEl.addEventListener("input", () => {
    const n = parseInt(hexEl.value.replace(/[^0-9a-fA-F]/g, ""), 16);
    updateBaseFields(n, hexEl);
  });
  asciiEl.addEventListener("input", () => {
    const ch = asciiEl.value;
    const n = ch.length > 0 ? ch.charCodeAt(0) : NaN;
    updateBaseFields(n, asciiEl);
  });

  function updateBaseFields(n, sourceEl) {
    if (isNaN(n) || n < 0) {
      [binEl, decEl, hexEl, asciiEl].forEach((el) => { if (el !== sourceEl) el.value = ""; });
      return;
    }
    if (sourceEl !== binEl) binEl.value = n.toString(2);
    if (sourceEl !== decEl) decEl.value = n.toString(10);
    if (sourceEl !== hexEl) hexEl.value = n.toString(16).toUpperCase();
    if (sourceEl !== asciiEl) asciiEl.value = (n >= 0 && n <= 255) ? String.fromCharCode(n) : "";
  }
}
