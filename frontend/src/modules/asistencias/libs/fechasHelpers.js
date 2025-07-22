function obtenerFechasSemana() {
  const { fecha_inicio } = getRangoSemanaActual();
  const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const fechas = [];
  let fecha = new Date(fecha_inicio);

  for (let i = 0; i < dias.length; i++) {
    fechas.push({
      dia: dias[i],
      fecha: new Date(fecha), // clone
    });
    fecha.setDate(fecha.getDate() + 1);
  }
  return fechas;
}
