
const sequelizeRegistrosDiariosRepository = require("../../infrastructure/repositories/sequelizeRegistrosDiariosRepository");

const obtenerRegistrosDiarios = require("../../application/obtenerRegistrosDiarios");
const insertarRegistrosDiarios = require("../../application/insertarRegistrosDiarios");

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

};

module.exports = RegistrosDiariosController;
