module.exports = async (fecha, lista_dni_trabajadores, dataPublicaRepository) => {

    const asistencias = await dataPublicaRepository.obtenerAsistenciasPorFecha(fecha, lista_dni_trabajadores);

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistencias.length == 0 ? "Asistencias no registradas" : "Asistencias encontrados",
            estado: true,
            total: asistencias.length,
            datos: asistencias,
        },
    };
} 