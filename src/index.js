// src/index.js
require('dotenv').config();
const express = require('express');
const galleryRoutes = require('./routes/gallery.routes.js');

const app = express();
const PORT = process.env.PORT;

// Middleware auth y logger
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} - ${new Date().toGMTString()}`);
    
    const authHeader = req.header('Authorization');
    const base64 = authHeader.split(' ')[1];
    const [user, password] = atob(base64).toString().split(':');

    if(user !== process.env.USER_CREDENTIALS ||
        password !== process.env.PASSWORD_CREDENTIALS)
        res.send('Error: Bad Auth credentials!');

    next();
});

// Middleware para que Express pueda leer cuerpos JSON en las peticiones
app.use(express.json());

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
