module.exports = async (usuario_id, salidaData, asistenciaRepository) => {

  const dataRegistroSalida = {
    usuario_id,
    ...salidaData,
  }

  const asistenciaSalida = await asistenciaRepository.registrarSalida(dataRegistroSalida);

   if(!asistenciaSalida.success){
    return {
      codigo: 400,
      respuesta: {
        mensaje: asistenciaSalida.message,
        estado: false,
      },
    };
  }

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Salida registrada exitosamente",
      estado: true,
      asistenciaSalida: asistenciaSalida.asistencia
    },
  };
};
