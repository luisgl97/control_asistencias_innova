module.exports = async (usuarioRepository) => {
    const piezas = await usuarioRepository.obtenerPiezas();
    return { codigo: 200, respuesta: piezas } 
} 