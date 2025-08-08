module.exports = async (fecha_inicio, fecha_fin, usuarioRepository) => {
    // ** Llamamos al repositorio para obtener todos los usuarios
    const usuarios = await usuarioRepository.obtenerUsuariosConMinimoUnaAsistenciaDelMes(fecha_inicio, fecha_fin);

    return {
        codigo: 200,
        respuesta: {
            mensaje: usuarios.length == 0 ? "No hay usuarios con registros de su asistencia en el mes" : "Usuarios encontrados",
            estado: true,
            total: usuarios.length,
            datos: usuarios,
        },
    };
};
