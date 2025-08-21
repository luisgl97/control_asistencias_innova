module.exports = async (asignado_por, registroDiarioData, registrosDiariosRepository) => {

    const {obra_id, lista_usuarios_ids, fecha, descripcion_tarea } = registroDiarioData;

    // Validar si hay registros con el mismo obra_id, usuario_id y fecha en la tabla registros_diarios
    const listaRegistrosPrevios = await registrosDiariosRepository.obtenerRegistrosDiarioPorListaTrabajadoresObraYFecha(lista_usuarios_ids, obra_id, fecha);

    if(listaRegistrosPrevios.length > 0){
     
      return {
        codigo: 400,
    respuesta: {
      mensaje: "Ya existen registros diarios para el mismo obra_id, usuario_id y fecha",
      estado: false,
    },
      }
    }


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
      asignado_por: asignado_por,
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