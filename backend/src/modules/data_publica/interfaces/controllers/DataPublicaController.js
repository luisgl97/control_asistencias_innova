
const sequelizeDataPublicaRepository = require("../../infrastructure/repositories/sequelizeDataPublicaRepository");

const obtenerAsistenciasPorFecha = require("../../application/useCases/obtenerAsistenciasPorFecha");

const dataPublicaRepository = new sequelizeDataPublicaRepository(); // Instancia del repositorio de obra

const DataPublicaController = {

    async obtenerAsistenciasPorFecha(req, res) {
        try {
          
            const { fecha, lista_dni_trabajadores } = req.body;

            const { codigo, respuesta } = await obtenerAsistenciasPorFecha(fecha, lista_dni_trabajadores, dataPublicaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    }
};

module.exports = DataPublicaController;
