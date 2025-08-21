module.exports = async (asignado_por, registroDiarioData, registrosDiariosRepository) => {
  const { obra_id, lista_usuarios_ids, fecha, descripcion_tarea } = registroDiarioData;

  if (!Array.isArray(lista_usuarios_ids) || lista_usuarios_ids.length === 0) {
    return { codigo: 400, respuesta: { mensaje: "Asignar trabajadores a la obra", estado: false } };
  }

  // Registros actuales en BD
  const registrosPrevios = await registrosDiariosRepository.obtenerRegistrosDiarioPorObraYFecha(obra_id, fecha);

  if(registrosPrevios.length == 0){
    return { codigo: 404, respuesta: { mensaje: "No hubo registros previos", estado: false } };
  }
  const prevSet = new Set(registrosPrevios.map(r => r.usuario_id));
  const frontSet = new Set(lista_usuarios_ids);

  const aEliminar = [...prevSet].filter(id => !frontSet.has(id));
  const aCrear    = [...frontSet].filter(id => !prevSet.has(id));
  const aActualizar = [...frontSet].filter(id => prevSet.has(id)).filter(id => {
    const previo = registrosPrevios.find(r => r.usuario_id === id);
    return (
      previo.asignado_por !== asignado_por ||
      previo.fecha !== fecha ||
      previo.descripcion_tarea !== descripcion_tarea
    );
  });

  // Ejecutar cambios de forma secuencial
for (const id of aEliminar) {

  await registrosDiariosRepository.eliminarRegistroDiario({ obra_id, usuario_id: id, fecha: fecha });
}


for (const id of aCrear) {
 
 
await registrosDiariosRepository.crearRegistroDiario({ obra_id, usuario_id: id, fecha, descripcion_tarea, asignado_por });
}

for (const id of aActualizar) {
  
  await registrosDiariosRepository.actualizarRegistroDiario({ obra_id, usuario_id: id, fecha, descripcion_tarea, asignado_por });
}

  return { codigo: 200, respuesta: { mensaje: "Registros diarios actualizados exitosamente", estado: true } };
};
