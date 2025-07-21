module.exports = async (dataAsitencia, asistenciaRepository) => {

    const { fecha } = dataAsitencia;
    const asistenciasDelDia = await asistenciaRepository.obtenerAsistenciasDelDia(fecha);

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistenciasDelDia.length==0 ? "No hubo asistencias en el dia" :"Listado de asistencias del dia",
            estado: true,
            total: asistenciasDelDia.length,
            datos: asistenciasDelDia,
        },
    };
};
