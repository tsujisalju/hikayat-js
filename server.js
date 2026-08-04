import express from "express";
import notesRouter from "./src/routes/notes.js";

const app = express();
const PORT = 3000;

app.use(express.json()); // this is middleware, it reads the stream, parses JSON and attaches it as req.body
app.use("/notes", notesRouter); //prepend to /notes

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
