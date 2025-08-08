export function getRangoSemanaActual(offset = 0) {
   const fechaLima = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
   );

   // Aplicar offset de semanas (puede ser positivo o negativo)
   fechaLima.setDate(fechaLima.getDate() + offset * 7);

   const diaSemana = fechaLima.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

   // Calcular lunes
   const lunes = new Date(fechaLima);
   const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
   lunes.setDate(fechaLima.getDate() + diferenciaLunes);

   // Calcular sábado
   const sabado = new Date(lunes);
   sabado.setDate(lunes.getDate() + 5);

   // Calcular número de semana dentro del mes
   const primerDiaMes = new Date(lunes.getFullYear(), lunes.getMonth(), 1);
   const primerLunesMes = new Date(primerDiaMes);
   const primerDiaSemana = primerDiaMes.getDay();
   const offsetPrimerLunes = primerDiaSemana === 0 ? 1 : 8 - primerDiaSemana;
   primerLunesMes.setDate(primerLunesMes.getDate() + (offsetPrimerLunes - 1));

   let numeroSemanaMes = 1;
   if (lunes >= primerLunesMes) {
      const diferenciaDias = Math.floor(
         (lunes - primerLunesMes) / (1000 * 60 * 60 * 24)
      );
      numeroSemanaMes += Math.floor(diferenciaDias / 7);
   }

   // Nombre del mes en español
   const nombreMes = lunes.toLocaleString("es-ES", { month: "long" });

   // Formato YYYY-MM-DD
   const formatoFecha = (fecha) => {
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const dia = String(fecha.getDate()).padStart(2, "0");
      return `${anio}-${mes}-${dia}`;
   };

   const hoy = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
   );
   hoy.setHours(0, 0, 0, 0); // Ignora la hora
   const mesActual = hoy.getMonth();
   let coincideMes = false;

   for (let i = 0; i < 6; i++) {
      // lunes a sábado
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      if (dia.getMonth() === mesActual) {
         coincideMes = true;
         break;
      }
   }

   // Validación de semana futura (lunes y sábado después de hoy)
   const esFutura = lunes > hoy && sabado > hoy;

   // Solo desactivar si NO coincide mes y es futura
   const desactivar = !coincideMes && esFutura;
   return {
      fecha_inicio: formatoFecha(lunes),
      fecha_fin: formatoFecha(sabado),
      numero_semana: `${numeroSemanaMes}° semana de ${nombreMes}`,
      desactivar   };
}
