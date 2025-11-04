// src/routes/producto.routes.js
const express = require('express');

const router = express.Router();

const GalleryController = require('../controllers/gallery.controller');
const {
  validateCreate,
  validateUid,
  validateFilter,
  validatePut,
  validateUpload,
} = require('../middleware/validate.middleware');

// Definición de las Rutas (Endpoints REST)
router.get('/', GalleryController.getAll);       // GET /api/gallery
router.get('/:uid/filter', validateUid, validateFilter, GalleryController.filter); // GET /api/gallery/:uid/filter
router.post('/', validateCreate, GalleryController.create);             // POST /api/gallery
router.put('/', validatePut, GalleryController.put);      // PUT /api/gallery
router.post('/:uid/upload', validateUid, validateUpload, GalleryController.upload); // POST /api/gallery/:uid/upload
router.delete('/:uid', validateUid, GalleryController.delete);     // DELETE /api/gallery/:uid
router.get('/:uid', validateUid, GalleryController.getById);    // GET /api/gallery/:uid

module.exports = router;
