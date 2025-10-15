// Define los endpoints y los conecta con sus controladores
const router = require('express').Router();
const controlador = require('../controladores/partidos.controlador');
const validador = require('../middlewares/validador');  // se ejecuta antes de POST/PUT

// Rutas y sus funciones correspondientes
router.get('/', controlador.filtrar);                   // GET /api/partidos
router.get('/stats', controlador.stats);                // GET /api/partidos/stats
router.get('/resumen', controlador.listarResumido);    // GET /api/partidos/resumido
router.get('/:id', controlador.buscarPorId);            // GET /api/partidos/:id
router.post('/', validador, controlador.crear);         // POST /api/partidos
router.put('/:id', validador, controlador.actualizar);  // PUT /api/partidos/:id
router.delete('/:id', controlador.eliminar);            // DELETE /api/partidos/:id    

module.exports = router;