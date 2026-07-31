/**
 * tools.js
 * Controller for the Tools page — switches between Compass, Stopwatch,
 * Timer, Bubble Level, Protractor, and Flashlight using the shared
 * pill-nav pattern. Each tool's own render/destroy lives in its own file.
 */

const TOOL_ITEMS = [
  { id: "compass", label: "Compass" },
  { id: "stopwatch", label: "Stopwatch" },
  { id: "timer", label: "Timer" },
  { id: "level", label: "Bubble Level" },
  { id: "protractor", label: "Protractor" },
  { id: "flashlight", label: "Flashlight" }
];

let activeTool = "compass";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tool");
  activeTool = TOOL_ITEMS.some((t) => t.id === requested) ? requested : "compass";

  window.History.add(activeTool);
  renderNav();
  showTool(activeTool);
});

function renderNav() {
  const nav = document.getElementById("typeSelector");
  nav.innerHTML = TOOL_ITEMS.map((t) => `<button class="type-pill ${t.id === activeTool ? "active" : ""}" data-tool="${t.id}">${t.label}</button>`).join("");
  nav.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTool = btn.dataset.tool;
      history.replaceState(null, "", `?tool=${activeTool}`);
      window.History.add(activeTool);
      nav.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showTool(activeTool);
    });
  });
}

function showTool(id) {
  // Tear down any active sensor listeners from the previously shown tool
  if (window.ToolCompass) window.ToolCompass.destroy();
  if (window.ToolLevel) window.ToolLevel.destroy();
  if (window.ToolFlashlight) window.ToolFlashlight.destroy();

  const container = document.getElementById("toolContent");
  switch (id) {
    case "compass": window.ToolCompass.render(container); break;
    case "stopwatch": window.ToolTimer.renderStopwatch(container); break;
    case "timer": window.ToolTimer.renderCountdown(container); break;
    case "level": window.ToolLevel.renderLevel(container); break;
    case "protractor": window.ToolLevel.renderProtractor(container); break;
    case "flashlight": window.ToolFlashlight.render(container); break;
  }
  if (window.lucide) lucide.createIcons();
}
