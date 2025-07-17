module.exports = async (id, usuarioRepository) => {
    const usuario = await usuarioRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un usuario por ID
    if (!usuario) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } // Si no se encuentra el usuario, retorna un error 404

    return { codigo: 200, respuesta: { usuario } } // Retorna el usuario encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos