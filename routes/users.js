const express = require('express');
const fs = require('fs');
const router = express.Router();
const USERS_FILE = './users.json';

// Cargar usuarios del archivo
const loadUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) || [];
    } catch (err) {
        return [];
    }
};

// Guardar usuarios en el archivo
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// Obtener todos los usuarios
router.get('/', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// Obtener un usuario por ID
router.get('/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const users = loadUsers();
    const user = users.find(u => u.user_id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
    const { user_id, username, expires_at, default_message, default_image_url, image_id } = req.body;

    if (!user_id || !username) {
        return res.status(400).json({ message: 'Los campos "user_id" y "username" son requeridos.' });
    }

    const users = loadUsers();
    if (users.some(u => u.user_id === user_id)) {
        return res.status(400).json({ message: 'El ID de usuario ya existe.' });
    }

    const newUser = { user_id, username, expires_at, default_message, default_image_url, image_id };
    users.push(newUser);
    saveUsers(users);

    res.status(201).json(newUser);
});

// Actualizar un usuario por ID
router.put('/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const { username, expires_at, default_message, default_image_url, image_id } = req.body;

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    users[userIndex] = { ...users[userIndex], username, expires_at, default_message, default_image_url, image_id };
    saveUsers(users);

    res.json({ message: 'Usuario actualizado correctamente.', user: users[userIndex] });
});

// Eliminar un usuario por ID
router.delete('/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id, 10);

    const users = loadUsers();
    const newUsers = users.filter(u => u.user_id !== userId);

    if (users.length === newUsers.length) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    saveUsers(newUsers);
    res.json({ message: 'Usuario eliminado correctamente.' });
});

module.exports = router;
