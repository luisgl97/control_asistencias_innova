module.exports = async (registrosDiariosRepository) => {

    const registrosDiariosPorFecha = await registrosDiariosRepository.registrosDiariosPorFecha();

    console.log('registrosDiariosPorFecha', registrosDiariosPorFecha);
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: registrosDiariosPorFecha.length == 0 ? "Registros diarios por fecha no registradas" : "Registros diarios por fecha encontrados",
            estado: true,
            total: registrosDiariosPorFecha.length,
            datos: registrosDiariosPorFecha,
        },
    };
} 