module.exports = async (obra_id, obraRepository) => {
    
    const obra = await obraRepository.obtenerPorId(obra_id);
    if(!obra)
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Obra no encontrada",
                estado: false,
                obra: null,
            },
        };
    return {
        codigo: 200,
        respuesta: {
            mensaje: "Obra encontrada",
            estado: true,
            obra: obra,
        },
    };
}