// src/models/producto.model.js
const fs = require('fs');
const path = require('path');

// Define la ruta absoluta al archivo JSON
const DB_FOLDER = path.join(__dirname, '..', '..', 'database');
const DB_PATH = path.join(DB_FOLDER, 'db.json');
const GALLERIES_FOLDER = path.join(DB_FOLDER, 'galleries');

// --- Funciones Auxiliares para el manejo de archivos ---

function readData(path) {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer la base de datos:", error);
        return { galleries: [] }; 
    }
}

function writeData(path, data) {
    try {
        // El 'null, 2' formatea el JSON para que sea legible
        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al escribir en la base de datos:", error);
    }
}

const readDatabase = (path) => {
    return readData(DB_PATH);
};

const writeDatabase = (data) => {
    return writeData(DB_PATH, data);
};

const readGallery = (uid) => {
    const galPath = path.join(GALLERIES_FOLDER, `${uid}.json`);
    return readData(galPath);
};

const writeGallery = (data, uid) => {
    return writeData(path.join(GALLERIES_FOLDER, `${uid}.json`), data);
}

// --- Clase Modelo (CRUD) ---

class GalleryModel {
    // R (Read All) - Obtener todos los productos

    static getAll() {
        try {
            const db = readDatabase();

            return db.galleries;
        } catch(e) {
            console.log(`Error getting all galleries: ${e}`)
            return [];
        }
    }

    static getById(uid) {
        const db = readDatabase();

        const searchResult = db.galleries.find(gal => gal.uid === uid);

        if(!searchResult)
            return null;

        const galleryData = readGallery(uid);

        return galleryData;
    }

    static create(name, desc, visible) {
        try {
            const db = readDatabase();
            
            const galleryData = {
                uid: crypto.randomUUID(), 
                name, 
                description: desc ? desc : "My online gallery",
                images: 0,
                visible: visible ? visible : false,
                timestamp: Date.now()
            };

            db.galleries.push(galleryData);

            console.log(db);
            //writeDatabase(db);
            //writeGallery({}, galleryData.uid);

            console.log(`Gallery created successfully - UID: ${galleryData.uid}`);

            return galleryData.uid;
        } catch(e) {
            console.log(`There's was an error on create: ${e}`);

            return e;
        }
    }

    static update(uid, attrs){
        try {
            const db = readDatabase();

            const searchResult = db.galleries.find(gal => gal.uid === uid);

            if(!searchResult)
                throw new Error(`Wrong gallery uid or it doesn't exists!`);

            const validAttributes = ['name', 'description', 'visible'];
            const objectKeys = Object.keys(attrs);
            const unexpectedKeys = objectKeys.filter(key => !validAttributes.includes(key));

            if (unexpectedKeys.length > 0) 
                throw new Error(`Unexpected attributes: ${unexpectedKeys}`);
            
            const updatedData = db.galleries.map(galleries => {
                if (galleries.uid === uid) { 
                    return {
                    ...galleries, ...attrs
                    };
                }
                return galleries;
            });            

            //writeDatabase(updatedData);
            console.log(updatedData);

            console.log(`Gallery ${uid} updated successfully`);

            return true;
        } catch (e) {
            console.log(`Error updating gallery ${uid}: ${e}`);

            return false;
        }
    }

    static delete(uid){
        try {
            const db = readDatabase();

            const searchedGal = db.galleries.find(gallery => {gallery.uid === uid});

            if(!searchedGal)
                throw new Error(`The gallery ${uid} doesn't exists`);

            const galleries = db.galleries.filter(gallery => { gallery.uid !== uid });

            writeDatabase(galleries);

            console.log(`Gallery ${uid} deleted successfully`);

            return true;
        } catch (e) {
            console.log(`Error on gallery delete: ${e}`);

            return false;
        }
    }
}

module.exports = GalleryModel;
