import * as notesStore from "../data/notes-store.js";

// manual req data stream parsing
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });
}

export function getNotes(req, res) {
    res.json(notesStore.getAll());
}

export function getNote(req, res) {
    const id = Number(req.params.id) // note: express handles url parsing via path patterns (/:id)
    const note = notesStore.getById(id);
    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
}

export async function createNote(req, res) {
    const { title, content } = req.body; // note: req is a stream of data chunks, express handles parsing for you
    const note = notesStore.create(title, content);
    res.status(201).json(note);
}

export async function updateNote(req, res) {
    const id = Number(req.params.id)
    const { title, content } = req.body;
    const updated = notesStore.update(id, title, content);
    if (!updated) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.json(updated);
}

export function deleteNote(req, res) {
  const id = Number(req.params.id)
    const removed = notesStore.remove(id);
    if (!removed) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
}
