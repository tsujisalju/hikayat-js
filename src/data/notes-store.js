let notes = [];
let nextId = 1;

export function getAll() {
    return notes;
}

export function create(title, content) {
    const note = { id: nextId++, title, content };
    notes.push(note);
    return note;
}
