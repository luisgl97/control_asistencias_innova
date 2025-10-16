module.exports = async (payload, solicitudRepository, transaction = null) => {
  const { solicitud_id, equipos } = payload;
  await solicitudRepository.actualizarSolicitudEquipos(
    solicitud_id,
    equipos,
    transaction
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Solicitud actualizada correctamnete",
    },
  };
};
