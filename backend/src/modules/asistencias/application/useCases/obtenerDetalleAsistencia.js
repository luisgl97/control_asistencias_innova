module.exports = async (asistencia_id, asistenciaRepository) => {


    const detalleAsistencia = await asistenciaRepository.obtenerDetalleAsistencia(asistencia_id);

    return {
        codigo: detalleAsistencia.asistencia ? 200: 404,
        respuesta: {
            mensaje: detalleAsistencia.mensaje,
            estado: detalleAsistencia.asistencia ? true: false,
            datos: detalleAsistencia.asistencia,
        },
    };
};
