module.exports = async (idUsuario, dataAsitencia, asistenciaRepository) => {

    const { fecha } = dataAsitencia;
   
    const { estadoIngreso, estadoSalida, mensaje} = await  asistenciaRepository.verificarAsistenciaDelUsuarioDelDia(idUsuario, fecha);

     return {
        codigo: 200,
        respuesta: {
            mensaje: mensaje,
            estado: true,
            datos: {
                estadoIngreso,
                estadoSalida
            },
        },
    };
};
