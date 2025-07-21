export function getRangoSemanaActual() {
   const fechaLima = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
   );

   const diaSemana = fechaLima.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

   // Calcular lunes
   const lunes = new Date(fechaLima);
   const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
   lunes.setDate(fechaLima.getDate() + diferenciaLunes);

   // Calcular sábado
   const sabado = new Date(lunes);
   sabado.setDate(lunes.getDate() + 5);

   // Formato YYYY-MM-DD
   const formatoFecha = (fecha) => {
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const dia = String(fecha.getDate()).padStart(2, "0");
      return `${anio}-${mes}-${dia}`;
   };

   return {
      fecha_inicio: formatoFecha(lunes),
      fecha_fin: formatoFecha(sabado),
   };
}
