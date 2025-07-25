module.exports = async (idUsuario, dataAsistencia, asistenciaRepository) => {

    const { fecha } = dataAsistencia;
   
    const { ingreso, salida, asistencia_id, falta_justificada, mensaje} = await  asistenciaRepository.verificarAsistenciaDelUsuarioDelDia(idUsuario, fecha);

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
            },
        },
    };
};
