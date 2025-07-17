module.exports = async (usuarioRepository) => {
    const usuarios = await usuarioRepository.obtenerUsuarios(); // Llama al método del repositorio para obtener todos los usuarios
    return { codigo: 200, respuesta: usuarios } 
} // Exporta la función para que pueda ser utilizada en otros módulos