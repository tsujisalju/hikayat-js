import express from "express";
import notesRouter from "./src/routes/notes.js";

const app = express();
const PORT = 3000;

app.use(express.json()); // this is middleware, it reads the stream, parses JSON and attaches it as req.body
app.use(express.static("public")); // serves static files from the public directory
app.use("/notes", notesRouter); //prepend to /notes

// handles broken JSON. 4 parameters is error-handling middleware, invokes when next(err) is called or a synchoronous error is thrown inside a handler
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
