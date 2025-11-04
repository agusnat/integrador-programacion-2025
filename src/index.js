// src/index.js
require('dotenv').config();

const express = require('express');
const multer  = require('multer');

const galleryRoutes = require('./routes/gallery.routes.js');
const authMiddleware = require('./middleware/auth.middleware.js');
const loggerMiddleware = require('./middleware/logger.middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer();

// Middleware auth
app.use(authMiddleware);

app.use(upload.single('image'));

// Middleware para que Express pueda leer cuerpos JSON en las peticiones
app.use(express.json());

// Middleware logger
app.use(loggerMiddleware);

// Levanta las rutas de la API bajo el prefijo /api/gallery
app.use('/api/gallery', galleryRoutes);

// Ruta Raíz
app.get('/', (req, res) => {
    res.send('API REST de Galeria en Vivo funcionando.');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado. URL: http://localhost:${PORT}`);
    console.log('Ejecutando con Nodemon. Listo para CRUD.');
});
