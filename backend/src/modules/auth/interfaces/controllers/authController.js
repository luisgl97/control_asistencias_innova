const sequelizeUsuarioRepository = require("../../../usuarios/infrastructure/repositories/sequelizeUsuarioRepository");
const loginUsuario = require("../../../usuarios/application/useCases/loginUsuario");

const usuarioRepository = new sequelizeUsuarioRepository();

const AuthController = {
   async login(req, res) {
      try {
         const { codigo, respuesta } = await loginUsuario(
            req.body,
            usuarioRepository
         );
         res.cookie("token", respuesta.token, {
            httpOnly: true,
            sameSite: "strict",
         });
         // res.cookie("token", respuesta.token, {
         //    httpOnly: true,
         //    sameSite: "None",
         //    secure: true,
         // });
         res.status(codigo).json({
            mensaje: respuesta.mensaje,
            usuario: respuesta.usuario,
            token: respuesta.token,
            estado: respuesta.estado,
         });
      } catch (error) {
         res.status(500).json({
            mensaje: "Error en login",
            error: error.message,
         });
      }
   },
};

module.exports = AuthController;
