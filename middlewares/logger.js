// Imprime en consola y agrega línea a logs.txt por cada request
const fs = require('fs');
module.exports = (req, res, next) => {
  // Formato: [Método] ruta - fecha/hora  
  const line = `[${req.method}] ${req.originalUrl} - ${new Date().toLocaleString()}\n`;
  console.log(line.trim());               // muestra por pantalla
  fs.appendFileSync('logs.txt', line);    // persiste en archivo
  next();                                 // continúa al siguiente middleware
};