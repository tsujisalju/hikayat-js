import { ChecklistNote, Note } from "../models/Note.js";

let notes = [];
let nextId = 1;

export function getAll() {
    return notes;
}

export function getById(id) {
    return notes.find((note) => note.id === id);
}

export function create(title, content, tags = []) {
    const note = new Note(title, content, tags);
    notes.push(note);
    return note;
}

export function createChecklist(title, items, tags) {
    const note = new ChecklistNote(title, items, tags);
    notes.push(note);
    return note;
}

export function update(id, title, content, tags, items, type) {
    const note = getById(id);
    if (!note) return null;
    note.title = title;
    if (type === "checklist") {
        note.items = items.map((item) => ({ text: item.text, done: !!item.done}));
    } else {
      note.content = content;
    }
    if (tags) {
        const tagSet = new Set(tags.map((t) => t.toLowerCase().trim()));
        note.tags = [...tagSet];
    }
    return note;
}

export function addTag(id, tag) {
    const note = getById(id);
    if (!note) return null;
    const tagSet = new Set(note.tags);
    tagSet.add(tag.toLowerCase().trim());
    note.tags = [...tagSet];
    return note;
}

export function getByTag(tag) {
    const lower = tag.toLowerCase().trim();
    return notes.filter((note) => note.tags.includes(lower));
}

export function remove(id) {
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) return false;
    notes.splice(index, 1);
    return true;
}

export function search(query) {
    const lower = query.toLowerCase();
    return notes.filter((note) =>
        note.title.toLowerCase().includes(lower) ||
        note.content.toLowerCase().includes(lower));
}
