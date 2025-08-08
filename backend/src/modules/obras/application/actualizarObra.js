module.exports = async (obra_id, obraData, obraRepository) => {
    const obra = await obraRepository.actualizarObra(obra_id, obraData);
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: "Obra actualizada exitosamente",
            estado: true,
            obra: obra,
        },
    }
}