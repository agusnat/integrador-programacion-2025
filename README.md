# API REST - Galería en Vivo

## Motivación y Elección del Proyecto

La elección de desarrollar una **galería en vivo** surge de la idea de crear una base reutilizable para futuros proyectos interactivos, especialmente en contextos de eventos, festivales o exposiciones.

El concepto es simple: una **galería dinámica** donde los usuarios, mediante un **código QR**, pueden acceder a una interfaz web (frontend) y **subir imágenes en tiempo real** que se muestran al instante a todos los conectados, utilizando **WebSockets** para sincronización instantánea.

Esta API constituye la base del backend que gestiona las galerías, sus imágenes y los metadatos asociados, permitiendo futuras expansiones con tecnologías como **Socket.IO**, **React**, o **Cloudflare Workers**.

---

## Descripción General de la API

Esta API REST permite gestionar una galería de imágenes con operaciones CRUD completas:

- Crear nuevas galerías.
- Eliminar galerías existentes.
- Actualizar los metadatos de una galería (nombre, descripción, etc.).
- Subir imágenes a una galería específica.
- Filtrar imágenes por tipo (JPEG, PNG, JPG).

La API utiliza **autenticación básica (Basic Auth)** donde las credenciales se envían en formato **Base64** en el encabezado HTTP:


### Tecnologías utilizadas
- **Node.js** + **Express**
- **Multer** (manejo de archivos)
- **File System (fs)** para persistencia en JSON
- **Middlewares personalizados** para validación y autenticación

---

## Endpoints Documentados

| Método | Ruta | Descripción | Ejemplo de uso |
|:--:|:--|:--|:--|
| **GET** | `/api/gallery` | Obtiene todas las galerías (sin sus imágenes) | `/api/gallery` |
| **GET** | `/api/gallery/:uid` | Busca una galería por ID y retorna la información de sus imágenes | `/api/gallery/123abc` |
| **GET** | `/api/gallery/:uid/filter?type=png` | Filtra las imágenes de una galería por tipo (png, jpg, jpeg) | `/api/gallery/123abc/filter?type=png` |
| **POST** | `/api/gallery` | Crea una nueva galería con nombre y descripción | `/api/gallery` <br> **Body (JSON):** `{ "name": "Fiesta Anual", "description": "Evento 2025" }` |
| **PUT** | `/api/gallery` | Modifica los metadatos (nombre, descripción, etc.) de una galería | `/api/gallery` <br> **Body (JSON):** `{ "uid": "123abc", "attrs": { "name": "Nuevo nombre" } }` |
| **POST** | `/api/gallery/:uid/upload` | Sube una imagen a una galería específica (solo JPEG o PNG) | `/api/gallery/123abc/upload` <br> **FormData:** campo `image` |
| **DELETE** | `/api/gallery/:uid` | Elimina una galería por su identificador | `/api/gallery/123abc` |

---

## Middlewares Implementados

### **Logger**
Registra cada petición entrante mostrando:

[GET] /api/gallery - Tue, 04 Nov 2025 21:00:00 GMT

---

### **Authentication**
Implementa **Basic Auth**, verificando credenciales `usuario:contraseña` en encabezado `Authorization`.  
Las credenciales se codifican en Base64 y se comparan con las almacenadas en el archivo `.env`.

---

### **Validate**
Conjunto de middlewares que aseguran la integridad de los datos recibidos:
- `validateCreate` → valida nombre y descripción en creación.
- `validateUid` → valida que el UID sea válido.
- `validateFilter` → asegura que se envíe el tipo de imagen.
- `validatePut` → controla formato de los parámetros al actualizar.
- `validateUpload` → valida presencia y tipo de archivo recibido.

---

### **Multer**
Middleware encargado de manejar la subida de imágenes:
- Solo se permiten archivos **JPEG, JPG y PNG**.
- Se almacenan en la carpeta `uploads/`.
- Se renombra el archivo con un identificador único.

---

## Estructura del proyecto
```
    src/
    ├── controllers/
    │    └── gallery.controller.js
    ├── middleware/
    │    ├── auth.middleware.js
    │    ├── logger.middleware.js
    │    └── validate.middleware.js
    ├── models/
    │    └── gallery.model.js
    ├── routes/
    │    └── gallery.routes.js
    ├── index.js
    ├── database/
    │   └── db.json
    │   └── galleries/
    └── uploads/
```
