const moment = require("moment-timezone");

/**
 * Valida que ambas fechas estén dentro del mes actual o anteriores.
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD
 * @returns {boolean} - true si el rango es válido, false si alguna fecha está en un mes futuro
 */
function validarFechasDentroDelMesActual(fechaInicio, fechaFin) {
  const hoy = moment().tz("America/Lima");
  const inicio = moment(fechaInicio, "YYYY-MM-DD");
  const fin = moment(fechaFin, "YYYY-MM-DD");

  return (
    inicio.isSameOrBefore(hoy, "month") &&
    fin.isSameOrBefore(hoy, "month")
  );
}

module.exports = {
  validarFechasDentroDelMesActual,
};