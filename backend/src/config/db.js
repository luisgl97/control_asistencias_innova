require("dotenv").config(); //Llamamos las variables de entorno
const { Sequelize } = require("sequelize"); //Creamos la variable que almacenará la inicialización de Sequalize 

//Detectamos si estamos en producción o en desarrollo
const isProduction = process.env.NODE_ENV == "production";

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME,   // Nombre de la base de datos
    process.env.DB_USER,   // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "mysql",
      logging: false, // Para evitar logs en la consola
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci" 
      },
      pool: {
            max: isProduction ? 30 : 20, // Ajustamos según el entorno
            min: 5,
            acquire: 30000, // Tiempo máximo para obtener una conexión
            idle: 10000 // Tiempo antes de liberar una conexión inactiva
      }
    }
  );
  
module.exports = sequelize;