const sequelizeUsuarioRepository = require ("../../../usuarios/infrastructure/repositories/sequelizeUsuarioRepository");
const loginUsuario = require ("../../../usuarios/application/useCases/loginUsuario");

const usuarioRepository = new sequelizeUsuarioRepository();

const AuthController = {
  async login (req, res) {
    try {
      const resultado = await loginUsuario(req.body, usuarioRepository);
      res.status(resultado.codigo).json(resultado.respuesta);
    } catch (error) {
      res.status(500).json({ mensaje: "Error en login", error: error.message });
  }
}
}

module.exports = AuthController