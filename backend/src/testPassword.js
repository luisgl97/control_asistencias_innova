const bcrypt = require("bcryptjs");

/* Función para encriptar la contraseña */
async function encriptarPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function main() {
  const password = "Genaro123456";
  const passwordEncriptado = await encriptarPassword(password);
  console.log("🔒 Password encriptado:", passwordEncriptado);
}

main();