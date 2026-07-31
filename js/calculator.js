/**
 * calculator.js
 * Scientific / engineering calculator.
 * Basic ops, powers/roots, trig (DEG/RAD), log/ln, memory, ANS,
 * parentheses, percentage, history (via calc-history.js), copy result.
 */

let expr = "";
let angleMode = window.Settings ? window.Settings.get("calcAngleMode", "DEG") : "DEG";
let memory = 0;
let lastAnswer = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderKeypad();
  renderHistory();
  updateDisplay();
  updateAngleBtn();
  if (window.lucide) lucide.createIcons();
});

const KEYS = [
  ["MC", "MR", "M+", "M-"],
  ["(", ")", "%", "AC"],
  ["sin", "cos", "tan", "DEL"],
  ["x²", "√", "xʸ", "1/x"],
  ["log", "ln", "π", "e"],
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  ["0", ".", "ANS", "+"],
  ["DEG", "=", "", ""]
];

function renderKeypad() {
  const grid = document.getElementById("calcKeypad");
  grid.innerHTML = KEYS.flat().map((key) => {
    if (key === "") return `<span></span>`;
    const isOp = ["÷", "×", "−", "+", "="].includes(key);
    const isFn = ["sin", "cos", "tan", "log", "ln", "√", "x²", "xʸ", "1/x", "(", ")", "%", "π", "e", "ANS"].includes(key);
    const isMem = ["MC", "MR", "M+", "M-"].includes(key);
    const cls = key === "=" ? "calc-key calc-key-eq" : key === "AC" ? "calc-key calc-key-danger" : isOp ? "calc-key calc-key-op" : (isFn || isMem) ? "calc-key calc-key-fn" : "calc-key";
    return `<button class="${cls}" data-key="${key}">${key === "DEG" ? angleMode : key}</button>`;
  }).join("");

  grid.querySelectorAll("button[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => handleKey(btn.dataset.key));
  });
}

function handleKey(key) {
  switch (key) {
    case "AC": expr = ""; break;
    case "DEL": expr = expr.slice(0, -1); break;
    case "=": evaluate(); return;
    case "DEG":
      angleMode = angleMode === "DEG" ? "RAD" : "DEG";
      if (window.Settings) window.Settings.set("calcAngleMode", angleMode);
      updateAngleBtn();
      return;
    case "ANS": expr += `(${lastAnswer})`; break;
    case "π": expr += "π"; break;
    case "e": expr += "e"; break;
    case "×": expr += "×"; break;
    case "÷": expr += "÷"; break;
    case "−": expr += "−"; break;
    case "+": expr += "+"; break;
    case "x²": expr += "²"; break;
    case "√": expr += "√("; break;
    case "xʸ": expr += "^"; break;
    case "1/x": expr = `1/(${expr || 0})`; break;
    case "sin": case "cos": case "tan": case "log": case "ln": expr += `${key}(`; break;
    case "MC": memory = 0; updateMemoryIndicator(); return;
    case "MR": expr += `(${memory})`; break;
    case "M+": memory += safeEval(expr) || 0; updateMemoryIndicator(); return;
    case "M-": memory -= safeEval(expr) || 0; updateMemoryIndicator(); return;
    default: expr += key;
  }
  updateDisplay();
}

function updateMemoryIndicator() {
  const el = document.getElementById("calcMemory");
  el.textContent = memory !== 0 ? `M: ${window.ConverterCore.formatNumber(memory)}` : "";
}

function updateAngleBtn() {
  const btn = document.querySelector('[data-key="DEG"]');
  if (btn) btn.textContent = angleMode;
}

function updateDisplay() {
  document.getElementById("calcExpr").textContent = expr || "0";
}

/** Translate our display-friendly expression into a safe JS expression and eval it. */
function safeEval(rawExpr) {
  if (!rawExpr) return null;
  let e = rawExpr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/(\d+(\.\d+)?|\))²/g, "($1)**2")
    .replace(/\^/g, "**")
    .replace(/sin\(/g, angleMode === "DEG" ? "Math.sin(Math.PI/180*" : "Math.sin(")
    .replace(/cos\(/g, angleMode === "DEG" ? "Math.cos(Math.PI/180*" : "Math.cos(")
    .replace(/tan\(/g, angleMode === "DEG" ? "Math.tan(Math.PI/180*" : "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(");

  // Whitelist check: only digits, operators, letters used by Math.*, parentheses, dot
  if (!/^[0-9+\-*/().\sA-Za-z%]*$/.test(e)) return null;
  // Percentage: turn "50%" into "(50/100)"
  e = e.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${e});`);
    const result = fn();
    return typeof result === "number" && isFinite(result) ? result : null;
  } catch (err) {
    return null;
  }
}

function evaluate() {
  const result = safeEval(expr);
  if (result === null) {
    document.getElementById("calcExpr").textContent = "Error";
    return;
  }
  lastAnswer = result;
  const formatted = window.ConverterCore.formatNumber(result);
  window.CalcHistory.add(expr, formatted);
  expr = formatted;
  updateDisplay();
  renderHistory();
}

function copyResult() {
  const text = document.getElementById("calcExpr").textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => window.showToast && window.showToast("Copied"));
  }
}

function renderHistory() {
  const list = document.getElementById("calcHistoryList");
  if (!list) return;
  const items = window.CalcHistory.getAll();
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state">No calculation history yet.</div>`;
    return;
  }
  list.innerHTML = items.map((h) => `
    <div class="tool-row" data-id="${h.id}">
      <div class="t-info">
        <div class="t-sub">${escapeHtml(h.expression)}</div>
        <div class="t-title">= ${escapeHtml(h.result)}</div>
      </div>
      <button class="fav-btn calc-hist-copy" data-copy="${escapeHtml(h.result)}" aria-label="Copy"><i data-lucide="copy" style="width:16px;height:16px"></i></button>
      <button class="fav-btn calc-hist-del" data-del="${h.id}" aria-label="Delete"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
    </div>
  `).join("");

  list.querySelectorAll(".calc-hist-copy").forEach((btn) => btn.addEventListener("click", () => {
    if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(() => window.showToast && window.showToast("Copied"));
  }));
  list.querySelectorAll(".calc-hist-del").forEach((btn) => btn.addEventListener("click", () => {
    window.CalcHistory.remove(btn.dataset.del);
    renderHistory();
  }));
  if (window.lucide) lucide.createIcons();
}

function clearAllHistory() {
  window.CalcHistory.clear();
  renderHistory();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

window.copyResult = copyResult;
window.clearAllHistory = clearAllHistory;
