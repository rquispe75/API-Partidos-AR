// Capa de persistencia: lee/escribe el archivo partidos.json
// Solo maneja el array "partidos" dentro de "provincias[0]"

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../data/partidos.json');

// Ruta absoluta al archivo JSON
const leer = () => JSON.parse(fs.readFileSync(FILE, 'utf-8'));
// Helper: lee todo el archivo y devuelve objeto JS
const escribir = data => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// Obtiene solo el array de partidos de Buenos Aires
const getPartidos = () => leer()[0].provincias[0].partidos;

// *---- Exporta funciones CRUD y filtros ----*

// Consultas GET
// Devuelve array completo de partidos
exports.listar = () => getPartidos();

// Busca un partido por ID (number)
exports.buscar = id => getPartidos().find(p => p.id === id);

// Filtra por coincidencia parcial en el nombre
exports.filtrar = q => getPartidos().filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()));

// Devuelve partidos que cumplan **todos** los filtros recibidos
exports.filtrarAvanzado = function (f) {
  try {
    return getPartidos().filter(p => {
      // 1. nombre (parcial, case-insensitive)
      
    if (f.nombre && f.nombre.length) {
      const ok = f.nombre.some(n => p.nombre.toLowerCase().includes(n));
      if (!ok) return false;
    }
      // 2. año exacto
      if (f.anoFundacion && p.anoFundacion !== f.anoFundacion) return false;

      // 3. cantidad de habitantes (rango)
      if (f.cantidadHab_min && p.cantidadHab < f.cantidadHab_min) return false;
      if (f.cantidadHab_max && p.cantidadHab > f.cantidadHab_max) return false;

      return true;
    });
  } catch (err) {
    // si algo falla devolvemos array vacío y dejamos que el controlador responda
    console.error('[MODELO filtrarAvanzado] Error:', err.message);
    return [];
  }
};

// Modificaciones POST/PUT/DELETE
// Agrega nuevo partido; lanza error si ID existe
exports.crear = nuevo => {
  const datos = leer();
  const partidos = datos[0].provincias[0].partidos;
  if (partidos.find(p => p.id === nuevo.id)) throw new Error('ID duplicado');
  partidos.push(nuevo);
  escribir(datos);
};

// Actualiza campos de un partido existente
exports.actualizar = (id, cambios) => {
  const datos = leer();
  const partidos = datos[0].provincias[0].partidos;
  const idx = partidos.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('ID no encontrado');
  partidos[idx] = { ...partidos[idx], ...cambios };
  escribir(datos);
};

// Elimina un partido por ID
exports.eliminar = id => {
  const datos = leer();
  const partidos = datos[0].provincias[0].partidos;
  const idx = partidos.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('ID no encontrado');
  partidos.splice(idx, 1);
  escribir(datos);
};