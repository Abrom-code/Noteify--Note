(function () {
  const notesContainer = document.getElementById("notesContainer");
  const countSpan = document.getElementById("count");
  const reloadBtn = document.getElementById("reloadBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");

  let notes = [];

  // DOM element for search
  const searchInputFile = document.getElementById("searchInputFile");

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString();
    } catch (e) {
      return iso;
    }
  }

  function renderEmpty() {
    notesContainer.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--muted)">
        <h3>No notes found</h3>
        <p>Create notes in the main app to see them here.</p>
      </div>
    `;
  }

  function createCard(note, idx) {
    const card = document.createElement("div");
    card.className = "note-card";

    const tagsHtml =
      note.tags && note.tags.length > 0
        ? '<div class="note-tags" style="margin:12px 0 8px 0;">' +
          note.tags
            .map(
              (t) =>
                `<span style="background:linear-gradient(135deg,#2dabff,#4a90e2);color:white;padding:4px 10px;border-radius:16px;font-size:10px;margin-right:6px;display:inline-block;">#${t}</span>`
            )
            .join("") +
          "</div>"
        : "";

    const previewText =
      note.body.length > 150 ? note.body.substring(0, 150) + "..." : note.body;

    card.innerHTML = `
      <div class="note-header" style="margin-bottom:12px;">
        <h4 style="margin:0;color:#fff;font-size:16px;font-weight:600;">${
          note.title
        }</h4>
      </div>
      <div class="note-content" style="margin-bottom:12px;color:#ccc;font-size:13px;">
        <p style="margin:0;">${previewText}</p>
      </div>
      ${tagsHtml}
      <div class="note-footer" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;margin-top:auto;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:#888">${formatDate(note.createdAt)} ${
      note.createdAt !== note.updatedAt
        ? '<span style="color:#ffd13d;margin-left:8px">(updated)</span>'
        : ""
    }</div>
        <div style="display:flex;gap:8px">
          <button class="small" data-action="view">View</button>
          <button class="small" data-action="edit" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white">Edit</button>
          <button class="small" data-action="delete" style="background:linear-gradient(135deg,#dc3545,#c82333);color:white">Delete</button>
        </div>
      </div>
    `;

    // view - prefer UIManager.expandNote, fallback to inline modal
    card
      .querySelector('[data-action="view"]')
      .addEventListener("click", (e) => {
        e.stopPropagation();
        if (
          window.UIManager &&
          typeof window.UIManager.expandNote === "function"
        ) {
          UIManager.expandNote(note);
          return;
        }

        // Fallback modal (mirrors UIManager.expandNote)
        const modal = document.createElement("div");
        modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

        const content = document.createElement("div");
        content.style.cssText = `
        background: #0f1724;
        color: white;
        padding: 28px;
        border-radius: 16px;
        max-width: 820px;
        width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.06);
      `;

        const createdDate = new Date(note.createdAt).toLocaleString();
        const updatedDate = new Date(note.updatedAt).toLocaleString();
        const isUpdated = note.createdAt !== note.updatedAt;

          const safeBody = String(note.body || '').replace(/^\s+/, '');
          content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:24px;">
              <h2 style="margin:0;color:white;font-size:22px;font-weight:600;">${
                note.title
              }</h2>
              <button id="closeExpandedNote" style="background:transparent;border:0;color:#999;font-size:20px;cursor:pointer;padding:6px;">×</button>
            </div>
            <div style="white-space:pre-wrap;line-height:1.6;color:#ccc;margin-bottom:24px;font-size:15px;background:rgba(255,255,255,0.02);padding:20px;border-radius:12px;">
              ${safeBody}
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;font-size:13px;color:#999;display:flex;justify-content:space-between;align-items:center;">
              <span>Created: ${createdDate}</span>
              ${isUpdated ? '<span>Last updated: ' + updatedDate + '</span>' : ''}
            </div>
          `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // close handlers
        document
          .getElementById("closeExpandedNote")
          ?.addEventListener("click", () => modal.remove());
        modal.addEventListener("click", (ev) => {
          if (ev.target === modal) modal.remove();
        });
      });

    // delete
    card
      .querySelector('[data-action="delete"]')
      .addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm('Delete note "' + note.title + '"?')) return;
        notes.splice(idx, 1);
        StorageManager.saveUserNotes(currentUser.id, notes);
        loadAndRender();
        if (window.UIManager)
          UIManager.showNotification("Note deleted", "success");
      });

    // edit -> signal main app to open edit modal
    const editBtn = card.querySelector('[data-action="edit"]');
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
          // store the note id so main app can pick it up
          localStorage.setItem("openNoteIdForEdit", String(note.id));
          // navigate to main notes page to edit
          window.location.href = "main.html";
        } catch (err) {
          alert("Unable to open editor: " + err.message);
        }
      });
    }

    // no inline edit modal (removed)

    return card;
  }

  let currentUser = null;

  function loadAndRender() {
    if (!StorageManager) {
      notesContainer.innerHTML = "<p>Storage module not available.</p>";
      return;
    }

    currentUser = StorageManager.getCurrentUser();
    if (!currentUser) {
      notesContainer.innerHTML =
        '<div style="padding:20px;color:var(--muted)">No user logged in. Open the main app and login to view your notes.</div>';
      countSpan.textContent = "";
      return;
    }

    notes = StorageManager.loadUserNotes(currentUser.id) || [];
    countSpan.textContent = notes.length
      ? notes.length + " note(s)"
      : "no notes";

    if (!notes.length) {
      renderEmpty();
      return;
    }

    notesContainer.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "notes-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
    grid.style.gap = "14px";

    notes.forEach((note, i) => {
      const card = createCard(note, i);
      grid.appendChild(card);
    });

    notesContainer.appendChild(grid);
  }

  reloadBtn.addEventListener("click", loadAndRender);

  clearAllBtn.addEventListener("click", () => {
    if (!currentUser) {
      alert("No user logged in.");
      return;
    }
    if (!confirm('Clear all notes for user "' + currentUser.name + '"?'))
      return;
    notes = [];
    StorageManager.saveUserNotes(currentUser.id, notes);
    loadAndRender();
    if (window.UIManager)
      UIManager.showNotification("All notes cleared", "success");
  });

  // search
  if (searchInputFile) {
    searchInputFile.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".note-card").forEach((card) => {
        const title =
          card.querySelector("h4")?.textContent?.toLowerCase() || "";
        const body = card.querySelector("p")?.textContent?.toLowerCase() || "";
        const tags =
          card.querySelector(".note-tags")?.textContent?.toLowerCase() || "";
        const match = title.includes(q) || body.includes(q) || tags.includes(q);
        card.style.display = q ? (match ? "flex" : "none") : "flex";
      });
    });
  }

  // modal functionality removed (edit modal deleted from HTML)

  // initial
  document.addEventListener("DOMContentLoaded", loadAndRender);
  // also try immediate run in case script placed after DOM
  setTimeout(loadAndRender, 50);
})();
