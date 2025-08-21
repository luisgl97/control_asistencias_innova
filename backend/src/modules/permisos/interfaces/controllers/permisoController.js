const sequelizePermisoRepository = require("../../infrastructure/repositories/sequelizePermisoRepository");
const sequelizeAsistenciaRepository = require("../../../asistencias/infrastructure/repositories/sequelizeAsistenciaRepository");

const obtenerPermisos = require("../../application/useCases/obtenerPermisos");
const registrarPermisoSalidaAnticipada = require("../../application/useCases/registrarPermisoSalidaAnticipada");
const obtenerPermisosPorUsuarioId = require("../../application/useCases/obtenerPermisosPorUsuarioId");

const autorizarPermisoFaltaJustificada = require("../../application/useCases/autorizarPermisoFaltaJustificada");
const autorizarPermisoTardanzaJustificada = require("../../application/useCases/autorizarPermisoTardanzaJustificada");

const permisoRepository = new sequelizePermisoRepository(); // Instancia del repositorio de permiso
const asistenciaRepository = new sequelizeAsistenciaRepository(); // Instancia del repositorio de asistencia

const PermisoController = {
  async registrarPermisoSalidaAnticipada(req, res) {
    try {

      const { codigo, respuesta } = await registrarPermisoSalidaAnticipada(
        req.body,
        permisoRepository,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerPermisos(_, res) {
    try {
      const { codigo, respuesta } = await obtenerPermisos(permisoRepository);
     
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerPermisosPorUsuarioId(req, res) {
    try {
      const { id } = req.params;

      const { codigo, respuesta } = await obtenerPermisosPorUsuarioId(
        { usuarioId: id },
        permisoRepository
      );
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async autorizarPermisoFaltaJustificada(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT

      const { codigo, respuesta } = await autorizarPermisoFaltaJustificada(
        autorizado_por = usuario_id,
        req.body,
        permisoRepository,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async autorizarPermisoTardanzaJustificada(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT

      const { codigo, respuesta } = await autorizarPermisoTardanzaJustificada(
        autorizado_por = usuario_id,
        req.body,
        permisoRepository,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },
};

module.exports = PermisoController;
