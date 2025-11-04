// src/controllers/producto.controller.js
const GalleryModel = require('../models/gallery.model');

class GalleryController {
    // GET /api/gallery
    static getAll(req, res) {
        try {
            const galleries = GalleryModel.getAll();

            res.status(200).json({ galleries });
        } catch (e) {            
            res.status(500).json({
                error: 'Internal server error',
                message: e.message
            });
        }
    }

    // GET /api/gallery/:uid
    static getById(req, res) {
        try {
            const { uid } = req.params;
            const gallery = GalleryModel.getById(uid);

            if (!gallery) {
                return res.status(404).json({
                    error: `The UID ${uid} doesnt exists.`
                });
            }

            return res.status(200).json({images: gallery.images});
        } catch (e) {
            return res.status(500).json({
                error: 'Internal error getting gallery',
                message: e.message || e
            });
        }
    }

    // GET
    static filter(req, res) {
        try {
            const uid = req.params.uid;
            const { type } = req.query;

            const images = GalleryModel.filter(uid, type);
            
            return res.status(200).json({images});
        } catch (e) {
            return res.status(500).json({
                error: 'Internal error getting gallery',
                message: e.message || e
            });
        }
    }

    // POST /api/gallery 
    static create(req, res) {
        try {
            const name = req.body?.name;
            const description = req.body?.description;

            const meta = GalleryModel.create(name, description);

            res.status(200).json({meta});
        } catch(e) {
            return res.status(500).json({ error: 'Internal error creating gallery', message: e.message });
        }
    }

    // DELETE api/gallery
    static delete(req, res){
        try {
            const uid = req.params.uid;

            const isDeleted = GalleryModel.delete(uid);

            if(!isDeleted)
                throw new Error('There was an error on delete');

            res.status(200).json({msg: 'Gallery deleted successfully'});
        } catch (e) {
            res.status(400).json({error: `${e}`});
        }
    }

    static put(req, res) {
        try {
            const { uid, attrs } = req.body;

            const isUpdated = GalleryModel.update(uid, attrs);

            if(!isUpdated)
                throw new Error('There was an error on update');

            res.status(200).json({msg: 'Gallery updated successfully'});
        } catch(e) {
            res.status(400).json({error: `${e}`});
        }
    }

    static upload(req, res) {
        try {
            const { uid } = req.params;

            if (!req.file) {
                return res.status(400).json({ error: 'No file received. Use field name "image"' });
            }

            GalleryModel.upload(uid, req.file);

            return res.status(200).json({ message: 'Image uploaded' });
        } catch (e) {
            console.error('[Controller.upload]', e);

            return res.status(500).json({ error: 'Internal error on upload', message: e.message });
        }
    }
}

module.exports = GalleryController;
