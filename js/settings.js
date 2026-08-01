/**
 * settings.js
 * Generic key/value settings store (localStorage) + concrete defaults
 * and an apply() routine that every page calls on load so appearance /
 * animation / precision preferences take effect app-wide without
 * duplicating logic per page.
 */

const Settings = (() => {
  const KEY = "ame_settings";

  const DEFAULTS = {
    appearance: "dark",       // "dark" | "light" | "system"
    units: "metric",          // "metric" | "imperial" (preferred default unit system)
    precision: 4,             // decimal places, 0-5
    autoCopy: false,          // auto-copy calculator result
    haptics: true,            // vibrate on key actions, if supported
    animations: true,         // fade-in / ripple / transitions
    keepAwake: false,         // Screen Wake Lock while a tool is open
    calcAngleMode: "DEG"      // used by the Scientific Calculator
  };

  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      const stored = raw ? JSON.parse(raw) : {};
      return { ...DEFAULTS, ...stored };
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  function get(key, fallback) {
    const all = getAll();
    if (Object.prototype.hasOwnProperty.call(all, key)) return all[key];
    return fallback !== undefined ? fallback : DEFAULTS[key];
  }

  function set(key, value) {
    const all = getAll();
    all[key] = value;
    localStorage.setItem(KEY, JSON.stringify(all));
    apply();
  }

  function setMany(obj) {
    const all = { ...getAll(), ...obj };
    localStorage.setItem(KEY, JSON.stringify(all));
    apply();
  }

  function reset() {
    localStorage.removeItem(KEY);
    apply();
  }

  /** Applies visual/behavioral settings to the current document. Safe to call on every page load. */
  function apply() {
    const s = getAll();
    const root = document.documentElement;

    // Appearance: "system" follows prefers-color-scheme, default is dark either way
    let theme = s.appearance;
    if (theme === "system") {
      theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
    }
    root.setAttribute("data-theme", theme);

    // Animations toggle: adds a class that CSS uses to disable transitions/fade-in/ripple
    root.classList.toggle("no-animations", !s.animations);

    // Keep screen awake (Wake Lock API) — best-effort, only while supported
    if (s.keepAwake && "wakeLock" in navigator) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }

  let wakeLockRef = null;
  async function requestWakeLock() {
    try {
      if (!wakeLockRef) wakeLockRef = await navigator.wakeLock.request("screen");
    } catch (e) {
      // Ignore — e.g. tab not visible, or unsupported
    }
  }
  function releaseWakeLock() {
    if (wakeLockRef) {
      wakeLockRef.release().catch(() => {});
      wakeLockRef = null;
    }
  }

  /** Haptic feedback helper other modules can call on key taps/results. */
  function vibrate(pattern = 12) {
    if (getAll().haptics && navigator.vibrate) navigator.vibrate(pattern);
  }

  return { get, set, setMany, getAll, reset, apply, vibrate, DEFAULTS };
})();

window.Settings = Settings;
