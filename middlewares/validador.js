// Verifica que el body de POST/PUT tenga la estructura y tipos correctos
module.exports = (req, res, next) => {
  // Validaciones básicas
  const { nombre, cantidadHab, anoFundacion, localidades } = req.body;
  if (!nombre || typeof nombre !== 'string') return res.status(400).json({ error: 'Nombre inválido' });
  if (!Number.isInteger(cantidadHab) || cantidadHab <= 0) return res.status(400).json({ error: 'Cantidad de Habitantes inválido' });
  if (!Number.isInteger(anoFundacion) || anoFundacion < 1515 || anoFundacion > 2023) return res.status(400).json({ error: 'Año de Fundación inválido' });
  if (!Array.isArray(localidades) || !localidades.length) return res.status(400).json({ error: 'Localidades inválido' });
  for (const l of localidades) {
    if (!l.nombre || !Number.isInteger(l.codigoPostal)) return res.status(400).json({ error: 'Localidad inválida' });
  }
  // Si todo OK, pasa al controlador
  next();
};