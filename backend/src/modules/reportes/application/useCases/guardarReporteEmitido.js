module.exports = async function guardarReporteEmitido(data, repository) {
  const {
    usuario_id,
    mes,
    hash,
    qr_base64,
    pdf_path,
    creado_por
  } = data;

  // Verifica si ya existe un reporte emitido para ese usuario y mes
  const existente = await repository.obtenerPorUsuarioYMes(usuario_id, mes);
  if (existente) {
    throw new Error("Ya existe un reporte emitido para este trabajador y mes.");
  }

  // Guardar nuevo
  return await repository.guardar({
    usuario_id,
    mes,
    hash,
    qr_base64,
    pdf_path,
    creado_por
  });
};