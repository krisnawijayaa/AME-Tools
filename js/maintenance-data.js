/**
 * maintenance-data.js
 * localStorage-backed data for the Maintenance category: Task Checklist
 * items and Shift Notes entries. Kept separate from notes.js (which is
 * one-note-per-tool) since these are list-based, user-generated logs.
 */

const MaintenanceData = (() => {
  const CHECKLIST_KEY = "ame_checklist";
  const SHIFTNOTES_KEY = "ame_shift_notes";

  function getChecklist() {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || []; } catch (e) { return []; }
  }
  function saveChecklist(items) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
  }
  function addTask(text) {
    const items = getChecklist();
    items.push({ id: Date.now() + Math.random().toString(36).slice(2, 5), text, done: false });
    saveChecklist(items);
    return items;
  }
  function toggleTask(id) {
    const items = getChecklist().map((t) => t.id === id ? { ...t, done: !t.done } : t);
    saveChecklist(items);
    return items;
  }
  function removeTask(id) {
    const items = getChecklist().filter((t) => t.id !== id);
    saveChecklist(items);
    return items;
  }
  function clearChecklist() {
    saveChecklist([]);
  }

  function getShiftNotes() {
    try { return JSON.parse(localStorage.getItem(SHIFTNOTES_KEY)) || []; } catch (e) { return []; }
  }
  function addShiftNote(text) {
    const notes = getShiftNotes();
    notes.unshift({ id: Date.now() + Math.random().toString(36).slice(2, 5), text, ts: Date.now() });
    localStorage.setItem(SHIFTNOTES_KEY, JSON.stringify(notes));
    return notes;
  }
  function removeShiftNote(id) {
    const notes = getShiftNotes().filter((n) => n.id !== id);
    localStorage.setItem(SHIFTNOTES_KEY, JSON.stringify(notes));
    return notes;
  }
  function clearShiftNotes() {
    localStorage.setItem(SHIFTNOTES_KEY, JSON.stringify([]));
  }

  return { getChecklist, addTask, toggleTask, removeTask, clearChecklist, getShiftNotes, addShiftNote, removeShiftNote, clearShiftNotes };
})();

window.MaintenanceData = MaintenanceData;
