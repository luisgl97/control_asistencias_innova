
const sequelizeRegistrosDiariosRepository = require("../../infrastructure/repositories/sequelizeRegistrosDiariosRepository");

const obtenerRegistrosDiarios = require("../../application/obtenerRegistrosDiarios");
const insertarRegistrosDiarios = require("../../application/insertarRegistrosDiarios");
const obtenerRegistrosDiariosPorFecha = require("../../application/obtenerRegistrosDiariosPorFecha");
const obtenerRegistroDiarioPorObraYFecha = require("../../application/obtenerRegistroDiarioPorObraYFecha");
const actualizarRegistrosDiarios = require("../../application/actualizarRegistrosDiarios");

const registrosDiariosRepository = new sequelizeRegistrosDiariosRepository(); 

const RegistrosDiariosController = {

    async obtenerRegistrosDiarios(_, res) {
        try {
            const { codigo, respuesta } = await obtenerRegistrosDiarios(registrosDiariosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async insertarRegistrosDiarios(req, res) {
        try {

             const asignado_por = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT

            const { codigo, respuesta } = await insertarRegistrosDiarios(asignado_por, req.body, registrosDiariosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    
    async obtenerRegistrosDiariosPorFecha(req, res) {
        try {

           const { fecha } = req.body;

            const { codigo, respuesta } = await obtenerRegistrosDiariosPorFecha(fecha, registrosDiariosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

    async obtenerRegistroDiarioPorObraYFecha(req, res) {
        try {

           const { obra_id, fecha } = req.body;

            const { codigo, respuesta } = await obtenerRegistroDiarioPorObraYFecha(obra_id, fecha, registrosDiariosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

     async actualizarRegistrosDiarios(req, res) {
        try {

             const asignado_por = req.usuario.id; // Asumiendo que el ID del usuario está en el token JWT

            const { codigo, respuesta } = await actualizarRegistrosDiarios(asignado_por, req.body, registrosDiariosRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },

};

module.exports = RegistrosDiariosController;
