module.exports = async (filialRepository) => {
    const filiales = await filialRepository.obtenerFiliales(); // Llama al método del repositorio para obtener todos las filiales
      
    return {
        codigo: 200,
        respuesta: {
            mensaje: asistencias.length == 0 ? "Filiales no registradas" : "Filiales encontrados",
            estado: true,
            total: filiales.length,
            datos: filiales,
        },
    };
} // Exporta la función para que pueda ser utilizada en otros módulos