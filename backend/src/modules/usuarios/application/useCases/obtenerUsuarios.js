module.exports = async (usuarioRepository) => {
    // ** Llamamos al repositorio para obtener todos los usuarios
    const usuarios = await usuarioRepository.obtenerUsuarios();

    // ? si no se encuentra el usuario,
    if (usuarios.length == 0)
        return {
            codigo: 204,
            respuesta: {
                mensaje: "Usuarios no encontrados",
                estado: true,
                datos: [],
            },
        };

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Usuarios encontrados",
            estado: true,
            total: usuarios.length,
            datos: usuarios,
        },
    };
};
