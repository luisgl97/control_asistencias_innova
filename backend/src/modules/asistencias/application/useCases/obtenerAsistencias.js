module.exports = async (asistenciaRepository) => {
   
    const asistencias = await asistenciaRepository.obtenerAsistencias();

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistencias.length==0 ? "Asistencias no registradas" :"Asistencias encontrados",
            estado: true,
            total: asistencias.length,
            datos: asistencias,
        },
    };
};
