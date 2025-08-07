const moment = require("moment-timezone");
moment.locale("es");

const { CONST_FERIADOS_PERU } = require("../../../../constants/feriadosPeru");

function obtenerSiguienteDiaLaboral(fechaInicial) {
  let fecha = moment.tz(fechaInicial, "YYYY-MM-DD", "America/Lima");

  while (true) {
    fecha = fecha.add(1, "days");
    const dia = fecha.day(); // 0 = domingo, 6 = sábado
    const esFeriado = CONST_FERIADOS_PERU.includes(fecha.format("YYYY-MM-DD"));

    // Laborables: lunes a sábado (1-6), excluyendo domingos (0) y feriados
    if (dia !== 0 && !esFeriado) {
      return fecha.format("YYYY-MM-DD");
    }
  }
}

module.exports = {
    obtenerSiguienteDiaLaboral
}