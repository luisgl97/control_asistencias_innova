const { parsearToJson } = require("../../../utils/parseToJson");

module.exports = async (obra_id, fecha ,registrosDiariosRepository, asistenciasRepository) => {

    // Validar que la tarea no tenga asistencias asociadas
    const registrosDiariosPorObraYFecha = await registrosDiariosRepository.obtenerRegistrosDiarioPorObraYFecha(obra_id, fecha);

    if(registrosDiariosPorObraYFecha.length == 0){
        return {
            codigo: 404,
            respuesta: {
                 mensaje: "No hay registros diarios por obra y fecha para eliminar",
             estado: false,
           
            }
        }
    }
    // Obtener la lista de usuarios

    const usuarios = registrosDiariosPorObraYFecha.map(registroDiario => registroDiario.usuario_id);

    const asistenciasPorUsuariosYFecha = await asistenciasRepository.obtenerAsistenciasPorListaDeUsuariosYFecha(usuarios, fecha);

    // limpiar la data sin sequelize asistenciasPorUsuariosYFecha
    const asistenciasLimpias = asistenciasPorUsuariosYFecha.map(a => a.dataValues);

    const asistenciasDeLaObraEnLaFecha = asistenciasLimpias.filter(asistencia => {

        const ubicacion_ingreso = parsearToJson(asistencia.ubicacion_ingreso);
        const ubicacion_salida = parsearToJson(asistencia.ubicacion_salida);

        const obra_id_1 = ubicacion_ingreso?.obra_id;
        const obra_id_2 = ubicacion_salida?.obra_id;

        return obra_id_1 == obra_id || obra_id_2 == obra_id;
    });

    if (asistenciasDeLaObraEnLaFecha.length > 0) {
        return {
            codigo: 400,
            respuesta: {
                mensaje: "La tarea no se puede eliminar porque ya tiene asistencias asociadas",
                estado: false,
            },
        };
    }
   
    await registrosDiariosRepository.eliminarTareaRegistroDiario(obra_id, fecha);
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: "La tarea se eliminó correctamente",
            estado: true,
        },
    };
} 