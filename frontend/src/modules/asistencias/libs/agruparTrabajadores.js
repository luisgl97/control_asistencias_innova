export const agruparTrabajadoresPorUbicacion = (trabajadores, tipo) => {
   const grupos = [];

   trabajadores.forEach((t) => {
      const color = t.color;
      const nombre = t.trabajador?.split(" ")[0] ?? "Desconocido";

      const ubicaciones = [];

      if (tipo !== "salida" && t.ubicacion_ingreso) {
         ubicaciones.push({
            tipo: "entrada",
            lat: t.ubicacion_ingreso.lat,
            lng: t.ubicacion_ingreso.lng,
            direccion: t.ubicacion_ingreso.direccion,
            trabajador: t.trabajador,
            color,
            nombre,
         });
      }

      if (tipo !== "entrada" && t.ubicacion_salida) {
         ubicaciones.push({
            tipo: "salida",
            lat: t.ubicacion_salida.lat,
            lng: t.ubicacion_salida.lng,
            direccion: t.ubicacion_salida.direccion,
            trabajador: t.trabajador,
            color,
            nombre,
         });
      }

      ubicaciones.forEach((ubic) => {
         let agregado = false;
         for (const grupo of grupos) {
            const distancia = calcularDistanciaEnMetros(
               grupo.lat,
               grupo.lng,
               ubic.lat,
               ubic.lng
            );
            if (distancia < 50) {
               grupo.trabajadores.push(ubic);
               agregado = true;
               break;
            }
         }

         if (!agregado) {
            grupos.push({
               lat: ubic.lat,
               lng: ubic.lng,
               trabajadores: [ubic],
            });
         }
      });
   });

   return grupos;
};
