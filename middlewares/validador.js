// Verifica que el body de POST/PUT tenga la estructura y tipos correctos
// ADEMÁS:  - no repita nombre
//          - no repita id (solo en PUT, porque en POST el id se genera automáticamente)
const modelo = require('../modelos/partidos.modelo');

module.exports = (req, res, next) => {
  const { nombre, cantidadHab, anoFundacion, localidades } = req.body;

  /* ---------- formato básico ---------- */
  if (!nombre || typeof nombre !== 'string')
    return res.status(400).json({ error: 'Nombre inválido, debe ser un string' });

  if (!Number.isInteger(cantidadHab) || cantidadHab <= 0)
    return res.status(400).json({ error: 'Cantidad de Habitantes inválida, debe ser un número entero positivo' });

  if (!Number.isInteger(anoFundacion) || anoFundacion < 1515 || anoFundacion > 2023)
    return res.status(400).json({ error: 'Año de Fundación inválido, debe estar entre 1515 y 2023' });

  if (!Array.isArray(localidades) || !localidades.length)
    return res.status(400).json({ error: 'Localidades inválidas, debe tener al menos una localidad' });

  for (const l of localidades) {
    if (!l.nombre || !Number.isInteger(l.codigoPostal))
      return res.status(400).json({ error: 'Localidad inválida, verifica el Codigo Postal' });
  }

  /* ---------- duplicados ---------- */
const todos = modelo.listar();

// nombre repetido (POST) → pero permitido si es el mismo ID (solo en PUT)
const yaExiste = todos.some(
  p => p.nombre.toLowerCase() === nombre.toLowerCase() && p.id !== Number(req.params.id)
);

if (yaExiste) {
  return res.status(409).json({ error: 'Nombre de partido duplicado' });
}
  next();
};