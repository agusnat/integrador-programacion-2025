const fs = require('fs');
const path = require('path');

// --- Rutas base ---
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'data', 'db.json');
const GALLERIES_FOLDER = path.join(ROOT_DIR, 'data', 'galleries');
const UPLOADS_FOLDER = path.join(ROOT_DIR, 'uploads');

/** Lee la base de datos principal */
function readDatabase() {
    return readJSON(DB_PATH, { galleries: [] });
}

/** Escribe en la base de datos principal */
function writeDatabase(data) {
    writeJSON(DB_PATH, data);
}

/** Lee una galería individual por su UID */
function readGallery(uid) {
    return readJSON(galPath(uid), { images: [] });
}

/** Escribe una galería individual */
function writeGallery(uid, data) {
    writeJSON(galPath(uid), data);
}

const galPath = (uid) => { return path.join(GALLERIES_FOLDER, `${uid}.json`) };

const deleteGallery = (uid) => {
    try {
        const gal = galPath(uid);

        if (!fs.existsSync(gal)) 
            throw new Error(`deleteGallery: No existe la galería ${uid}`);
        
        fs.unlinkSync(gal);
        console.log(`deleteGallery: Galería ${uid} eliminada`);
    } catch (error) {
        throw new Error(`Error al eliminar la galería ${uid}:`, error);
    }
};

/**
 * Lee un archivo JSON y devuelve su contenido como objeto.
 * @param {string} filePath - Ruta absoluta del archivo.
 * @param {object} defaultData - Valor por defecto si ocurre un error.
 * @returns {object}
 */
function readJSON(filePath, defaultData = {}) {
    try {
        // Si el archivo no existe
        if (!fs.existsSync(filePath)) {
            console.warn(`Archivo no encontrado: ${filePath}`);
            return defaultData;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer JSON (${filePath}):`, error);
        return defaultData;
    }
}

/**
 * Escribe datos JSON en un archivo de forma formateada.
 * @param {string} filePath - Ruta absoluta del archivo.
 * @param {object} data - Datos a escribir.
 */
function writeJSON(filePath, data) {
    try {
        // Asegura que el directorio exista
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        // Escribe el archivo
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error al escribir JSON (${filePath}):`, error);
    }
}

function writeImage(filename, file){

    fs.writeFile(`${UPLOADS_FOLDER}/${filename}${path.extname(file.originalname)}`, file.buffer, (err) => { 
        if(err) { 
            console.log(err); 
            return false;     
        } 
        return true;   
    });
}

module.exports = { readGallery, readDatabase, writeGallery, writeDatabase, deleteGallery, writeImage };