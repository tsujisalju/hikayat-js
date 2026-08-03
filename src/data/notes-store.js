let notes = [];
let nextId = 1;

export function getAll() {
    return notes;
}

export function getById(id) {
    return notes.find((note) => note.id === id);
}

export function create(title, content) {
    const note = { id: nextId++, title, content };
    notes.push(note);
    return note;
}

export function update(id, title, content) {
    const note = getById(id);
    if (!note) return null;
    note.title = title;
    note.content = content;
    return note;
}

export function remove(id) {
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) return false;
    notes.splice(index, 1);
    return true;
}
