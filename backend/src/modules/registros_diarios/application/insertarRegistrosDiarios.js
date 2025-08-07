
module.exports = async (asignador_por, registroDiarioData, registrosDiariosRepository) => {


  if (!Array.isArray(registroDiarioData) || registroDiarioData.length === 0) {
    return {
      codigo: 400,
      respuesta: { mensaje: "No hay registros para procesar", estado: false },
    };
  }

   const aInsertar = [];

  for (const registro of registroDiarioData) {
    const { obra_id, lista_usuarios_ids, fecha, descripcion_tarea } = registro;

    if (!obra_id || !fecha) {
      return {
        codigo: 400,
        respuesta: { mensaje: "Faltan campos: obra_id y fecha son obligatorios", estado: false },
      };
    }

    if (!Array.isArray(lista_usuarios_ids) || lista_usuarios_ids.length === 0) {
      return {
        codigo: 400,
        respuesta: { mensaje: "Asignar trabajadores a la obra", estado: false },
      };
    }

    // expandimos un registro por cada usuario
    for (const usuario_id of lista_usuarios_ids) {
      aInsertar.push({
        usuario_id,
        obra_id,
        asignador_por,           // viene del parámetro de la función
        fecha,
        descripcion_tarea: descripcion_tarea || null,
      });
    }
  }

  // nada que insertar
  if (aInsertar.length === 0) {
    return {
      codigo: 400,
      respuesta: { mensaje: "No se construyeron registros válidos", estado: false },
    };
  }

  // una sola operación bulk
  const registrosDiariosGuardados = await registrosDiariosRepository.insertarRegistrosDiarios(aInsertar);

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Registros diarios creados",
      estado: true,
      total: registrosDiariosGuardados?.length ?? aInsertar.length,
      datos: registrosDiariosGuardados,
    },
  };
};
