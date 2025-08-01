module.exports = async (usuarioRepository) => {
    // ** Llamamos al repositorio para obtener todos los usuarios
    const usuarios = await usuarioRepository.obtenerUsuarios();


    return {
        codigo: 200,
        respuesta: {
            mensaje: usuarios.length == 0 ? "Usuarios no registrados" : "Usuarios encontrados",
            estado: true,
            total: usuarios.length,
            datos: usuarios,
        },
    };
};
