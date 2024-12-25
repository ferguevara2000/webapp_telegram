const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta para obtener todas las imágenes
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
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

        const newId = images.length > 0 ? images[images.length - 1].id + 1 : 1;
        const newImage = { id: newId, url };

        images.push(newImage);

        fs.writeFile('./database.json', JSON.stringify(images, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error al escribir en la base de datos:', writeErr);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            res.status(201).json(newImage);
        });
    });
});

// Ruta para actualizar una imagen
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
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
            console.warn('El archivo JSON estaba vacío o malformado.');
            images = [];
        }

        const imageIndex = images.findIndex(img => img.id === id);

        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Imagen no encontrada.' });
        }

        images[imageIndex].url = url;

        fs.writeFile('./database.json', JSON.stringify(images, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error al escribir en la base de datos:', writeErr);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            res.json({ message: 'Imagen actualizada correctamente.', image: images[imageIndex] });
        });
    });
});

module.exports = router;
