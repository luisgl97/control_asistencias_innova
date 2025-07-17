const sequelizeFilialRepository = require('../../infrastructure/repositories/sequelizeFilialRepository');

const obtenerFiliales = require('../../application/useCases/obtenerFiliales'); 

const filialRepository = new sequelizeFilialRepository(); // Instancia del repositorio de filial

const FilialController = {

    async obtenerFiliales(req, res) {
        try {
            
            const filiales = await obtenerFiliales(filialRepository); // Llamamos al caso de uso para obtener las filiales
            res.status(200).json(filiales.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },


};

module.exports = FilialController;