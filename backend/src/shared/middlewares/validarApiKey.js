async function validarApiKey(req, res, next) {
  try {
    const auth = req.headers["authorization"] || ""; // header en minúscula
    
    const parts = auth.split(" ");

    if (parts[0] !== "ApiKey" || !parts[1]) {
      return res.status(401).json({ mensaje: "API key inválida" });
    }

    const key = parts[1];

    if (key !== process.env.API_KEY_MARCATE) {
      return res.status(401).json({ mensaje: "No autorizado" });
    }

    // API key válida, continúa la ejecución
    return next();
  } catch (error) {
    //console.error("Error en validarApiKey:", error);
    return res.status(417).json({ mensaje: "API key inválida" });
  }
}

module.exports = { validarApiKey };
