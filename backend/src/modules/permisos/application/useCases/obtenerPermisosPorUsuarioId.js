module.exports = async (dataBusquedaUsuario, permisoRepository) => {
   
    const { usuarioId } = dataBusquedaUsuario;

    const permisos = await permisoRepository.obtenerPermisosPorUsuarioId(usuarioId);

    return {
        codigo: 200,
        respuesta: {
            mensaje: permisos.length==0 ? "Permisos no registradas del usuario" :"Permisos encontrados del usuario",
            estado: true,
            total: permisos.length,
            datos: permisos,
        },
    };
};
