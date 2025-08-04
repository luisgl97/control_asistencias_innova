module.exports = async (usuarioRepository) => {
    // ** Llamamos al repositorio para obtener todos los usuarios
    const usuarios = await usuarioRepository.obtenerUsuariosAutorizanPermiso();

    return {
        codigo: 200,
        respuesta: {
            mensaje: usuarios.length == 0 ? "Usuarios que autorizan permiso no registrados" : "Usuarios que autorizan permiso encontrados",
            estado: true,
            total: usuarios.length,
            datos: usuarios,
        },
    };
};
