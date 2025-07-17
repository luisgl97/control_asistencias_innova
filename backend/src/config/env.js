const path = require("path");
const dotenv = require("dotenv");

// Cargar variables desde .env
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Confirmación en consola (puedes comentar esto en producción)
console.log("✅ Variables de entorno cargadas:", process.env.NODE_ENV);