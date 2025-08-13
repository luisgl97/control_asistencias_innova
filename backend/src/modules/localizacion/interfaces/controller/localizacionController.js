// interfaces/http/controller/localizacionController.js
const obtenerLongitudLatitud = require("../../application/useCases/obtenerLatitudLongitud");

const LocalizacionController = {
    obtenerLatLong: async (req, res) => {
        try {
            const { direccion } = req.body;
            console.log("la direccion",direccion)
            if (!direccion || typeof direccion !== 'string' || !direccion.trim()) {
                return res.status(400).json({ mensaje: 'El campo "direccion" es requerido' });
            }

            const { codigo, respuesta } = await obtenerLongitudLatitud(direccion.trim());
            
            return res.status(codigo).json(respuesta);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error al obtener las localizaciones' });
        }
    },
};

module.exports = LocalizacionController;
