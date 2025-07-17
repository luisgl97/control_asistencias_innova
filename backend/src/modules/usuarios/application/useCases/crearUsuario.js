const Usuario = require ("../../domain/entities/usuario"); // Importamos la entidad Usuario
const { mapeoUsuarioPasswordEncriptado } = require ("../../infrastructure/services/mapeoUsuarioPasswordEncriptado"); // Importamos la función para preparar el usuario para guardar

module.exports = async (usuarioData, usuarioRepository) => {

  const error = Usuario.validar(usuarioData, "crear");
  if (error) return { codigo: 400, respuesta: { mensaje: error } }; 

  // Verificar si el correo ya está en uso
  const usuarioExistente = await usuarioRepository.obtenerPorEmail(usuarioData.email);
  if (usuarioExistente) {
    return { codigo: 400, respuesta: { mensaje: "El correo ya está registrado" } }
  }

  const usuarioTransformado = await mapeoUsuarioPasswordEncriptado(usuarioData); // Preparamos el usuario para guardar en la base de datos
  const nuevoUsuario = await usuarioRepository.crear(usuarioTransformado); // Creamos el nuevo usuario con todos sus datos en la base de datos

  return { codigo: 201, respuesta: { mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario } } // Retornamos el cliente creado
  
}; // Exporta la función para que pueda ser utilizada en otros módulos
