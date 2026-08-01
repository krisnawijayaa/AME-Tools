/**
 * ripple.js
 * Lightweight button ripple effect, delegated from a single document
 * listener (no per-button binding needed). Respects the "Enable
 * Animations" setting via the .no-animations class on <html>.
 */

document.addEventListener("pointerdown", (e) => {
  if (document.documentElement.classList.contains("no-animations")) return;
  const target = e.target.closest(".chip, .type-pill, .category-card, .tool-row, .calc-key, .nav-item, .flashlight-btn, .info-toggle-btn");
  if (!target) return;

  target.classList.add("ripple-surface");
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const dot = document.createElement("span");
  dot.className = "ripple-dot";
  dot.style.width = dot.style.height = `${size}px`;
  dot.style.left = `${e.clientX - rect.left - size / 2}px`;
  dot.style.top = `${e.clientY - rect.top - size / 2}px`;
  target.appendChild(dot);
  setTimeout(() => dot.remove(), 500);
});
