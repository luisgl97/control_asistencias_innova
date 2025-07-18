const Usuario = require("../../domain/entities/usuario"); // Importamos la entidad Usuario
const {
  mapeoUsuarioPasswordEncriptado,
} = require("../../infrastructure/services/mapeoUsuarioPasswordEncriptado"); // Importamos la función para preparar el usuario para guardar

module.exports = async (usuarioData, usuarioRepository) => {
  const { success, message: error } = Usuario.validarCamposObligatorios(usuarioData, modo="crear");
  if (!success)
    return {
      codigo: 400,
      respuesta: {
        mensaje: error,
        estado: false,
      },
    };

  // ?Verificar si el Correo o Dni ya está en us

  const existeCorreo = await usuarioRepository.obtenerPorEmail(usuarioData.email);
  if (existeCorreo) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "El correo ya esta registrado",
        estado: false,
        email: usuarioData.email,
      },
    };
  }

  const existeDni = await usuarioRepository.obtenerPorDni(usuarioData.dni);
  if (existeDni) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "El DNI ya esta registrado",
        estado: false,
        dni: usuarioData.dni,
      },
    };
  }

  const usuarioTransformado = await mapeoUsuarioPasswordEncriptado(usuarioData);
  const nuevoUsuario = await usuarioRepository.crear(usuarioTransformado);
  const { password, id, updatedAt, createdAt, ...resto } =
    nuevoUsuario.dataValues;

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Usuario creado exitosamente",
      estado: true,
      usuario: resto,
    },
  };
};
