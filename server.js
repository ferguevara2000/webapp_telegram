const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware para manejar JSON en las solicitudes
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
};
app.use(cors(corsOptions));

// Ruta para obtener todas las imágenes
app.get('/images', (req, res) => {
    fs.readFile('./database.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer la base de datos:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        let images = [];
        try {
            images = JSON.parse(data) || [];
        } catch (e) {
            console.warn('El archivo JSON estaba vacío o malformado. Se inicializará con un array vacío.');
            images = [];
        }

        res.json(images);
    });
});

// Ruta para obtener una imagen por ID
app.get('/images/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    fs.readFile('./database.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer la base de datos:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        let images = [];
        try {
            images = JSON.parse(data) || [];
        } catch (e) {
            console.warn('El archivo JSON estaba vacío o malformado.');
            images = [];
        }

        const image = images.find(img => img.id === id);
        if (image) {
            res.json(image);
        } else {
            res.status(404).json({ message: 'Imagen no encontrada' });
        }
    });
});

// Ruta para agregar una nueva imagen
app.post('/images', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'El campo "url" es requerido.' });
    }

    fs.readFile('./database.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer la base de datos:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        let images = [];
        try {
            images = JSON.parse(data) || [];
        } catch (e) {
            console.warn('El archivo JSON estaba vacío o malformado. Se inicializará con un array vacío.');
            images = [];
        }

        // Generar un nuevo ID
        const newId = images.length > 0 ? images[images.length - 1].id + 1 : 1;

        // Crear la nueva imagen
        const newImage = { id: newId, url };

        // Agregarla al array
        images.push(newImage);

        // Guardar en el archivo JSON
        fs.writeFile('./database.json', JSON.stringify(images, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error al escribir en la base de datos:', writeErr);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            res.status(201).json(newImage);
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
