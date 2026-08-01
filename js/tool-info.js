/**
 * tool-info.js (component)
 * Renders a collapsible "Info" panel (Description, Formula, Example,
 * Common Uses, Tips, Copy Formula) for a given tool id. Falls back to a
 * short generic explanation for plain unit converters that don't have
 * a dedicated entry in data/tool-info.js.
 */

const ToolInfo = (() => {
  function genericInfo(label) {
    return {
      title: `${label} Converter`,
      description: `Konversi ${label.toLowerCase()} realtime antar satuan menggunakan faktor konversi standar internasional.`,
      formula: "value_target = value_source ÷ factor_source × factor_target",
      example: "Isi salah satu kolom satuan, kolom lainnya otomatis menyesuaikan.",
      commonUses: "Konversi cepat saat membaca manual, drawing, atau tool yang memakai satuan berbeda.",
      tips: "Nilai dibulatkan sesuai Decimal Precision di Settings."
    };
  }

  /**
   * @param {HTMLElement} container
   * @param {string} toolId - key into TOOL_INFO, or a label to use as a generic fallback
   * @param {string} [fallbackLabel] - human label used if no TOOL_INFO entry exists
   */
  function render(container, toolId, fallbackLabel) {
    const info = (window.TOOL_INFO && window.TOOL_INFO[toolId]) || genericInfo(fallbackLabel || toolId);

    container.innerHTML = `
      <div class="info-toggle-wrap">
        <button class="info-toggle-btn" id="infoToggleBtn" aria-expanded="false" aria-controls="infoBody">
          <i data-lucide="info" style="width:16px;height:16px"></i>
          <span>Info &amp; Formula</span>
          <i data-lucide="chevron-down" style="width:16px;height:16px" class="info-chevron"></i>
        </button>
        <div class="info-body hidden" id="infoBody">
          <p class="info-desc">${info.description}</p>
          <div class="info-row">
            <div class="info-row-label">Formula</div>
            <div class="info-formula-wrap">
              <code class="info-formula" id="infoFormulaText">${info.formula}</code>
              <button class="fav-btn" id="infoCopyBtn" aria-label="Copy formula"><i data-lucide="copy" style="width:15px;height:15px"></i></button>
            </div>
          </div>
          <div class="info-row"><div class="info-row-label">Example</div><p>${info.example}</p></div>
          <div class="info-row"><div class="info-row-label">Common Uses</div><p>${info.commonUses}</p></div>
          <div class="info-row"><div class="info-row-label">Tips</div><p>${info.tips}</p></div>
        </div>
      </div>
    `;

    const btn = container.querySelector("#infoToggleBtn");
    const body = container.querySelector("#infoBody");
    btn.addEventListener("click", () => {
      const isOpen = !body.classList.contains("hidden");
      body.classList.toggle("hidden", isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      btn.classList.toggle("open", !isOpen);
    });

    const copyBtn = container.querySelector("#infoCopyBtn");
    copyBtn.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(info.formula).then(() => window.showToast && window.showToast("Formula copied"));
      }
    });

    if (window.lucide) lucide.createIcons();
  }

  return { render };
})();

window.ToolInfo = ToolInfo;
