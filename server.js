const express = require('express');
const cors = require('cors');
const imagesRouter = require('./routes/images');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/images', imagesRouter);
app.use('/users', usersRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
