// ==== GLOBAL VARIABLES ====
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingIndex = null;

// ==== ELEMENTS ====
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const searchInput = document.getElementById("searchInput");

// Modal Elements
const noteModal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// ==== OPEN MODAL ====
addNoteBtn.addEventListener("click", () => {
  editingIndex = null;
  modalTitle.textContent = "New Note";
  noteTitle.value = "";
  noteBody.value = "";
  noteModal.classList.remove("hidden");
});

// ==== CLOSE MODAL ====
closeModalBtn.addEventListener("click", () => {
  noteModal.classList.add("hidden");
});

// ==== SAVE NOTE ====
saveNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (title === "" || body === "") return alert("Please fill out all fields.");

  if (editingIndex === null) {
    notes.push({ title, body });
  } else {
    notes[editingIndex] = { title, body };
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  noteModal.classList.add("hidden");
});

// ==== RENDER NOTES ====
function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.body.substring(0, 80)}...</p>
      <div class="card-actions">
        <button onclick="editNote(${index})">✏️</button>
        <button onclick="deleteNote(${index})">🗑️</button>
      </div>
    `;

    notesContainer.appendChild(card);
  });
}
renderNotes();

// ==== EDIT NOTE ====
function editNote(index) {
  editingIndex = index;
  modalTitle.textContent = "Edit Note";
  noteTitle.value = notes[index].title;
  noteBody.value = notes[index].body;
  noteModal.classList.remove("hidden");
}

// ==== DELETE NOTE ====
function deleteNote(index) {
  if (!confirm("Delete this note?")) return;
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// ==== SEARCH NOTES ====
searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase();

  document.querySelectorAll(".note-card").forEach(card => {
    const content = card.textContent.toLowerCase();
    card.style.display = content.includes(keyword) ? "block" : "none";
  });
});
