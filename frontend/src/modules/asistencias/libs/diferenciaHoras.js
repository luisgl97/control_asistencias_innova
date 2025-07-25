export const diferenciaHoras = (inicio, fin) => {
   const toSeconds = (hms) => {
      const [h, m, s] = hms.split(":").map(Number);
      return h * 3600 + m * 60 + s;
   };

   const day = 24 * 3600;
   let diff = toSeconds(fin) - toSeconds(inicio);
   if (diff < 0) diff += day; // cruza medianoche

   const horas = Math.floor(diff / 3600);
   const minutos = Math.floor((diff % 3600) / 60);

   return `${horas}h ${minutos}m`;
};
