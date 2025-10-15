// Recibe peticiones, invoca al modelo y responde JSON al cliente
const modelo = require('../modelos/partidos.modelo');

// GET /api/partidos
exports.listar = (req, res) => res.json(modelo.listar());

// GET /api/partidos/:id
exports.buscarPorId = (req, res) => {
  const partido = modelo.buscar(Number(req.params.id));
  if (!partido) return res.status(404).json({ error: 'Partido no encontrado' });
  res.json(partido);
};

// GET /api/partidos?nombre=Baradero
exports.filtrar = (req, res) => {
  const q = req.query.nombre;
  if (!q) return res.json(modelo.listar()); // Sin query, devuelve todo
  res.json(modelo.filtrar(q));
};

// GET /api/partidos/resumido (endpoint extra)
exports.listarResumido = (req, res) => {
  res.json(modelo.listarResumido());
};

// POST /api/partidos  (validador ya verificó body)
exports.crear = (req, res) => {
  try { modelo.crear(req.body); res.status(201).json({ msg: 'Creado' }); }
  catch (e) { res.status(409).json({ error: e.message }); }
};

// PUT /api/partidos/:id
exports.actualizar = (req, res) => {
  try { modelo.actualizar(Number(req.params.id), req.body); res.json({ msg: 'Actualizado' }); }
  catch (e) { res.status(404).json({ error: e.message }); }
};

// DELETE /api/partidos/:id
exports.eliminar = (req, res) => {
  try { modelo.eliminar(Number(req.params.id)); res.json({ msg: 'Eliminado' }); }
  catch (e) { res.status(404).json({ error: e.message }); }
};

// GET /api/partidos/stats (endpoint extra)
exports.stats = (req, res) => {
  const datos = modelo.listar();
  const total = datos.length;
  const totalHab = datos.reduce((s, p) => s + p.cantidadHab, 0);
  res.json({ total, totalHabitantes: totalHab });
};