module.exports = async (id, obraRepository) => {
    const obraObtenido = await obraRepository.obtenerPorId(id);

    if (!obraObtenido) {
       
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Obra no encontrada",
                estado: false,
            },
        };
    }

    await obraRepository.eliminarObra(id);

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Obra eliminado exitosamente",
            estado: true,
        },
    };
};
