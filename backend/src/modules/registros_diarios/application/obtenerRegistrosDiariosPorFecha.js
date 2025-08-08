const { formatearRegistros } = require("../infrastructure/services/formatearRegistrosDiariosPorFecha");

module.exports = async (fecha, registrosDiariosRepository) => {

    const registrosDiariosPorFecha = await registrosDiariosRepository.obtenerRegistrosDiariosPorFecha(fecha);

    const registros = formatearRegistros(registrosDiariosPorFecha)
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: registros.length == 0 ? "Registros diarios por fecha no registradas" : "Registros diarios por fecha encontrados",
            estado: true,
            total: registros.length,
            datos: registros,
        },
    };
} 