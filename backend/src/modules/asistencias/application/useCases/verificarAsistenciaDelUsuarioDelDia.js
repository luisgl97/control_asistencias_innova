module.exports = async (idUsuario, dataAsistencia, asistenciaRepository, registrosDiariosRepository) => {

    const { fecha } = dataAsistencia;
   
    const { ingreso, salida, asistencia_id, falta_justificada,hora_inicio_refrigerio, hora_fin_refrigerio, mensaje} = await  asistenciaRepository.verificarAsistenciaDelUsuarioDelDia(idUsuario, fecha);

    const obrasAsignadasAlTrabajadorPorDia = await registrosDiariosRepository.obtenerObrasAsignadasAlTrabajadorPorDia(idUsuario, fecha)

     return {
        codigo: 200,
        respuesta: {
            mensaje: mensaje,
            estado: true,
            datos: {
                ingreso,
                salida,
                asistencia_id,
                falta_justificada,
                hora_inicio_refrigerio,
                hora_fin_refrigerio,
                obras_asignadas_del_dia: obrasAsignadasAlTrabajadorPorDia
            },
        },
    };
};
