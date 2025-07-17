const Usuario = require("../../domain/entities/usuario"); // Importamos la clase Usuario

module.exports = async (usuarioData, usuarioRepository) => {
  const errorCampos = Usuario.validarCamposObligatorios(usuarioData, "crear"); // Validamos los campos obligatorios del usuario
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  // Verificar si hay un usuario con el mismo dni
  const usuarioExistente = await usuarioRepository.verificarUsuarioPorDni(usuarioData.dni);
  if (usuarioExistente) {
    return { codigo: 400, respuesta: { mensaje: "El usuario ya fue registrado con el mismo DNI." } }
  }

  const nuevoUsuarioData = new Usuario(usuarioData); // Creamos una nueva instancia de la clase Usuario con los datos proporcionados
  const nuevoUsuario = await usuarioRepository.crear(nuevoUsuarioData); // Creamos el nuevo usuario con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario },
  }; 
};
