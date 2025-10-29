// src/controllers/producto.controller.js
const GalleryModel = require('../models/gallery.model');

class GalleryController {
    // GET /api/gallery
    static getAll(req, res) {
        const galleries = GalleryModel.getAll();
        res.status(200).json({galleries});
    }

    // GET /api/gallery/:uid
    static getById(req, res) {
        try {
            const gallery = GalleryModel.getById(req.params.uid);

            if(!gallery)
                throw new Error("La galeria solicitada no existe");

            res.status(200).json({images: gallery.images});
        } catch(e) {
            res.status(404).json({error: `${e}`});
        }

    }

    // POST /api/gallery 
    static create(req, res) {
        try {
            const { name, description, visible } = req.body;

            if(name === undefined)
                throw new Error("Name can't be empty");
            
            if(name.length <= 6 || name.length >= 256)
                throw new Error("Name size invalid (Min characters: 6 / Max: 256)");

            if(visible)
                if(typeof visible !== "boolean")
                    throw new Error("Visible must be true or false");

            if(description)
                if(typeof description !== "string")
                    throw new Error("Description must be an string");

            const uid = GalleryModel.create(name, description, visible);
            
            res.status(200).json({uid});
        } catch(e) {
            res.status(404).json({error: `${e}`});
        }
    }

    // DELETE api/gallery
    static delete(req, res){
        try {
            const uid = req.params.uid;

            if(uid?.length < 1)
                throw new Error('Empty params');

            GalleryModel.delete(uid);

            res.status(200).json({msg: 'Gallery deleted successfully'});
        } catch (e) {
            res.status(400).json({error: `${e}`});
        }
    }

    static put(req, res) {
        try {
            const { uid, attrs } = req.body;
            
            if(uid?.length < 1)
                    throw new Error('Empty params');

            GalleryModel.update(uid, attrs);

            res.status(200).json({msg: 'Gallery updated successfully'});
        } catch(e) {
            res.status(400).json({error: `${e}`});
        }
    }
}

module.exports = GalleryController;
