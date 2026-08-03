import { getNotes, createNote } from "./handlers/notes.js";

export default function router(req, res) {
    const { method, url } = req;

    if(method === 'GET' && url === '/notes') {
        return getNotes(req, res);
    }
    if (method === 'POST' && url === '/notes') {
        return createNote(req, res);
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Not Found' }));
}
