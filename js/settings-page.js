/**
 * settings-page.js
 * Controller for pages/settings.html. Reads/writes via the shared
 * Settings module (js/settings.js) and ExportImport (js/export-import.js).
 */

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  renderAppearance();
  renderUnits();
  renderPrecision();
  renderPreferences();
  renderData();
  renderVersion();
  if (window.lucide) lucide.createIcons();
});

function pillRow(containerId, options, current, onSelect) {
  const el = document.getElementById(containerId);
  el.innerHTML = options.map((opt) => `<button class="type-pill ${opt.value === current ? "active" : ""}" data-value="${opt.value}">${opt.label}</button>`).join("");
  el.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      el.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onSelect(btn.dataset.value);
    });
  });
}

function renderAppearance() {
  pillRow("appearanceRow", [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "system", label: "System Default" }
  ], window.Settings.get("appearance"), (v) => {
    window.Settings.set("appearance", v);
    window.showToast && window.showToast("Appearance updated");
  });
}

function renderUnits() {
  pillRow("unitsRow", [
    { value: "metric", label: "Metric" },
    { value: "imperial", label: "Imperial" }
  ], window.Settings.get("units"), (v) => {
    window.Settings.set("units", v);
    window.showToast && window.showToast("Preferred unit system updated");
  });
}

function renderPrecision() {
  pillRow("precisionRow", [0, 1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) })),
    String(window.Settings.get("precision")), (v) => {
      window.Settings.set("precision", parseInt(v, 10));
      window.showToast && window.showToast("Decimal precision updated");
    });
}

function toggleRow(containerId, label, desc, settingKey, unsupported) {
  const el = document.getElementById(containerId);
  const checked = window.Settings.get(settingKey);
  el.innerHTML = `
    <div class="settings-row">
      <div class="settings-row-text">
        <div class="settings-row-label">${label}</div>
        ${desc ? `<div class="settings-row-desc">${desc}</div>` : ""}
        ${unsupported ? `<div class="settings-row-desc" style="color:var(--orange);">Not supported on this device/browser</div>` : ""}
      </div>
      <label class="switch">
        <input type="checkbox" id="${containerId}Input" ${checked ? "checked" : ""} ${unsupported ? "disabled" : ""} aria-label="${label}" />
        <span class="switch-slider"></span>
      </label>
    </div>`;
  if (!unsupported) {
    document.getElementById(`${containerId}Input`).addEventListener("change", (e) => {
      window.Settings.set(settingKey, e.target.checked);
      window.showToast && window.showToast(`${label} ${e.target.checked ? "enabled" : "disabled"}`);
    });
  }
}

function renderPreferences() {
  toggleRow("autoCopyRow", "Auto Copy Result", "Automatically copy calculator results to clipboard", "autoCopy");
  toggleRow("hapticsRow", "Haptic Feedback", "Vibrate on key taps and results", "haptics", !("vibrate" in navigator));
  toggleRow("animationsRow", "Enable Animations", "Fade-ins, ripple effect, and smooth transitions", "animations");
  toggleRow("keepAwakeRow", "Keep Screen Awake", "Prevent the screen from sleeping while a tool is open", "keepAwake", !("wakeLock" in navigator));
}

function renderData() {
  document.getElementById("exportBtn").addEventListener("click", () => {
    window.ExportImport.exportBackup();
    window.showToast && window.showToast("Backup exported");
  });

  document.getElementById("importInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const res = await window.ExportImport.importBackup(file);
    window.showToast && window.showToast(res.message);
    if (res.ok) setTimeout(() => window.location.reload(), 900);
    e.target.value = "";
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all settings to default? This won't affect Favorites or History.")) return;
    window.Settings.reset();
    window.showToast && window.showToast("Settings reset to default");
    setTimeout(() => window.location.reload(), 700);
  });
}

function renderVersion() {
  const el = document.getElementById("settingsVersion");
  if (el) el.textContent = `AME Toolbox v${window.APP_VERSION || "?"}`;
}
