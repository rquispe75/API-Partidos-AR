// Verifica que el body de POST/PUT tenga la estructura y tipos correctos
// ADEMÁS:  - no repita nombre
//          - no repita id (solo en PUT, porque en POST el id se genera automáticamente)
// POST: exige todo
// PUT: solo valida lo que viene
const modelo = require('../modelos/partidos.modelo');

module.exports = (req, res, next) => {
  const esPut = req.method === 'PUT';
  const body = req.body;

  // ---------- Función auxiliar: valida un campo ----------
  const validarCampo = (clave, validador, mensaje) => {
    if (clave in body) {
      if (!validador(body[clave])) {
        return res.status(400).json({ error: mensaje });
      }
    } else if (!esPut) {
      // Si no está y no es PUT, falta campo
      return res.status(400).json({ error: `Falta el campo: ${clave}` });
    }
  };

  // ---------- Validaciones individuales ----------
  const errores = [
    validarCampo('nombre', v => typeof v === 'string', 'Nombre inválido, debe ser un string'),
    validarCampo('cantidadHab', v => Number.isInteger(v) && v > 0, 'Cantidad de Habitantes inválida, debe ser un número entero positivo'),
    validarCampo('anoFundacion', v => Number.isInteger(v) && v >= 1515 && v <= 2023, 'Año de Fundación inválido, debe estar entre 1515 y 2023'),
    validarCampo('localidades', v => Array.isArray(v) && v.length > 0, 'Localidades inválidas, debe tener al menos una localidad')
  ];

  // Si alguna validación falló, salimos
  if (errores.some(e => e)) return;

  // Validamos cada localidad que venga
  if (body.localidades) {
    for (const l of body.localidades) {
      if (!l.nombre || !Number.isInteger(l.codigoPostal)) {
        return res.status(400).json({ error: 'Localidad inválida, verifica el Código Postal' });
      }
    }
  }

  // ---------- Duplicados: solo si se envía nombre ----------
  if (body.nombre) {
    const todos = modelo.listar();
    const yaExiste = todos.some(
      p => p.nombre.toLowerCase() === body.nombre.toLowerCase() && p.id !== Number(req.params.id)
    );
    if (yaExiste) return res.status(409).json({ error: 'Nombre de partido duplicado' });
  }

  next();
};