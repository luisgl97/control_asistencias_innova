const Asistencia = require("../../../asistencias/domain/entities/asistencia");
const Permiso = require("../../domain/entities/permiso"); // Importamos la entidad Permiso

module.exports = async (
  autorizado_por, // ID del usuario que autoriza, viene del token JWT
  permisoData, // ID de la asistencia asociada al permiso
  permisoRepository,
  asistenciaRepository
) => {

  // Validar que exista la asistencia

  const asistenciaExistente = await asistenciaRepository.obtenerAsistenciaPorId(
    permisoData.asistencia_id
  );


  if(!asistenciaExistente){
    return {
      codigo: 404,
      respuesta: {
        mensaje: "Asistencia no encontrada",
        estado: false,
      },
    };
  }

  if(asistenciaExistente.estado != "TARDANZA"){
    return {
      codigo: 400,
      respuesta: {
        mensaje: "No se puede autorizar un permiso para una asistencia con estado diferente a TARDANZA",
        estado: false,
      },
    };
  }

  const asistencia = await asistenciaRepository.actualizarAsistencia(
    permisoData.asistencia_id,
    {
      estado: "TARDANZA JUSTIFICADA",
    }
  );

  if(!asistencia){
    return {
      codigo: 404,
      respuesta: {
        mensaje: "Asistencia no encontrada",
        estado: false,
      },
    };
  }
  
  const dataRegistroPermiso = {
    asistencia_id: permisoData.asistencia_id,
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
      mensaje: "Tardanza Justificada autorizado exitosamente",
      estado: true,
      permiso: nuevoPermiso,
    },
  };
};
