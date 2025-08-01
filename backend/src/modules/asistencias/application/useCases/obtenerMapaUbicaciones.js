module.exports = async (fecha, asistenciaRepository) => {
   
    const ubicaciones = await asistenciaRepository.obtenerMapaUbicaciones(fecha);

    return {
        codigo: 200,
        respuesta: {
            mensaje: ubicaciones.length==0 ? "No hay ubicaciones registradas" :"Ubicaciones de los trabajadores en obra",
            estado: true,
            datos: ubicaciones,
        },
    };
};
