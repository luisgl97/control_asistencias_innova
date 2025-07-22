module.exports = async (dataReporte, asistenciaRepository) => {

    const { fecha_inicio, fecha_fin } = dataReporte;
   
    const reporte = await asistenciaRepository.obtenerReporteAsistencias(fecha_inicio, fecha_fin);

    
    console.table(reporte);

    return {
        codigo: 200,
        respuesta: {
            mensaje: reporte.length==0 ? "No hay reporte" :"Reporte generado",
            estado: true,
            total: reporte.length,
            datos: reporte,
        },
    };
};
