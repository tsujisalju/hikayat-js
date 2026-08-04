//new router, using express

import { Router } from "express";
import { createNote, deleteNote, getNote, getNotes, updateNote } from "../handlers/notes.js";
import { validateNote } from "../middleware/validate-notes.js";

const router = Router();

router.get("/", getNotes);
router.post("/", validateNote, createNote);
router.get("/:id", getNote);
router.put("/:id", validateNote, updateNote);
router.delete("/:id", deleteNote);

export default router;
