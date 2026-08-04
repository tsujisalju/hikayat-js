//new router, using express

import { Router } from "express";
import { createNote, deleteNote, getNote, getNotes, updateNote } from "../handlers/notes.js";

const router = Router();

router.get("/", getNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
