const Asistencia = require("../../domain/entities/asitencia");

module.exports = async (usuario_id, ingresoData, asistenciaRepository) => {
  // validar con el dominio asistencia

  const dataRegistroIngreso = {
    usuario_id,
    ...ingresoData,
  };

  const { success, message: error } =
    Asistencia.validarRegistroIngreso(dataRegistroIngreso);

  if (!success)
    return {
      codigo: 400,
      respuesta: {
        mensaje: error,
        estado: false,
      },
    };

  const asistenciaIngreso = await asistenciaRepository.registrarIngreso(
    dataRegistroIngreso
  );

  if(!asistenciaIngreso.success){
    return {
      codigo: 400,
      respuesta: {
        mensaje: asistenciaIngreso.message,
        estado: false,
      },
    };
  }

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Ingreso registrado exitosamente",
      estado: true,
      asistenciaIngreso: asistenciaIngreso.asistencia
    },
  };
};
