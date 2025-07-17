module.exports = async (id, usuarioRepository) => {
    const usuarioObtenido = await usuarioRepository.obtenerPorId(id);

    if (!usuarioObtenido) {
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Usuario no encontrado",
                usuario: null,
                estado: false,
            },
        };
    }

    const usuarioActivado = await usuarioRepository.activarUsuario(id);
    console.log(usuarioActivado);
    return {
        codigo: 204,
        respuesta: {
            mensaje: "Usuario eliminado exitosamente",
            estado: true,
        },
    };
};
