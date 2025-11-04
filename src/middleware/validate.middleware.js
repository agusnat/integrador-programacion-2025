// src/middleware/validate.js

// Helper para responder errores de validación de forma consistente
function badRequest(res, message) {
    return res.status(400).json({ error: 'Validation error', message });
}

// --- Validaciones reusables ---
function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}

// --- Middlewares de validación ---

// POST /api/gallery
function validateCreate(req, res, next) {
    const name = req.body?.name;
    const description = req.body?.description;

    if (!isNonEmptyString(name) || !isNonEmptyString(description)) {
        return badRequest(res, "Name and description can't be empty");
    }

    if (typeof name !== 'string' || typeof description !== 'string') {
        return badRequest(res, 'Params must be string');
    }

    if (
        name.length <= 6 || name.length >= 256 ||
        description.length <= 6 || description.length >= 256
    ) {
        return badRequest(res, 'Params size invalid (Min characters: 6 / Max: 256)');
    }

    next();
}

// GET /api/gallery/:uid  |  DELETE /api/gallery/:uid
function validateUid(req, res, next) {
    const { uid } = req.params;

    if (!isNonEmptyString(uid)) {
        return badRequest(res, 'UID must be specified');
    }

    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    if(!regex.test(uid))
        return badRequest(res, 'Wrong UID');

    next();
}

// GET /api/gallery/:uid/filter?type=...
function validateFilter(req, res, next) {
    const { type } = req.query;
    if (!isNonEmptyString(type)) {
        return badRequest(res, 'Empty query (type required)');
    }
    next();
}

// PUT /api/gallery
function validatePut(req, res, next) {
    const { uid, attrs } = req.body || {};
    if (!isNonEmptyString(uid)) {
        return badRequest(res, 'Empty params: uid');
    }
    // opcional: validar que attrs sea objeto si lo necesitás
    if (attrs !== undefined && (typeof attrs !== 'object' || Array.isArray(attrs))) {
        return badRequest(res, 'attrs must be an object');
    }
    next();
}

// POST /api/gallery/:uid/upload
function validateUpload(req, res, next) {
    if (!req.file) {
        return badRequest(res, 'No file received. Use field name "image"');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(req.file.mimetype)) {
        return badRequest(res, 'Invalid file extension');
    }

    next();
}

module.exports = {
    validateCreate,
    validateUid,
    validateFilter,
    validatePut,
    validateUpload,
};
