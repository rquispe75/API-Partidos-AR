// Punto de entrada de la API REST
// Configura Express, monta middlewares globales y define el router principal

const express = require('express');                         // Framework web
const partidosVista = require('./vistas/partidos.vista');   // Router de partidos
const logger = require('./middlewares/logger');             // Middleware personalizado

const app = express();
const PORT = 3000;

// Middleware incorporado para parsear JSON
app.use(express.json());
// Middleware que registra cada petición en consola y logs.txt
app.use(logger);

// Monta todas las rutas que empiezan con /api/partidos
app.use('/api/partidos', partidosVista);

// Captura cualquier ruta no definida y devuelve 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Levanta el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));