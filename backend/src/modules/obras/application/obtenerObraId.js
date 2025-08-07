module.exports = async (obra_id, obraRepository) => {
    console.log("id", obra_id);
    const obra = await obraRepository.obtenerPorId(obra_id);
    console.log('obra', obra);
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