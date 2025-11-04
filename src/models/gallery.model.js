const crypto = require('crypto');
const fileManager = require('../utils/fileManager.js');

class GalleryModel {
    // R (Read All) - Obtener todos los productos

    static getAll() {
        try {
            const db = fileManager.readDatabase();

            return db.galleries;
        } catch(e) {
            console.error(`[GalleryModel.getAll] Error leyendo la base de datos:`, e.message);
            throw new Error(`Database error`);
        }
    }

    static getById(uid) {
        try {
            const db = fileManager.readDatabase();

            const meta = db.galleries.find(gal => gal.uid === uid);

            if (!meta) {
                console.warn(`[GalleryModel.getById] UID no encontrado: ${uid}`);
                return null;
            }

            const galleryData = fileManager.readGallery(uid);

            // Combina metadatos y contenido
            return {
                ...meta,
                ...galleryData
            };
        } catch (e) {
            console.error(`[GalleryModel.getById] Error leyendo la galería ${uid}:`, e);
            throw new Error('Database read error');
        }
    }

    static filter(uid, type) {
        try {
            const db = fileManager.readGallery(uid);

            if(!db)
                throw new Error(`The gallery doesnt exists`);
            
            const result = db.images.filter(image => image.type === type);

            return result;
        } catch(e) {
            console.error(`[GalleryModel.filter] Error leyendo la galería ${uid}:`, e);
            throw new Error('Database read error');
        }
    }

    static create(name, desc) {
        try {
            const db = fileManager.readDatabase();

            // Generar nuevo registro
            const galleryData = {
                uid: crypto.randomUUID(),
                name,
                description: desc || "My online gallery",
                visible: false, // asegura el booleano
                timestamp: Date.now()
            };

            // Insertar en la base de datos json
            db.galleries.push(galleryData);
            fileManager.writeDatabase(db);

            // Crear carpeta de la galería
            fileManager.writeGallery(galleryData.uid, { images: [] });

            console.log(`[GalleryModel.create] Gallery created successfully - UID: ${galleryData.uid}`);

            // Devuelve todo el objeto
            return galleryData;
        } catch (e) {
            console.error(`[GalleryModel.create] Error:`, e);
            
            throw new Error('Database write error');
        }
    }

    static update(uid, attrs) {
        try {
            const db = fileManager.readDatabase();

            const searchResult = db.galleries.find(gal => gal.uid === uid);

            if (!searchResult)
                throw new Error(`Wrong gallery uid or it doesn't exist!`);

            const validAttributes = ['name', 'description', 'visible'];
            const objectKeys = Object.keys(attrs);
            const unexpectedKeys = objectKeys.filter(key => !validAttributes.includes(key));

            if (unexpectedKeys.length > 0) 
                throw new Error(`Unexpected attributes: ${unexpectedKeys}`);

            // Actualizamos solo el array interno
            db.galleries = db.galleries.map(gal => 
                gal.uid === uid ? { ...gal, ...attrs } : gal
            );

            // Guardamos el objeto completo
            fileManager.writeDatabase(db);

            console.log(`Gallery ${uid} updated successfully`);
            return true;
        } catch (e) {
            console.log(`Error updating gallery ${uid}: ${e}`);
            return false;
        }
    }

    static delete(uid){
        try {
            const db = fileManager.readDatabase();

            const index = db.galleries.findIndex(g => g.uid === uid);

            if (index === -1)
                throw new Error(`The gallery ${uid} doesn't exist`);

            // Eliminar directamente del array
            db.galleries.splice(index, 1);

            fileManager.writeDatabase(db);
            fileManager.deleteGallery(uid);

            console.log(`Gallery ${uid} deleted successfully`);

            return true;
        } catch (e) {
            console.log(`Error on gallery delete: ${e}`);

            return false;
        }
    }

    static upload(uid, file) {
        try {
            const db = fileManager.readGallery(uid);

            const uniqueSuffix = 'image_' + Math.round(Math.random() * 1E9);

            fileManager.writeImage(uniqueSuffix, file);

            const image = {
                name: uniqueSuffix,
                uploadedAt: Date.now(),
                size: file.size,
                type: file.mimetype.split('/')[1],
            };

            db.images.push(image);

            fileManager.writeGallery(uid, db);

            return image;
        }catch(e){
            throw new Error(`Image upload error: ${e.message}`);
        }
    }

    static download(uid, filename) {
         // TO DO
    }
}

module.exports = GalleryModel;
