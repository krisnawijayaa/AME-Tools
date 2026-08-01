/**
 * ui-components.js
 * Small reusable HTML builders shared across Home and the reference/
 * database pages (Fastener, Aircraft, Maintenance) so these patterns
 * aren't copy-pasted per page: ToolCard, ToolRow (list item + favorite
 * button), EmptyState, and a generic data-table row renderer.
 */

const UI = (() => {
  function icon(name, size = 20) {
    return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
  }

  /** Category-style card (used on Home and could be reused for sub-nav grids). */
  function toolCard({ url, icon: iconName, color, name, desc, comingSoon, onClickJs }) {
    return `
      <a class="category-card ${comingSoon ? "disabled" : ""}" href="${comingSoon ? "javascript:void(0)" : url}" ${comingSoon && onClickJs ? `onclick="${onClickJs}"` : ""}>
        ${comingSoon ? '<span class="badge-soon">Soon</span>' : ""}
        <div class="cat-icon accent-${color}">${icon(iconName, 22)}</div>
        <div class="cat-name">${name}</div>
        <div class="cat-desc">${desc}</div>
      </a>`;
  }

  /** List row with icon, title, subtitle, and an optional favorite star. */
  function toolRow(t, { showFavorite = true } = {}) {
    const isFav = showFavorite && window.Favorites ? window.Favorites.isFavorite(t.id) : false;
    return `
      <div class="tool-row">
        <a href="${t.url}" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0" data-history-id="${t.id}">
          <div class="t-icon accent-${t.color}">${icon(t.icon, 18)}</div>
          <div class="t-info">
            <div class="t-title">${t.title}</div>
            <div class="t-sub">${t.subtitle || ""}</div>
          </div>
        </a>
        ${showFavorite ? `<button class="fav-btn ${isFav ? "active" : ""}" data-id="${t.id}" aria-label="Toggle favorite">${icon("star", 18)}</button>` : ""}
      </div>`;
  }

  /** Friendly "nothing here" state. */
  function emptyState(message, iconName = "inbox") {
    return `
      <div class="empty-state">
        ${icon(iconName, 22)}
        <div style="margin-top:8px;">${message}</div>
      </div>`;
  }

  /** Binds click handlers for any .fav-btn rendered by toolRow(). */
  function bindFavoriteButtons(container, onChange) {
    container.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const active = window.Favorites.toggle(id);
        btn.classList.toggle("active", active);
        window.showToast && window.showToast(active ? "Added to favorites" : "Removed from favorites");
        if (onChange) onChange();
      });
    });
    container.querySelectorAll("[data-history-id]").forEach((a) => {
      a.addEventListener("click", () => window.History && window.History.add(a.dataset.historyId));
    });
  }

  return { icon, toolCard, toolRow, emptyState, bindFavoriteButtons };
})();

window.UI = UI;
