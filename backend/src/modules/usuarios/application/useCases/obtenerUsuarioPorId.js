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

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Usuario encontrado",
            usuario: usuarioObtenido,
            estado: true,
        },
    };
};
