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

    const usuarioEliminado = await usuarioRepository.eliminarUsuario(id);
    if (!usuarioEliminado) {
        return {
            codigo: 500,
            respuesta: {
                mensaje: "Error al eliminar el usuario",
                estado: false,
            },
        };
    }
    return {
        codigo: 204,
        respuesta: {
            mensaje: "Usuario eliminado exitosamente",
            estado: true,
        },
    };
};
