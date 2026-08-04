//new router, using express

import { Router } from "express";
import { createNote, deleteNote, getNote, getNotes, updateNote } from "../handlers/notes.js";
import { validateNote } from "../middleware/validate-notes.js";
import { createRateLimiter } from "../middleware/rate-limit.js";

const router = Router();
const searchLimiter = createRateLimiter(5, 10_000); // closure: searchLimiter has the hits instance by createRateLimiter

router.get("/", searchLimiter, getNotes);
router.post("/", validateNote, createNote);
router.get("/:id", getNote);
router.put("/:id", validateNote, updateNote);
router.delete("/:id", deleteNote);

export default router;
