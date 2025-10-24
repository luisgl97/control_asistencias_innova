const {
  validarFechasDentroDelMesActual,
} = require("../../infrastructure/utils/validarFechasDentroDelMesActual");

const moment = require("moment-timezone");

module.exports = async (dataReporte, asistenciaRepository) => {
  const { fecha_inicio, fecha_fin } = dataReporte;

  // Verificar si la fecha_inicio y fecha_fin estan en dos meses distintos
  // Si es asi saltar la validacion de validarFechasDentroDelMesActual
  // usando moment

  const mesInicio = moment(fecha_inicio, "YYYY-MM-DD").month();
  const mesFin = moment(fecha_fin, "YYYY-MM-DD").month();

  if(mesInicio == mesFin){
      const fechasValidas = validarFechasDentroDelMesActual(
      fecha_inicio,
      fecha_fin
    );

    if (!fechasValidas) {
      return {
        codigo: 400,
        respuesta: {
          mensaje: "Las fechas deben estar dentro del mes actual o anteriores.",
          estado: false,
          total: 0,
          datos: [],
        },
      };
    }
  }
  const reporte = await asistenciaRepository.obtenerReporteAsistencias(
    fecha_inicio,
    fecha_fin
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: reporte.length == 0 ? "No hay reporte" : "Reporte generado",
      estado: true,
      total: reporte.length,
      datos: reporte,
    },
  };
};
