// input validation is performed as middleware to separate from business logic

export function validateNote(req, res, next) {
    const { title, content } = req.body ?? {};

    const errors = [];

    if (typeof title !== 'string' || title.trim().length === 0) {
        errors.push("title is required and must be a non-empty string");
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
        errors.push("content is required and must be a non-empty string");
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors }); // note: error 422 is Unprocessable Entity, request is well-formed but fails business rules
    }

    next();
}
