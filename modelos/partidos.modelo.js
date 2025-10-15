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

// Exporta funciones CRUD y filtros --------------------------
// Devuelve array completo de partidos
exports.listar = () => getPartidos();

// Busca un partido por ID (number)
exports.buscar = id => getPartidos().find(p => p.id === id);

// Filtra por coincidencia parcial en el nombre
exports.filtrar = q => getPartidos().filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()));

// Devuelve array plano con ID, Nombre del partido, Codigo Postal y Cantidad de habitantes
exports.listarResumido = () => {
  const partidos = exports.listar();
  const resultado = [];

  partidos.forEach(part => {
    part.localidades.forEach(loc => {
      resultado.push({
        nombrePartido: part.nombre,
        nombreLocalidad: loc.nombre,
        codigoPostal: loc.codigoPostal,
        poblacion: loc.poblacion
      })
    })    
  });
  return resultado;
}

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