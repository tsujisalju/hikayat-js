//old router, handle method, url and segments manually, now using Express

import { getNotes, createNote, getNote, updateNote, deleteNote } from "./handlers/notes.js";

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Not Found' }))
}

/*export default*/ function router(req, res) {
    const { method, url } = req;
    const segments = url.split("/").filter(Boolean);

    if (segments[0] !== "notes") {
        return notFound(res);
    }

    // /notes
    if (segments.length === 1) {
        if(method === "GET") {
            return getNotes(req, res);
        }
        if(method === "POST") {
            return createNote(req, res);
        }
        return notFound(res);
    }

    // /notes/:id
    if (segments.length === 2) {
        const id = Number(segments[1]);
        if (Number.isNaN(id)) return notFound(res);
        if (method === "GET") return getNote(req, res, id);
        if (method === "PUT") return updateNote(req, res, id);
        if (method === "DELETE") return deleteNote(req, res, id);
        return notFound(res);
    }

    return notFound(res);
}
