module.exports = async (id, usuarioRepository) => {
    const usuario = await usuarioRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un usuario por ID
    if (!usuario) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } // Si no se encuentra el usuario, retorna un error 404

    await usuarioRepository.eliminarUsuario(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Usuario eliminado exitosamente" } } // Retorna un mensaje de éxito
}