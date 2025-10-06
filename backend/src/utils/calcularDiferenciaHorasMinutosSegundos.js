function calcularDiferenciaHorasMinutosSegundos(hora_ingreso, hora_salida) {
  // Si alguno de los parámetros es null, devolvemos null o un mensaje de error
  if (!hora_ingreso || !hora_salida) {
    return { horas: 0, minutos: 0, segundos: 0 };
  }

  // Convertir horas a partes numéricas
  const [h1, m1, s1] = hora_ingreso.split(":").map(Number);
  const [h2, m2, s2] = hora_salida.split(":").map(Number);

  // Validar que los valores sean correctos
  if ([h1, m1, s1, h2, m2, s2].some(isNaN)) {
    return { horas: 0, minutos: 0, segundos: 0, error: "Formato de hora inválido" };
  }

  const inicio = new Date(0, 0, 0, h1, m1, s1);
  let fin = new Date(0, 0, 0, h2, m2, s2);

  // Si la hora de salida es menor que la de ingreso, asumimos que es al día siguiente
  if (fin < inicio) {
    fin.setDate(fin.getDate() + 1);
  }

  // Diferencia en milisegundos
  const diff = fin - inicio;

  // Convertir a horas, minutos y segundos
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  return { horas, minutos, segundos };
}

module.exports = { calcularDiferenciaHorasMinutosSegundos };