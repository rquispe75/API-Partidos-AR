// Recibe peticiones, invoca al modelo y responde JSON al cliente
const modelo = require('../modelos/partidos.modelo');

// GET /api/partidos
exports.listar = (req, res) => res.json(modelo.listar());

// GET /api/partidos/:id
exports.buscarPorId = (req, res) => {
  const partido = modelo.buscar(Number(req.params.id));
  if (!partido) return res.status(404).json({ error: 'Partido no encontrado, prueba con otro ID o lista de partidos' });
  res.json(partido);
};

// GET /api/partidos?nombre=Baradero
exports.filtrar = (req, res) => {
  const q = req.query.nombre;
  if (!q) return res.json(modelo.listar()); // Sin query, devuelve todo
  res.json(modelo.filtrar(q));
};

// GET /api/partidos?nombre=xxx&anoFundacion=yyyy&cantidadHab_min=zzz&cantidadHab_max=www
exports.filtrar = (req, res) => {
  try {
    const {
      nombre,
      anoFundacion,
      cantidadHab_min,
      cantidadHab_max
    } = req.query;

    // si no hay filtros → lista completa
    if (
      !nombre &&
      !anoFundacion &&
      !cantidadHab_min &&
      !cantidadHab_max
    ) {
      return res.json(modelo.listar());
    }

    // conversiones numéricas (pueden lanzar Error si vienen mal)
    const filtros = {
      nombre: nombre || undefined,
      anoFundacion: anoFundacion ? Number(anoFundacion) : undefined,
      cantidadHab_min: cantidadHab_min ? Number(cantidadHab_min) : undefined,
      cantidadHab_max: cantidadHab_max ? Number(cantidadHab_max) : undefined
    };

    // validamos que los números sean positivos
    if (
      (filtros.anoFundacion && filtros.anoFundacion < 1515) ||
      (filtros.anoFundacion && filtros.anoFundacion > new Date().getFullYear()) ||
      (filtros.cantidadHab_min && filtros.cantidadHab_min < 0) ||
      (filtros.cantidadHab_max && filtros.cantidadHab_max < 0)
    ) {
      return res.status(400).json({ error: 'Rango de valores inválido' });
    }

    const resultado = modelo.filtrarAvanzado(filtros);
    return res.json(resultado);

  } catch (err) {
    // cualquier error de conversión u otro imprevisto
    console.error('[FILTRAR] Error:', err.message);
    return res.status(400).json({ error: 'Parámetros de búsqueda incorrectos' });
  }
};

// POST /api/partidos  (validador ya verificó body)
exports.crear = (req, res) => {
  try {
    const todos = modelo.listar();
    // siguiente ID
    const maxId = todos.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const nuevo = { id: maxId + 1, ...req.body };
    modelo.crear(nuevo);
    res.status(201).json({ msg: 'Registro nuevo creado', id: nuevo.id, nombre: nuevo.nombre });
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
};

// PUT /api/partidos/:id
exports.actualizar = (req, res) => {
  try { modelo.actualizar(Number(req.params.id), req.body); res.json({ msg: 'Registro actualizado', id: Number(req.params.id), cambios: req.body }); }
  catch (e) { res.status(404).json({ error: e.message }); }
};

// DELETE /api/partidos/:id
exports.eliminar = (req, res) => {
  try { modelo.eliminar(Number(req.params.id)); res.json({ msg: 'Registro eliminado', id: Number(req.params.id) }); }
  catch (e) { res.status(404).json({ error: e.message }); }
};

// GET /api/partidos/stats (endpoint extra)
exports.stats = (req, res) => {
  const datos = modelo.listar();
  const total = datos.length;
  const totalHab = datos.reduce((s, p) => s + p.cantidadHab, 0);
  res.json({ total, totalHabitantes: totalHab });
};