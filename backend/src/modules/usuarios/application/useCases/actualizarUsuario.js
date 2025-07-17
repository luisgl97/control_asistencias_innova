const Usuario = require ("../../domain/entities/usuario"); // Importamos la entidad Usuario

module.exports = async (id, usuarioData, usuarioRepository) => {

    const usuarioExistente = await usuarioRepository.obtenerPorId(id); // Buscamos el usuario por ID
    if (!usuarioExistente) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } // Si no se encuentra el usuario, retorna un error 404
   
    const errorCampos = Usuario.validar(usuarioData, 'editar');
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } 
    
    // Verificar si el correo ya está en uso
    const usuarioExistentePorEmail = await usuarioRepository.obtenerPorEmail(usuarioData.email);

    // Verificar si el nuevo email ya ha sido registrado en otro usuario
    if (usuarioExistentePorEmail && id != usuarioExistentePorEmail.id) {
     
        return { codigo: 400, respuesta: { mensaje: "El correo ya está registrado" } }
    }

    const usuarioActualizado = await usuarioRepository.actualizarUsuario(id, usuarioData)
  
    return { codigo: 200, respuesta: { mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado } } // Retornamos el cliente creado
} // Exporta la función para que pueda ser utilizada en otros módulos