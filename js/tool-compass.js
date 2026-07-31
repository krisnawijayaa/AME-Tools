/**
 * tool-compass.js
 * Digital compass using DeviceOrientationEvent. Requires user permission
 * on iOS 13+. Degrades gracefully when the sensor is unavailable.
 */

const ToolCompass = (() => {
  const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  let active = false;

  function render(container) {
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Compass</h3>
        <p class="hint">Menggunakan sensor orientasi perangkat. Perlu izin akses sensor pada beberapa browser (khususnya iOS).</p>
        <div class="compass-dial">
          <div class="compass-needle" id="compassNeedle"><i data-lucide="navigation-2" style="width:38px;height:38px"></i></div>
          <span class="compass-n">N</span>
        </div>
        <div class="compass-heading" id="compassHeading">–°</div>
        <div class="compass-direction" id="compassDirection">–</div>
        <button class="chip" id="compassEnableBtn" style="margin-top:14px;">Enable Compass</button>
        <p class="hint" id="compassStatus" style="margin-top:10px;"></p>
      </div>`;
    if (window.lucide) lucide.createIcons();
    document.getElementById("compassEnableBtn").addEventListener("click", enable);
  }

  function enable() {
    const status = document.getElementById("compassStatus");
    if (typeof DeviceOrientationEvent === "undefined") {
      status.textContent = "Compass tidak didukung pada perangkat/browser ini.";
      return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then((res) => {
        if (res === "granted") start();
        else status.textContent = "Izin sensor ditolak.";
      }).catch(() => { status.textContent = "Gagal meminta izin sensor."; });
    } else {
      start();
    }
  }

  function start() {
    if (active) return;
    active = true;
    document.getElementById("compassStatus").textContent = "Compass aktif. Jika angka tidak stabil, gerakkan HP membentuk angka 8 untuk kalibrasi.";
    window.addEventListener("deviceorientationabsolute", onOrientation, true);
    window.addEventListener("deviceorientation", onOrientation, true);
  }

  function onOrientation(e) {
    let heading;
    if (typeof e.webkitCompassHeading === "number") {
      heading = e.webkitCompassHeading; // iOS Safari, already 0=N
    } else if (e.alpha !== null) {
      heading = 360 - e.alpha; // approximate compensation for absolute alpha
    } else {
      return;
    }
    heading = ((heading % 360) + 360) % 360;
    const needle = document.getElementById("compassNeedle");
    if (needle) needle.style.transform = `rotate(${-heading}deg)`;
    const headingEl = document.getElementById("compassHeading");
    if (headingEl) headingEl.textContent = `${Math.round(heading)}°`;
    const dirEl = document.getElementById("compassDirection");
    if (dirEl) dirEl.textContent = DIRS[Math.round(heading / 45) % 8];
  }

  function destroy() {
    active = false;
    window.removeEventListener("deviceorientationabsolute", onOrientation, true);
    window.removeEventListener("deviceorientation", onOrientation, true);
  }

  return { render, destroy };
})();

window.ToolCompass = ToolCompass;
