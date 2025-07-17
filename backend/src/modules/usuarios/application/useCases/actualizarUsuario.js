const Usuario = require("../../domain/entities/usuario"); // Importamos la clase Usuario

module.exports = async (id, usuarioData, usuarioRepository) => {
    const usuario = await usuarioRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la usuario por ID
    if (!usuario) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } // Si no se encuentra la usuario, retorna un error 404
    
    const errorCampos = Usuario.validarCamposObligatorios(usuarioData, "editar"); // Validamos los campos obligatorios del usuario
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const usuarioActualizado = await usuarioRepository.actualizarUsuario(id, usuarioData)

   return { codigo: 200, respuesta: { mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado } } // Retornamos el usuario creado

} 