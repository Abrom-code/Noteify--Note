// Notes functionality
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes(filter = "") {
  notesContainer.innerHTML = "";
  const filteredNotes = notes.filter((n) =>
    n.toLowerCase().includes(filter.toLowerCase())
  );
  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = '<p class="no-notes">You have no notes yet.</p>';
    return;
  }

  filteredNotes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.innerHTML = `
            <p>${note}</p>
            <button class="edit-btn" onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
    notesContainer.appendChild(noteDiv);
  });
}

function deleteNote(index) {
  if (confirm("Delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(searchInput.value);
  }
}

function editNote(index) {
  const newText = prompt("Edit your note:", notes[index]);
  if (newText) {
    notes[index] = newText;
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(searchInput.value);
  }
}

addNoteBtn.addEventListener("click", () => {
  const noteText = prompt("Enter your note:");
  if (noteText) {
    notes.push(noteText);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(searchInput.value);
  }
});

// Search
searchInput.addEventListener("input", (e) => renderNotes(e.target.value));

// Dark Mode
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
renderNotes();
