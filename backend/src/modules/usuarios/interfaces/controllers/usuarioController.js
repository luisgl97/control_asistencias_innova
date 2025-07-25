const sequelizeUsuarioRepository = require("../../infrastructure/repositories/sequelizeUsuarioRepository");

const crearUsuario = require("../../application/useCases/crearUsuario");
const obtenerUsuarios = require("../../application/useCases/obtenerUsuarios");
const obtenerUsuarioPorId = require("../../application/useCases/obtenerUsuarioPorId");
const actualizarUsuario = require("../../application/useCases/actualizarUsuario");
const eliminarUsuario = require("../../application/useCases/eliminarUsuario");
const activarUsuario = require("../../application/useCases/activarUsuario");
const listarUsuariosPorCargo = require("../../application/useCases/listarUsuariosPorCargo");

const usuarioRepository = new sequelizeUsuarioRepository(); // Instancia del repositorio de usuario

const UsuarioController = {
    async crearUsuario(req, res) {
        try {
            const { codigo, respuesta } = await crearUsuario(
                req.body,
                usuarioRepository
            );

            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerUsuarios(_, res) {
        try {
            const { codigo, respuesta } = await obtenerUsuarios(usuarioRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerUsuarioPorId(req, res) {
        try {
            const { id } = req.params;

            const { codigo, respuesta } = await obtenerUsuarioPorId(
                Number(id),
                usuarioRepository
            );
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;

            const { codigo, respuesta } = await actualizarUsuario(
                Number(id),
                req.body,
                usuarioRepository
            );

            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { codigo, respuesta } = await eliminarUsuario(
                id,
                usuarioRepository
            );
            res.status(codigo).json({
                mensaje: "Usuario eliminado exitosamente",
                estado: true,
            });
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async activarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { codigo, respuesta } = await activarUsuario(
                id,
                usuarioRepository
            );
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async listarUsuariosPorCargo(req, res) {
        try {
            const { cargo } = req.body;
            const { codigo, respuesta } = await listarUsuariosPorCargo(cargo, usuarioRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },
};

module.exports = UsuarioController;
