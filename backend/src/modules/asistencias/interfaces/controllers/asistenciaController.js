const sequelizeAsistenciaRepository = require("../../infrastructure/repositories/sequelizeAsistenciaRepository");

const obtenerAsistencias = require("../../application/useCases/obtenerAsistencias");
const obtenerAsistenciasPorUsuario = require("../../application/useCases/obtenerAsistenciasPorUsuario");
const registrarIngreso = require("../../application/useCases/registrarIngreso");
const registrarSalida = require("../../application/useCases/registrarSalida");
const obtenerReporteAsistencias = require("../../application/useCases/obtenerReporteAsistencias");
const obtenerAsistenciasDelDia = require("../../application/useCases/obtenerAsistenciasDelDia");
const verificarAsistenciaDelUsuarioDelDia = require("../../application/useCases/verificarAsistenciaDelUsuarioDelDia");

const asistenciaRepository = new sequelizeAsistenciaRepository(); // Instancia del repositorio de usuario

const AsistenciaController = {
  async obtenerAsistencias(_, res) {
    try {
      const { codigo, respuesta } = await obtenerAsistencias(
        asistenciaRepository
      );
      console.log('respuesta', respuesta);
      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerAsistenciasPorUsuario(req, res) {
    try {
       const usuarioId = req.params.id;

      const { codigo, respuesta } = await obtenerAsistenciasPorUsuario(
        usuarioId,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerAsistenciasDelDia(req, res) {
    try {
 
      const { codigo, respuesta } = await obtenerAsistenciasDelDia(
        req.body,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async registrarIngreso(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT

      const { codigo, respuesta } = await registrarIngreso(
        usuario_id,
        req.body,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },

   async registrarSalida(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT
      
      const { codigo, respuesta } = await registrarSalida(
        usuario_id,
        req.body,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerReporteAsistencias(req, res) {
    try {
     
      const { codigo, respuesta } = await obtenerReporteAsistencias(
        req.body,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async verificarAsistenciaDelUsuarioDelDia(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT
      const { codigo, respuesta } = await verificarAsistenciaDelUsuarioDelDia(
        usuario_id,
        req.body,
        asistenciaRepository
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },
};

module.exports = AsistenciaController;
