/**
 * tool-level.js
 * Bubble Level and Protractor / Angle Meter, both driven by the device's
 * orientation sensor (beta = front/back tilt, gamma = left/right tilt).
 */

const ToolLevel = (() => {
  let active = false;
  let mode = "level"; // "level" | "protractor"

  function renderLevel(container) {
    mode = "level";
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Bubble Level</h3>
        <p class="hint">Letakkan HP di atas permukaan datar. Perlu izin sensor pada beberapa browser.</p>
        <div class="level-frame">
          <div class="level-bubble" id="levelBubble"></div>
          <div class="level-crosshair"></div>
        </div>
        <div class="timer-display" id="levelReading" style="font-size:20px;">–°, –°</div>
        <button class="chip" id="levelEnableBtn" style="margin-top:10px;">Enable Sensor</button>
        <p class="hint" id="levelStatus" style="margin-top:8px;"></p>
      </div>`;
    document.getElementById("levelEnableBtn").addEventListener("click", enable);
  }

  function renderProtractor(container) {
    mode = "protractor";
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Protractor / Angle Meter</h3>
        <p class="hint">Sandarkan sisi HP pada permukaan yang ingin diukur sudutnya.</p>
        <div class="protractor-dial">
          <div class="protractor-needle" id="protractorNeedle"></div>
        </div>
        <div class="timer-display" id="protractorReading" style="font-size:26px;">0.0°</div>
        <button class="chip" id="protractorEnableBtn" style="margin-top:10px;">Enable Sensor</button>
        <p class="hint" id="protractorStatus" style="margin-top:8px;"></p>
      </div>`;
    document.getElementById("protractorEnableBtn").addEventListener("click", enable);
  }

  function enable() {
    const statusEl = document.getElementById(mode === "level" ? "levelStatus" : "protractorStatus");
    if (typeof DeviceOrientationEvent === "undefined") {
      if (statusEl) statusEl.textContent = "Sensor tidak didukung pada perangkat/browser ini.";
      return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then((res) => {
        if (res === "granted") start();
        else if (statusEl) statusEl.textContent = "Izin sensor ditolak.";
      }).catch(() => { if (statusEl) statusEl.textContent = "Gagal meminta izin sensor."; });
    } else {
      start();
    }
  }

  function start() {
    active = true;
    window.addEventListener("deviceorientation", onOrientation, true);
  }

  function onOrientation(e) {
    const beta = e.beta || 0;   // front-back tilt
    const gamma = e.gamma || 0; // left-right tilt

    if (mode === "level") {
      const bubble = document.getElementById("levelBubble");
      const reading = document.getElementById("levelReading");
      if (!bubble) return;
      const x = Math.max(-40, Math.min(40, gamma));
      const y = Math.max(-40, Math.min(40, beta));
      bubble.style.transform = `translate(${x}px, ${y}px)`;
      const level = Math.abs(gamma) < 1 && Math.abs(beta) < 1;
      bubble.classList.toggle("level-ok", level);
      if (reading) reading.textContent = `${gamma.toFixed(1)}°, ${beta.toFixed(1)}°`;
    } else {
      const needle = document.getElementById("protractorNeedle");
      const reading = document.getElementById("protractorReading");
      if (!needle) return;
      const angle = gamma;
      needle.style.transform = `rotate(${angle}deg)`;
      if (reading) reading.textContent = `${angle.toFixed(1)}°`;
    }
  }

  function destroy() {
    active = false;
    window.removeEventListener("deviceorientation", onOrientation, true);
  }

  return { renderLevel, renderProtractor, destroy };
})();

window.ToolLevel = ToolLevel;
