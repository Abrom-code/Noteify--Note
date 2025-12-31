// Noteify Main Application

// Global Variables
let notes = [];
let filteredNotes = [];
let editingIndex = null;
let currentUser = null;
let sortBy = "newest";
let filterByTag = "all";

// DOM Elements
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const searchInput = document.getElementById("searchInput");
const scratchPad = document.getElementById("scratchPad");

// Modal Elements
const noteModal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  currentUser = StorageManager.getCurrentUser();

  if (!currentUser) {
    UIManager.showNotification("Please login first", "error");
    window.location.href = "login.html";
    return;
  }

  // Initialize application
  initializeApp();
});

function initializeApp() {
  // Display welcome message
  UIManager.displayWelcomeMessage(currentUser.name);

  // Load user data
  loadUserData();

  // Setup event listeners
  setupEventListeners();

  // Initial render
  renderNotes();
  UIManager.updateNotesCount(notes.length);

  // If opened from file viewer to edit a specific note, handle it now
  try {
    const openId = localStorage.getItem("openNoteIdForEdit");
    if (openId) {
      const idx = notes.findIndex((n) => String(n.id) === String(openId));
      if (idx >= 0) {
        // open edit modal for this note
        editingIndex = idx;
        modalTitle.textContent = "Edit Note";
        noteTitle.value = notes[idx].title;
        noteBody.value = notes[idx].body;
        UIManager.showModal(noteModal);
      }
      localStorage.removeItem("openNoteIdForEdit");
    }
  } catch (e) {
    console.warn("Could not process openNoteIdForEdit", e);
  }

  console.log("Noteify app initialized successfully");
}

function loadUserData() {
  notes = StorageManager.loadUserNotes(currentUser.id);
  filteredNotes = [...notes];

  // Load scratch pad
  if (scratchPad) {
    const scratchContent = StorageManager.loadScratchPad(currentUser.id);
    scratchPad.value = scratchContent;
  }
}

function setupEventListeners() {
  // Note operations
  addNoteBtn.addEventListener("click", openNewNoteModal);
  saveNoteBtn.addEventListener("click", saveNote);
  closeModalBtn.addEventListener("click", closeModal);

  // Search functionality
  searchInput.addEventListener("input", UIManager.debounce(handleSearch, 300));

  // Scratch pad auto-save
  if (scratchPad) {
    scratchPad.addEventListener(
      "input",
      UIManager.debounce(() => {
        StorageManager.saveScratchPad(currentUser.id, scratchPad.value);
      }, 1000)
    );
  }

  // Sort functionality
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortBy = this.value;
      renderNotes();
    });
  }

  // Modal close on outside click
  if (noteModal) {
    noteModal.addEventListener("click", function (e) {
      if (e.target === noteModal) {
        closeModal();
      }
    });
  }

  // Templates modal
  const templatesModal = document.getElementById("templatesModal");
  if (templatesModal) {
    templatesModal.addEventListener("click", function (e) {
      if (e.target === templatesModal) {
        TemplatesManager.closeTemplatesModal();
      }
    });
  }

  const closeTemplatesBtn = document.getElementById("closeTemplatesBtn");
  if (closeTemplatesBtn) {
    closeTemplatesBtn.addEventListener(
      "click",
      TemplatesManager.closeTemplatesModal
    );
  }

  // Tags modal
  const tagsModal = document.getElementById("tagsModal");
  if (tagsModal) {
    tagsModal.addEventListener("click", function (e) {
      if (e.target === tagsModal) {
        TagsManager.closeTagsModal();
      }
    });
  }

  const closeTagsBtn = document.getElementById("closeTagsBtn");
  if (closeTagsBtn) {
    closeTagsBtn.addEventListener("click", TagsManager.closeTagsModal);
  }
}

// Note Operations

function openNewNoteModal() {
  editingIndex = null;
  modalTitle.textContent = "New Note";
  noteTitle.value = "";
  noteBody.value = "";
  UIManager.showModal(noteModal);
  noteTitle.focus();
}

function closeModal() {
  UIManager.hideModal(noteModal);
}

function saveNote() {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (title === "" || body === "") {
    UIManager.showNotification("Please fill out all fields.", "error");
    return;
  }

  if (editingIndex === null) {
    // Create new note
    const newNote = NotesManager.createNote(title, body);
    notes.unshift(newNote);
    UIManager.showNotification("Note created successfully!", "success");
  } else {
    // Update existing note
    notes[editingIndex] = NotesManager.updateNote(
      notes[editingIndex],
      title,
      body
    );
    UIManager.showNotification("Note updated successfully!", "success");
  }

  // Save and refresh
  StorageManager.saveUserNotes(currentUser.id, notes);
  renderNotes();
  UIManager.updateNotesCount(notes.length);
  closeModal();
}

function handleSearch() {
  const keyword = searchInput.value.toLowerCase().trim();

  if (keyword === "") {
    // Show all notes
    document.querySelectorAll(".note-card").forEach((card) => {
      card.style.display = "block";
    });
    return;
  }

  // Filter notes based on title, body, and tags
  document.querySelectorAll(".note-card").forEach((card) => {
    const noteTitle = card.querySelector("h4").textContent.toLowerCase();
    const noteBody = card.querySelector("p").textContent.toLowerCase();
    const noteTags =
      card.querySelector(".note-tags")?.textContent.toLowerCase() || "";

    const searchText = noteTitle + " " + noteBody + " " + noteTags;
    card.style.display = searchText.includes(keyword) ? "block" : "none";
  });
}

// Rendering

function renderNotes() {
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    renderEmptyState();
    return;
  }

  // Filter notes by tag first
  let filteredNotes = NotesManager.filterNotesByTag(notes, filterByTag);
  // Sort the filtered notes by most recent activity (createdAt or updatedAt)
  const sortedByActivity = [...filteredNotes].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bDate - aDate;
  });

  // Limit to most recent three notes for main page display
  const shownNotes = sortedByActivity.slice(0, 3);

  // Group by tags if sorting by tags (operate on limited set)
  if (sortBy === "tags") {
    renderGroupedNotes(shownNotes);
  } else {
    renderRegularNotes(shownNotes);
  }
}

function renderEmptyState() {
  notesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>No notes yet</h3>
            <p>Click "Add Note" in the sidebar to create your first note!</p>
        </div>
    `;
}

function renderGroupedNotes(notes) {
  const { groups, untagged } = NotesManager.groupNotesByTag(notes);

  // Render tagged groups
  Object.keys(groups)
    .sort()
    .forEach((tag) => {
      const groupDiv = createTagGroup(tag, groups[tag]);
      notesContainer.appendChild(groupDiv);
    });

  // Render untagged notes
  if (untagged.length > 0) {
    const ungroupedDiv = createTagGroup("untagged", untagged, "Untagged Notes");
    notesContainer.appendChild(ungroupedDiv);
  }
}

function createTagGroup(tag, groupNotes, customTitle = null) {
  const groupDiv = document.createElement("div");
  groupDiv.style.cssText = `
        margin-bottom: 30px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 15px;
        background: rgba(255,255,255,0.02);
    `;

  const tagHeader = document.createElement("h4");
  tagHeader.style.cssText = `
        margin: 0 0 15px 0;
        color: ${tag === "untagged" ? "#999" : "#2dabff"};
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

  if (customTitle) {
    tagHeader.textContent = customTitle + " (" + groupNotes.length + ")";
  } else {
    tagHeader.innerHTML = `
            <span style="background: #2dabff; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                #${tag}
            </span>
            <span style="color: #ccc; font-size: 14px;">(${groupNotes.length} notes)</span>
        `;
  }

  groupDiv.appendChild(tagHeader);

  const notesGrid = document.createElement("div");
  notesGrid.className = "notes-grid";
  notesGrid.style.display = "grid";
  notesGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  notesGrid.style.gap = "15px";

  groupNotes.forEach((note) => {
    const originalIndex = notes.findIndex((n) => n.id === note.id);
    const noteCard = NotesManager.createNoteCard(note, originalIndex);
    notesGrid.appendChild(noteCard);
  });

  groupDiv.appendChild(notesGrid);
  return groupDiv;
}

function renderRegularNotes(sortedNotes) {
  sortedNotes.forEach((note) => {
    const originalIndex = notes.findIndex((n) => n.id === note.id);
    const noteCard = NotesManager.createNoteCard(note, originalIndex);
    notesContainer.appendChild(noteCard);
  });
}

// Global Handlers (called from other modules)

window.editNoteHandler = function (index) {
  editingIndex = index;
  modalTitle.textContent = "Edit Note";
  noteTitle.value = notes[index].title;
  noteBody.value = notes[index].body;
  UIManager.showModal(noteModal);
  noteTitle.focus();
};

window.deleteNoteHandler = function (index) {
  const note = notes[index];
  if (!confirm('Are you sure you want to delete "' + note.title + '"?')) return;

  notes.splice(index, 1);
  StorageManager.saveUserNotes(currentUser.id, notes);
  renderNotes();
  UIManager.updateNotesCount(notes.length);
  UIManager.showNotification("Note deleted successfully!", "success");
};

window.useTemplateHandler = function (template) {
  editingIndex = null;
  modalTitle.textContent = "New Note from Template";
  noteTitle.value = template.title;
  noteBody.value = template.template;
  UIManager.showModal(noteModal);
  noteTitle.focus();
};

window.selectTagHandler = function (tag) {
  filterByTag = tag;
  renderNotes();
  UIManager.updateFilterStatus(filterByTag, notes);
};

window.clearTagFilterHandler = function () {
  filterByTag = "all";
  renderNotes();
  UIManager.updateFilterStatus(filterByTag, notes);
};

// Global Functions (called from HTML)

function showTemplates() {
  TemplatesManager.showTemplates();
}

function showTagsModal() {
  TagsManager.showTagsModal(notes, filterByTag);
}

function exportNotes() {
  if (notes.length === 0) {
    UIManager.showNotification("No notes to export!", "warning");
    return;
  }

  const exportData = StorageManager.exportNotes(
    currentUser.id,
    currentUser.name,
    notes
  );
  const filename =
    "noteify-export-" + new Date().toISOString().split("T")[0] + ".json";

  StorageManager.downloadExport(exportData, filename);
  UIManager.showNotification("Notes exported successfully!", "success");
}

async function logout() {
  if (confirm("Are you sure you want to logout?")) {
    try {
      // Save scratch pad before logout
      if (scratchPad) {
        StorageManager.saveScratchPad(currentUser.id, scratchPad.value);
      }
      
      // Use the global Firebase logout function
      if (window.performLogout) {
        await window.performLogout();
      } else {
        // Fallback if global function not available
        StorageManager.removeCurrentUser();
      }

      UIManager.showNotification("Logged out successfully!", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
      
    } catch (error) {
      console.error('Main page logout error:', error);
      // Even if Firebase logout fails, remove from localStorage
      StorageManager.removeCurrentUser();
      UIManager.showNotification("Logged out successfully!", "success");
      setTimeout(() => window.location.href = "index.html", 1000);
    }
  }
}
