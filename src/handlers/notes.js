import * as notesStore from "../data/notes-store.js";

export function getNotes(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(notesStore.getAll()));
}

export function createNote(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: "Invalid JSON" }));
          return;
      }

      const note = notesStore.create(parsed.title, parsed.content);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(note));
  });
}
