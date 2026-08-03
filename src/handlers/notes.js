import * as notesStore from "../data/notes-store.js";

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
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(notesStore.getAll()));
}

export function getNote(req, res, id) {
    const note = notesStore.getById(id);
    if (!note) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Note not found" }));
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(note));
}

export async function createNote(req, res) {
    try {
        const parsed = await readBody(req);
        const note = notesStore.create(parsed.title, parsed.content);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(note));
    } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
}

export async function updateNote(req, res, id) {
    try {
        const parsed = await readBody(req);
        const updated = notesStore.update(id, parsed.title, parsed.content);
        if (!updated) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Note not found" }));
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(updated));
    } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
}

export function deleteNote(req, res, id) {
    const removed = notesStore.remove(id);
    if (!removed) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Note not found" }));
        return;
    }
    res.statusCode = 204;
    res.end();
}
