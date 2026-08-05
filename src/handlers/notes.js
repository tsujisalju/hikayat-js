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
    const { q, tag } = req.query;
    if (tag) {
        return res.json(notesStore.getByTag(tag));
    }
    if (q) {
        return res.json(notesStore.search(q));
    }
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

export function createNote(req, res) {
    const { title, content, tags, type, items } = req.body; // note: req is a stream of data chunks, express handles parsing for you
    const note = type === "checklist"
        ? notesStore.createChecklist(title, items, tags)
        : notesStore.create(title, content, tags);
    res.status(201).json(note);
}

export function updateNote(req, res) {
    const id = Number(req.params.id)
    const { title, content, tags, items, type } = req.body;
    const updated = notesStore.update(id, title, content, tags, items, type);
    if (!updated) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.json(updated);
}

export function addTagToNote(req, res) {
    const id = Number(req.params.id);
    const { tag } = req.body;

    if (typeof tag !== 'string' || tag.trim().length === 0) {
        return res.status(422).json({ error: "tag must be a non-empty string" });
    }

    const updated = notesStore.addTag(id, tag);
    if (!updated) {
        return res.status(404).json({ error: "Note not found" });
    }

    res.json(updated);
}

export function deleteNote(req, res) {
    const id = Number(req.params.id);
    const removed = notesStore.remove(id);
    if (!removed) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
}
