
const sequelizeObraRepository = require("../../infrastructure/repositories/sequelizeObraRepository");

const obtenerObras = require("../../application/obtenerObras");
const registrarObra = require("../../application/registrarObra");

const obraRepository = new sequelizeObraRepository(); // Instancia del repositorio de obra

const ObraController = {


    async registrarObra(req, res) {
            try {
                const { codigo, respuesta } = await registrarObra(
                    req.body,
                    obraRepository
                );
    
                res.status(codigo).json(respuesta);
            } catch (error) {
                console.log("error", error);
                res.status(500).json({ error: error.message, estado: false });
            }
        },
    
    async obtenerObras(_, res) {
        try {
            const { codigo, respuesta } = await obtenerObras(obraRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message, estado: false });
        }
    },
};

module.exports = ObraController;
