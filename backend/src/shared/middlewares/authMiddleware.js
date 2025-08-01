const jwt = require("jsonwebtoken");
const db = require("../../models");

// 🔹 Middleware para verificar token
async function verificarToken(req, res, next) {


  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await db.usuarios.findByPk(verificado.id);

    if (!usuario){
      return res.status(401).json({ mensaje: "Usuario no encontrado"});
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log("🔴 Token inválido:", error);
    res.status(417).json({ mensaje: "Token no válido" });
  }
}

module.exports = { verificarToken };