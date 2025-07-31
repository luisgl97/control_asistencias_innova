const Asistencia = require("../../../asistencias/domain/entities/asistencia");
const Permiso = require("../../domain/entities/permiso"); // Importamos la entidad Permiso

module.exports = async (
  autorizado_por, // ID del usuario que autoriza, viene del token JWT
  permisoData,
  permisoRepository,
  asistenciaRepository
) => {
  const dataRegistroAsistencia = {
    usuario_id: permisoData.usuario_id,
    fecha: permisoData.fecha,
    estado: "FALTA JUSTIFICADA",
  };

  // Validar campos obligatorios de la asistencia
  const { success, message: error } = Asistencia.validarCamposObligatorios(
    dataRegistroAsistencia,
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

    // Verificar si ya existe una asistencia para esa fecha
    const asistenciaExistente = await asistenciaRepository.obtenerAsistenciaPorUsuarioYFecha(
        usuario_id = permisoData.usuario_id,
        dataRegistroAsistencia.fecha
        );
    
    if (asistenciaExistente) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Ya existe una asistencia registrada para esta fecha",
        estado: false,
      },
    };
}

  // Registrar asistencia
  const asistencia = await asistenciaRepository.crear(dataRegistroAsistencia);

  const dataRegistroPermiso = {
    asistencia_id: asistencia.id,
    autorizado_por: autorizado_por,
    observacion: permisoData.observacion,
  };

  // Validar campos obligatorios del permiso
  const { success: successPermiso, message: errorPermiso } =
    Permiso.validarCamposObligatorios(dataRegistroPermiso, (modo = "crear"));


  if (!successPermiso)
    return {
      codigo: 400,
      respuesta: {
        mensaje: errorPermiso,
        estado: false,
      },
    };

  // Registrar el permiso
  const nuevoPermiso = await permisoRepository.crear(dataRegistroPermiso);

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Permiso autorizado exitosamente",
      estado: true,
      permiso: nuevoPermiso,
    },
  };
};
