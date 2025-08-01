export const fecha_hora_asistencia = () => {
   const fecha = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   }).format(new Date());
   const [dia, mes, anio] = fecha.split("/");
   const fechaFormateada = `${anio}-${mes}-${dia}`;
   const hora = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
   }).format(new Date());
   return { fecha_a: fechaFormateada, hora_a: hora };
};
