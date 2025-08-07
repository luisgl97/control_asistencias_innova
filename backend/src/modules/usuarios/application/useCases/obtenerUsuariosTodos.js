module.exports = async (usuarioRepository) => {

    const usuarios = await usuarioRepository.obtenerUsuariosTodos();


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
