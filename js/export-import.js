/**
 * export-import.js
 * Bundles all local app data into one JSON backup file, and restores it.
 * "Bookmarks" in the export intentionally mirrors Favorites — the app
 * only has one save-for-later concept, exposed under both keys so a
 * future Bookmarks feature can read/write the same export shape
 * without a second parallel data store (avoids duplicating Favorites).
 */

const ExportImport = (() => {
  function buildBackup() {
    return {
      app: "AME Toolbox",
      version: window.APP_VERSION || "unknown",
      exportedAt: new Date().toISOString(),
      favorites: window.Favorites.getAll(),
      bookmarks: window.Favorites.getAll(),
      history: window.History.getAll(),
      calcHistory: window.CalcHistory ? window.CalcHistory.getAll() : [],
      settings: window.Settings.getAll(),
      notes: window.Notes ? window.Notes.getAll() : {}
    };
  }

  function exportBackup() {
    const backup = buildBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `ame-toolbox-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /** @param {File} file @returns {Promise<{ok:boolean, message:string}>} */
  function importBackup(file) {
    return new Promise((resolve) => {
      if (!file) { resolve({ ok: false, message: "No file selected." }); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (data.favorites) localStorage.setItem("ame_favorites", JSON.stringify(data.favorites));
          if (data.history) localStorage.setItem("ame_recent", JSON.stringify(data.history));
          if (data.calcHistory) localStorage.setItem("ame_calc_history", JSON.stringify(data.calcHistory));
          if (data.settings) localStorage.setItem("ame_settings", JSON.stringify(data.settings));
          if (data.notes) localStorage.setItem("ame_notes", JSON.stringify(data.notes));
          window.Settings.apply();
          resolve({ ok: true, message: "Backup imported successfully." });
        } catch (err) {
          resolve({ ok: false, message: "Invalid or corrupted backup file." });
        }
      };
      reader.onerror = () => resolve({ ok: false, message: "Could not read the selected file." });
      reader.readAsText(file);
    });
  }

  return { exportBackup, importBackup, buildBackup };
})();

window.ExportImport = ExportImport;
