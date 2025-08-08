module.exports = async (asignador_por, registroDiarioData, registrosDiariosRepository) => {

    const {obra_id, lista_usuarios_ids, fecha, descripcion_tarea } = registroDiarioData;

    if(lista_usuarios_ids.length == 0){
      return {
        codigo: 400,
    respuesta: {
      mensaje: "Asignar trabajadores a la obra",
      estado: false,
    },
      }
    }

    const listaRegistros = lista_usuarios_ids?.map(usuario_id => ({
      usuario_id: usuario_id,
      obra_id: obra_id,
      asignador_por: asignador_por,
      fecha: fecha,
      descripcion_tarea: descripcion_tarea
    }))

    const registrosDiariosGuardados = await registrosDiariosRepository.insertarRegistrosDiarios(listaRegistros)

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Registros diarios registrados exitosamente",
      estado: true,
      listaRegistros: registrosDiariosGuardados
    },
  };
};