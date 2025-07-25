const Permiso = require("../../domain/entities/permiso"); // Importamos la entidad Permiso

module.exports = async (permisoData, permisoRepository,asistenciaRepository) => {

  const dataRegistroPermiso = {
    asistencia_id: permisoData.asistencia_id,
    autorizado_por: permisoData.autorizado_por,
    observacion: permisoData.observacion,
  };

  const { success, message: error } = Permiso.validarCamposObligatorios(
    dataRegistroPermiso,
    (modo = "crear")
  );

  if (!success)
    return {
      codigo: 400,
      respuesta: {
        mensaje: error,
        estado: false,
      },
    };

  // Validar que existe la asistencia
  const asistencia = await asistenciaRepository.obtenerAsistenciaPorId(
    dataRegistroPermiso.asistencia_id
  );

  if (!asistencia) {
    return {
      codigo: 404,
      respuesta: {
        mensaje: "La asistencia no existe",
        estado: false,
      },
    };
  }

  // Verificar si ya solicitaste permiso para esa asistencia
  const permisoExistente = await permisoRepository.obtenerPermisoPorAsistenciaId(
    dataRegistroPermiso.asistencia_id
  );

    if (permisoExistente) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Ya existe un permiso registrado para esta asistencia",
        estado: false,
      },
    };
    }

  // Registrar el permiso
  const nuevoPermiso = await permisoRepository.crear(dataRegistroPermiso);

  const dataActualizarAsistencia = {
    estado: "SALIDA ANTICIPADA",
    hora_salida: permisoData.hora_salida,
  };
  // Actualizar la asistencia con el permiso registrado
    await asistenciaRepository.actualizarAsistencia(
        asistencia.id,
        dataActualizarAsistencia
    );

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Permiso registrado exitosamente",
      estado: true,
      permiso: nuevoPermiso,
    },
  };
};
