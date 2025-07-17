module.exports = async (id, usuarioRepository) => {
    const usuario = await usuarioRepository.obtenerPorId(id); 
    if (!usuario) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } 

    await usuarioRepository.eliminarUsuario(id); 
    return { codigo: 200, respuesta: { mensaje: "USuario eliminado exitosamente" } }}