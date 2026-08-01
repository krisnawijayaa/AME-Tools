/**
 * toast.js
 * Tiny shared toast/snackbar utility used across every page
 * (Home, converters, calculators, settings) so this isn't duplicated
 * per-file. Exposes window.showToast(message).
 */

let toastTimer = null;

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

window.showToast = showToast;
