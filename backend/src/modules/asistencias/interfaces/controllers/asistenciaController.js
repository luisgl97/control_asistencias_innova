const sequelizeAsistenciaRepository = require("../../infrastructure/repositories/sequelizeAsistenciaRepository");
const sequelizeUsuarioRepository = require("../../../usuarios/infrastructure/repositories/sequelizeUsuarioRepository");
const sequelizeRegistrosDiariosRepository = require("../../../registros_diarios/infrastructure/repositories/sequelizeRegistrosDiariosRepository");


const obtenerAsistencias = require("../../application/useCases/obtenerAsistencias");
const obtenerAsistenciasPorUsuario = require("../../application/useCases/obtenerAsistenciasPorUsuario");
const registrarIngreso = require("../../application/useCases/registrarIngreso");
const registrarSalida = require("../../application/useCases/registrarSalida");
const obtenerReporteAsistencias = require("../../application/useCases/obtenerReporteAsistencias");
const obtenerAsistenciasDelDia = require("../../application/useCases/obtenerAsistenciasDelDia");
const verificarAsistenciaDelUsuarioDelDia = require("../../application/useCases/verificarAsistenciaDelUsuarioDelDia");
const autorizarHorasExtras = require("../../application/useCases/autorizarHorasExtras");
const obtenerMapaUbicaciones = require("../../application/useCases/obtenerMapaUbicaciones");
const registrarInicioRefrigerio = require("../../application/useCases/registrarInicioRefrigerio")
const registrarFinRefrigerio = require("../../application/useCases/registrarFinRefrigerio");
const obtenerDetalleAsistencia = require("../../application/useCases/obtenerDetalleAsistencia");

const asistenciaRepository = new sequelizeAsistenciaRepository(); // Instancia del repositorio de usuario
const usuarioRepository = new sequelizeUsuarioRepository(); // Instancia del repositorio de asistencia
const registrosDiariosRepository = new sequelizeRegistrosDiariosRepository()

const AsistenciaController = {
  
  async obtenerAsistencias(_, res) {
    try {
      const { codigo, respuesta } = await obtenerAsistencias(
        asistenciaRepository
      );
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerAsistenciasPorUsuario(req, res) {
    try {

      const { usuario_id, fecha_inicio, fecha_fin } = req.body; 

      const { codigo, respuesta } = await obtenerAsistenciasPorUsuario(
        usuario_id,
        fecha_inicio,
        fecha_fin,
        asistenciaRepository,
        usuarioRepository,
      );
      
      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerAsistenciasDelDia(req, res) {
    try {

      const { fecha } = req.body; 

      const { codigo, respuesta } = await obtenerAsistenciasDelDia(
        fecha,
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
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async verificarAsistenciaDelUsuarioDelDia(req, res) {
    try {
      const usuario_id = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT
      const { codigo, respuesta } = await verificarAsistenciaDelUsuarioDelDia(
        usuario_id,
        req.body,
        asistenciaRepository,
        registrosDiariosRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async autorizarHorasExtras(req, res) {
    try {
      const {asistencia_id} = req.body; 

      
      const { codigo, respuesta } = await autorizarHorasExtras(
        asistencia_id,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

    async obtenerMapaUbicaciones(req, res) {
    try {
      const {fecha} = req.body; 

      
      const { codigo, respuesta } = await obtenerMapaUbicaciones(
        fecha,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async registrarInicioRefrigerio(req, res) {
    try {
      const {asistencia_id, hora_inicio_refrigerio} = req.body; 

      const { codigo, respuesta } = await registrarInicioRefrigerio(
        asistencia_id,
        hora_inicio_refrigerio,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

    async registrarFinRefrigerio(req, res) {
    try {
     
      const {asistencia_id, hora_fin_refrigerio} = req.body; 

      
      const { codigo, respuesta } = await registrarFinRefrigerio(
        asistencia_id,
        hora_fin_refrigerio,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },

  async obtenerDetalleAsistencia(req, res) {
    try {
     
      const {asistencia_id} = req.body; 

      const { codigo, respuesta } = await obtenerDetalleAsistencia(
        asistencia_id,
        asistenciaRepository
      );

      res.status(codigo).json(respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message, estado: false });
    }
  },
};

module.exports = AsistenciaController;
