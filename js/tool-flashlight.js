/**
 * tool-flashlight.js
 * Flashlight/torch shortcut using the MediaStream Track "torch" constraint.
 * Only works on a subset of Android Chrome-based browsers with camera
 * permission; degrades gracefully everywhere else.
 */

const ToolFlashlight = (() => {
  let stream = null;
  let track = null;
  let on = false;

  function render(container) {
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Flashlight</h3>
        <p class="hint">Menggunakan kamera perangkat untuk mengaktifkan LED flash. Hanya didukung pada sebagian browser Android.</p>
        <button class="flashlight-btn" id="flashlightBtn">
          <i data-lucide="flashlight" style="width:34px;height:34px"></i>
        </button>
        <p class="hint" id="flashlightStatus" style="margin-top:14px;">Tap untuk menyalakan.</p>
      </div>`;
    if (window.lucide) lucide.createIcons();
    document.getElementById("flashlightBtn").addEventListener("click", toggle);
  }

  async function toggle() {
    const status = document.getElementById("flashlightStatus");
    const btn = document.getElementById("flashlightBtn");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Flashlight tidak didukung pada browser ini.";
      return;
    }
    try {
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        if (!capabilities.torch) {
          status.textContent = "Perangkat/browser ini tidak mendukung kontrol torch.";
          stopStream();
          return;
        }
      }
      on = !on;
      await track.applyConstraints({ advanced: [{ torch: on }] });
      btn.classList.toggle("active", on);
      status.textContent = on ? "Flashlight ON" : "Flashlight OFF";
      if (!on) stopStream();
    } catch (err) {
      status.textContent = "Gagal mengakses kamera / torch.";
      stopStream();
    }
  }

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
      track = null;
      on = false;
    }
  }

  function destroy() {
    stopStream();
  }

  return { render, destroy };
})();

window.ToolFlashlight = ToolFlashlight;
