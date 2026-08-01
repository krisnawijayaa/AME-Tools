/**
 * maintenance.js
 * Maintenance category: Task Checklist, Shift Notes, Job Timer
 * (reuses ToolTimer.renderStopwatch — no duplicated timer logic),
 * and Inspection Interval Calculator.
 */

const MAINTENANCE_TOOLS = [
  { id: "checklist", label: "Task Checklist", toolId: "task-checklist" },
  { id: "shiftnotes", label: "Shift Notes", toolId: "shift-notes" },
  { id: "jobtimer", label: "Job Timer", toolId: "job-timer" },
  { id: "interval", label: "Inspection Interval", toolId: "inspection-interval" }
];

let activeMaintenanceTool = "checklist";

document.addEventListener("DOMContentLoaded", () => {
  if (window.Settings) window.Settings.apply();
  activeMaintenanceTool = toolFromUrl();
  window.History.add(currentToolId());
  renderNav();
  showTool(activeMaintenanceTool);
});

window.addEventListener("popstate", () => {
  activeMaintenanceTool = toolFromUrl();
  syncNavActive();
  showTool(activeMaintenanceTool);
});

function toolFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("tool");
  return MAINTENANCE_TOOLS.some((t) => t.id === requested) ? requested : "checklist";
}
function currentToolId() {
  return MAINTENANCE_TOOLS.find((t) => t.id === activeMaintenanceTool).toolId;
}

function renderNav() {
  const nav = document.getElementById("typeSelector");
  nav.innerHTML = MAINTENANCE_TOOLS.map((t) => `<button class="type-pill ${t.id === activeMaintenanceTool ? "active" : ""}" data-tool="${t.id}">${t.label}</button>`).join("");
  nav.querySelectorAll(".type-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeMaintenanceTool = btn.dataset.tool;
      history.pushState(null, "", `?tool=${activeMaintenanceTool}`);
      window.History.add(currentToolId());
      syncNavActive();
      showTool(activeMaintenanceTool);
    });
  });
}
function syncNavActive() {
  document.querySelectorAll("#typeSelector .type-pill").forEach((b) => b.classList.toggle("active", b.dataset.tool === activeMaintenanceTool));
}

function showTool(id) {
  const container = document.getElementById("maintenanceContent");
  switch (id) {
    case "checklist": renderChecklist(container); break;
    case "shiftnotes": renderShiftNotes(container); break;
    case "jobtimer": window.ToolTimer.renderStopwatch(container); break;
    case "interval": renderInterval(container); break;
  }
  if (window.lucide) lucide.createIcons();
}

/* ---------------- Task Checklist ---------------- */
function renderChecklist(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Task Checklist</h3>
      <p class="hint">Checklist sederhana untuk shift/job berjalan. Tersimpan lokal di perangkat ini.</p>
      <div class="field" style="display:flex;gap:8px;">
        <div class="input-group" style="flex:1;"><input type="text" id="taskInput" placeholder="Tambah task..." autocomplete="off" /></div>
        <button class="chip" id="taskAddBtn">Add</button>
      </div>
    </div>
    <div class="tool-list" id="taskList" style="padding:0 16px;"></div>`;

  const addBtn = document.getElementById("taskAddBtn");
  const input = document.getElementById("taskInput");
  const add = () => {
    const text = input.value.trim();
    if (!text) return;
    window.MaintenanceData.addTask(text);
    input.value = "";
    renderTaskList();
  };
  addBtn.addEventListener("click", add);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
  renderTaskList();
}

function renderTaskList() {
  const list = document.getElementById("taskList");
  const items = window.MaintenanceData.getChecklist();
  if (items.length === 0) { list.innerHTML = window.UI.emptyState("Belum ada task. Tambahkan di atas.", "clipboard-list"); return; }
  list.innerHTML = items.map((t) => `
    <div class="tool-row">
      <label style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;cursor:pointer;">
        <input type="checkbox" data-toggle="${t.id}" ${t.done ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--blue);flex-shrink:0;" />
        <span style="${t.done ? "text-decoration:line-through;color:var(--text-faint);" : ""}">${escapeHtml(t.text)}</span>
      </label>
      <button class="fav-btn" data-remove="${t.id}" aria-label="Delete task"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
    </div>`).join("");
  list.querySelectorAll("[data-toggle]").forEach((el) => el.addEventListener("change", () => { window.MaintenanceData.toggleTask(el.dataset.toggle); renderTaskList(); }));
  list.querySelectorAll("[data-remove]").forEach((el) => el.addEventListener("click", () => { window.MaintenanceData.removeTask(el.dataset.remove); renderTaskList(); }));
  if (window.lucide) lucide.createIcons();
}

/* ---------------- Shift Notes ---------------- */
function renderShiftNotes(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Shift Notes</h3>
      <p class="hint">Catatan serah-terima shift, tersimpan lokal dengan timestamp.</p>
      <div class="field"><div class="input-group" style="align-items:flex-start;">
        <textarea id="shiftNoteInput" placeholder="Tulis catatan shift..." rows="3" style="flex:1;background:none;border:none;outline:none;color:var(--text);font-size:14px;font-family:inherit;resize:vertical;"></textarea>
      </div></div>
      <button class="chip" id="shiftNoteAddBtn">Add Note</button>
    </div>
    <div class="tool-list" id="shiftNoteList" style="padding:0 16px;"></div>`;
  document.getElementById("shiftNoteAddBtn").addEventListener("click", () => {
    const el = document.getElementById("shiftNoteInput");
    if (!el.value.trim()) return;
    window.MaintenanceData.addShiftNote(el.value.trim());
    el.value = "";
    renderShiftNoteList();
  });
  renderShiftNoteList();
}

function renderShiftNoteList() {
  const list = document.getElementById("shiftNoteList");
  const notes = window.MaintenanceData.getShiftNotes();
  if (notes.length === 0) { list.innerHTML = window.UI.emptyState("Belum ada catatan shift.", "sticky-note"); return; }
  list.innerHTML = notes.map((n) => `
    <div class="tool-row" style="align-items:flex-start;">
      <div class="t-info"><div class="t-sub">${new Date(n.ts).toLocaleString("id-ID")}</div><div class="t-title" style="white-space:pre-wrap;font-weight:400;font-size:14px;">${escapeHtml(n.text)}</div></div>
      <button class="fav-btn" data-remove-note="${n.id}" aria-label="Delete note"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
    </div>`).join("");
  list.querySelectorAll("[data-remove-note]").forEach((el) => el.addEventListener("click", () => { window.MaintenanceData.removeShiftNote(el.dataset.removeNote); renderShiftNoteList(); }));
  if (window.lucide) lucide.createIcons();
}

/* ---------------- Inspection Interval Calculator ---------------- */
function renderInterval(container) {
  container.innerHTML = `
    <div class="panel">
      <h3>Inspection Interval Calculator</h3>
      <p class="hint">Menghitung tanggal jatuh tempo inspeksi berikutnya berdasarkan tanggal terakhir dan interval (hari).</p>
      <div class="field"><label>Last Inspection Date</label><div class="input-group"><input type="date" id="ivLastDate" style="color:var(--text);background:none;border:none;outline:none;font-size:15px;flex:1;" /></div></div>
      <div class="field"><label>Interval</label><div class="input-group"><input type="text" inputmode="numeric" id="ivDays" placeholder="e.g. 90" /><span style="color:var(--text-dim);font-size:13px;">days</span></div></div>
      <div class="result-box"><div class="r-label">Next Due Date</div><div><span class="r-value" id="ivResult" style="font-size:20px;">–</span></div></div>
      <div class="result-box" style="margin-top:10px;"><div class="r-label">Days Remaining</div><div><span class="r-value" id="ivRemaining">–</span></div></div>
    </div>
    <div id="ivInfoPanel"></div>`;
  const calc = () => {
    const dateStr = document.getElementById("ivLastDate").value;
    const days = parseInt(document.getElementById("ivDays").value, 10);
    const resEl = document.getElementById("ivResult");
    const remEl = document.getElementById("ivRemaining");
    if (!dateStr || isNaN(days)) { resEl.textContent = "–"; remEl.textContent = "–"; return; }
    const last = new Date(dateStr);
    const due = new Date(last.getTime() + days * 86400000);
    resEl.textContent = due.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    const remaining = Math.round((due - new Date()) / 86400000);
    remEl.textContent = remaining >= 0 ? `${remaining} days` : `Overdue by ${Math.abs(remaining)} days`;
  };
  document.getElementById("ivLastDate").addEventListener("change", calc);
  document.getElementById("ivDays").addEventListener("input", calc);
  if (window.ToolInfo) window.ToolInfo.render(document.getElementById("ivInfoPanel"), "inspection-interval");
};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
