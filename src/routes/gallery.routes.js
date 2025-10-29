// src/routes/producto.routes.js
const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/gallery.controller');

// Definición de las Rutas (Endpoints REST)
router.get('/', GalleryController.getAll);       // GET /api/gallery
router.get('/:uid', GalleryController.getById);    // GET /api/gallery/:uid
router.post('/', GalleryController.create);             // POST /api/gallery
router.put('/', GalleryController.put);      // PUT /api/gallery
router.delete('/', GalleryController.delete);     // DELETE /api/gallery

module.exports = router;
