module.exports = async (idUsuario, asistenciaRepository) => {
    
    const asistenciasDelUsuario = await asistenciaRepository.obtenerAsistenciasPorUsuario(idUsuario);

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistenciasDelUsuario.length==0 ? "Sin asistencias" :"Listado de asistencias del usuario",
            estado: true,
            total: asistenciasDelUsuario.length,
            datos: asistenciasDelUsuario,
        },
    };
};
