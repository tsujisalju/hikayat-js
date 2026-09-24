const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const searchForm = document.getElementById("search-form");
const clearSearchBtn = document.getElementById("clear-search");

const statusEl = document.getElementById("status");

async function fetchNotes(query = "") {
    const url = query ? `/notes?q=${encodeURIComponent(query)}` : "/notes";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`);
    return response.json();
}

async function deleteNote(id) {
    const response = await fetch(`/notes/${id}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) throw new Error(`Failed to delete note: ${response.status}`);
}

function renderNote(note) {
    const item = document.createElement("li");
    item.dataset.id = note.id;

    const title = document.createElement("h3");
    title.textContent = note.title;
    item.appendChild(title);

    if (note.type === "ChecklistNote") {
        const list = document.createElement("ul");
        for (const checkItem of note.items) {
            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = checkItem.done;
            checkbox.disabled = true; // read-only, toggling is not wired to the backend yet

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = checkItem.text;

            li.appendChild(checkbox);
            li.appendChild(label);
            list.appendChild(li);
        }
        item.appendChild(list);
    } else {
        const content = document.createElement("p");
        content.textContent = note.content;
        item.appendChild(content);
    }

    if (note.tags && note.tags.length > 0) {
        const tagsEl = document.createElement("p");
        tagsEl.textContent = `Tags: ${note.tags.join(", ")}`;
        item.appendChild(tagsEl);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete note: ${note.title}`);
    deleteBtn.addEventListener("click", () => handleDeleteNote(note.id, note.title));
    item.appendChild(deleteBtn);

    return item;
}

function renderNotes(notes) {
    notesList.innerHTML = "";

    if (notes.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No notes yet.";
        notesList.appendChild(emptyItem);
        return;
    }

    for (const note of notes) {
        notesList.appendChild(renderNote(note));
    }
}

async function loadNotes(query = "") {
    try {
        const notes = await fetchNotes(query);
        renderNotes(notes);
    } catch (err) {
        statusEl.textContent = `Could not load notes. Please try again.`;
        console.error(err);
    }
}

async function handleCreateNote(event) {
    event.preventDefault(); // stop the browser's default full-page-reload form submission

    const formData = new FormData(noteForm);
    const title = formData.get("title");
    const content = formData.get("content");

    try {
        const response = await fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            statusEl.textContent = `Could not create note: ${errorBody.errors?.join(", ") ?? "unknown error"}`;
            return
        }

        noteForm.reset();
        statusEl.textContent = "Note created.";
        await loadNotes();
        document.getElementById("title").focus();
    } catch (err) {
        statusEl.textContent = "Something went wrong creating the note.";
        console.error(err);
    }
}

async function handleDeleteNote(id, title) {
    const confirmed = window.confirm(`Are you sure you want to delete the note "${title}"?`);
    if (!confirmed) return;

    try {
        await deleteNote(id);
        statusEl.textContent = `Deleted "${title}".`;
        await loadNotes();
    } catch (err) {
        statusEl.textContent = "Something went wrong deleting the note.";
        console.error(err);
    }
}

function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(searchForm);
    const query = formData.get("q");
    loadNotes(query);
}

function handleClearSearch() {
    searchForm.reset();
    loadNotes();
}

noteForm.addEventListener("submit", handleCreateNote);
searchForm.addEventListener("submit", handleSearch);
clearSearchBtn.addEventListener("click", handleClearSearch);

loadNotes();
