module.exports = async (registrosDiariosRepository) => {
    const registrosDiarios = await registrosDiariosRepository.obtenerRegistrosDiarios();
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: registrosDiarios.length == 0 ? "Registros diarios no registradas" : "Registros diarios encontrados",
            estado: true,
            total: registrosDiarios.length,
            datos: registrosDiarios,
        },
    };
} 