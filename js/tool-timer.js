/**
 * tool-timer.js
 * Stopwatch and Countdown Timer, packaged together since they share the
 * same start/pause/reset + interval-tick pattern.
 */

const ToolTimer = (() => {
  // ---------- Stopwatch ----------
  let swInterval = null, swStart = 0, swElapsed = 0, laps = [];

  function renderStopwatch(container) {
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Stopwatch</h3>
        <div class="timer-display" id="swDisplay">00:00.00</div>
        <div class="timer-controls">
          <button class="chip" id="swStartBtn">Start</button>
          <button class="chip" id="swLapBtn">Lap</button>
          <button class="chip" id="swResetBtn">Reset</button>
        </div>
        <div class="tool-list" id="swLaps" style="margin-top:14px;"></div>
      </div>`;
    document.getElementById("swStartBtn").addEventListener("click", toggleStopwatch);
    document.getElementById("swLapBtn").addEventListener("click", addLap);
    document.getElementById("swResetBtn").addEventListener("click", resetStopwatch);
    updateStopwatchDisplay();
  }

  function toggleStopwatch() {
    const btn = document.getElementById("swStartBtn");
    if (swInterval) {
      clearInterval(swInterval);
      swInterval = null;
      swElapsed += Date.now() - swStart;
      btn.textContent = "Resume";
    } else {
      swStart = Date.now();
      swInterval = setInterval(updateStopwatchDisplay, 30);
      btn.textContent = "Pause";
    }
  }

  function addLap() {
    if (!swInterval && swElapsed === 0) return;
    const total = swElapsed + (swInterval ? Date.now() - swStart : 0);
    laps.unshift(total);
    renderLaps();
  }

  function resetStopwatch() {
    clearInterval(swInterval);
    swInterval = null; swElapsed = 0; laps = [];
    document.getElementById("swStartBtn").textContent = "Start";
    renderLaps();
    updateStopwatchDisplay();
  }

  function renderLaps() {
    const el = document.getElementById("swLaps");
    if (!el) return;
    el.innerHTML = laps.map((t, i) => `<div class="tool-row"><div class="t-info"><div class="t-title">Lap ${laps.length - i}</div></div><div class="t-sub">${formatTime(t)}</div></div>`).join("");
  }

  function updateStopwatchDisplay() {
    const total = swElapsed + (swInterval ? Date.now() - swStart : 0);
    const el = document.getElementById("swDisplay");
    if (el) el.textContent = formatTime(total);
  }

  function formatTime(ms) {
    const cs = Math.floor((ms % 1000) / 10);
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }

  // ---------- Countdown Timer ----------
  let tmInterval = null, tmRemaining = 0, tmTotal = 0;

  function renderCountdown(container) {
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <h3>Timer</h3>
        <div class="field" style="display:flex;gap:8px;justify-content:center;">
          <div class="input-group" style="max-width:80px;"><input type="text" inputmode="numeric" id="tmMin" placeholder="min" /></div>
          <div class="input-group" style="max-width:80px;"><input type="text" inputmode="numeric" id="tmSec" placeholder="sec" /></div>
        </div>
        <div class="timer-display" id="tmDisplay">00:00</div>
        <div class="timer-controls">
          <button class="chip" id="tmStartBtn">Start</button>
          <button class="chip" id="tmResetBtn">Reset</button>
        </div>
      </div>`;
    document.getElementById("tmStartBtn").addEventListener("click", toggleTimer);
    document.getElementById("tmResetBtn").addEventListener("click", resetTimer);
  }

  function toggleTimer() {
    const btn = document.getElementById("tmStartBtn");
    if (tmInterval) {
      clearInterval(tmInterval); tmInterval = null; btn.textContent = "Resume";
      return;
    }
    if (tmRemaining <= 0) {
      const min = parseInt(document.getElementById("tmMin").value, 10) || 0;
      const sec = parseInt(document.getElementById("tmSec").value, 10) || 0;
      tmRemaining = tmTotal = (min * 60 + sec) * 1000;
      if (tmRemaining <= 0) return;
    }
    let last = Date.now();
    btn.textContent = "Pause";
    tmInterval = setInterval(() => {
      const now = Date.now();
      tmRemaining -= (now - last);
      last = now;
      if (tmRemaining <= 0) {
        tmRemaining = 0;
        clearInterval(tmInterval); tmInterval = null;
        btn.textContent = "Start";
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        window.showToast && window.showToast("Time's up!");
      }
      updateTimerDisplay();
    }, 200);
  }

  function resetTimer() {
    clearInterval(tmInterval); tmInterval = null; tmRemaining = 0; tmTotal = 0;
    document.getElementById("tmStartBtn").textContent = "Start";
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const el = document.getElementById("tmDisplay");
    if (!el) return;
    const s = Math.ceil(tmRemaining / 1000);
    el.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  return { renderStopwatch, renderCountdown };
})();

window.ToolTimer = ToolTimer;
