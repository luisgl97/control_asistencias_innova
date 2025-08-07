module.exports = async (usuarioRepository) => {
    // ** Llamamos al repositorio para obtener todos los usuarios
    const usuarios = await usuarioRepository.listarUsuariosTrabajadores();

    return {
        codigo: 200,
        respuesta: {
            mensaje: usuarios.length == 0 ? "Usuarios trabajadores no registrados" : "Usuarios trabajadores encontrados",
            estado: true,
            total: usuarios.length,
            datos: usuarios,
        },
    }
};