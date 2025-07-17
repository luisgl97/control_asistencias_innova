const bcrypt = require("bcryptjs");

/**
 * Prepara un usuario para ser almacenada en la base de datos
 * Hashea la contraseña y devuelve el objeto listo para guardar
 */
async function mapeoUsuarioPasswordEncriptado(datos) {
  const hashedPassword = await bcrypt.hash(datos.password, 10); // Hashea la contraseña
  return {
    ...datos, // Copia todos los demás campos del usuario
    password: hashedPassword,
  };
}

module.exports = {
  mapeoUsuarioPasswordEncriptado, // Exporta la función para que pueda ser utilizada en otros módulos
};
