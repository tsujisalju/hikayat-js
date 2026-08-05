import { getById } from "../data/notes-store.js";

export function validateNoteUpdate(req, res, next) {
    const { title, content, type, items } = req.body ?? {};
    const errors = [];

    const id = Number(req.params.id)
    const note = getById(id);
    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }

    const isChecklist = note.constructor.name === "ChecklistNote";
    const requestedType = type === "checklist" ? "checklist" : "note";
    const actualType = isChecklist ? "checklist" : "note";

    if ((requestedType !== actualType)) {
        errors.push("changing note type is not allowed");
    }

    if (typeof title !== 'string' || title.trim().length === 0) {
        errors.push("title is required and must be a non-empty string");
    }

    if (type === "checklist") {
      if (!Array.isArray(items) || items.length === 0) {
          errors.push("items is required and must be a non-empty array for checklist notes");
      } else {
          const invalidItem = items.some(
              (item) => typeof item.text !== "string" || item.text.trim().length === 0
          );
          if (invalidItem) {
              errors.push("each checklist item must have a non-empty text");
          }
      }
    } else {
      if (typeof content !== 'string' || content.trim().length === 0) {
          errors.push("content is required and must be a non-empty string");
      }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}
