module.exports = async (id, usuarioRepository) => {
    const usuario = await usuarioRepository.obtenerUsuarioPorId(id); 
    if (!usuario) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } 

    return { codigo: 200, respuesta: usuario } 
} 