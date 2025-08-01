module.exports = async (id, usuarioRepository) => {
    const usuarioObtenido = await usuarioRepository.obtenerPorId(id);

    if (!usuarioObtenido) {
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Usuario no encontrado",
                estado: false,
            },
        };
    }

    await usuarioRepository.activarUsuario(id);
 
    return {
        codigo: 200,
        respuesta: {
            mensaje: "Usuario activado exitosamente",
            estado: true,
        },
    };
};
