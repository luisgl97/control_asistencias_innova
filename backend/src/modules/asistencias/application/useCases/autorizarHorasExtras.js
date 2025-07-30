
module.exports = async (asistencia_id, asistenciaRepository) => {
 
  const asistenciaConHorasExtras = await asistenciaRepository.autorizarHorasExtras(
    asistencia_id
  );

  if(!asistenciaConHorasExtras.success){
    return {
      codigo: 400,
      respuesta: {
        mensaje: asistenciaConHorasExtras.message,
        estado: false,
      },
    };
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Horas extras autorizadas exitosamente",
      estado: true,
      asistenciaIngreso: asistenciaConHorasExtras.asistencia
    },
  };
};
