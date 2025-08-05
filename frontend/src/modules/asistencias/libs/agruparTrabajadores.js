import { calcularDistanciaEnMetros } from "./calcularDistancias";

export const agruparTrabajadoresPorUbicacion = (trabajadores, filtroTipo) => {
   const grupos = [];

   trabajadores.forEach((t) => {
      const nombre = t.trabajador?.split(" ")[0] ?? "Desconocido";
      const color = t.color;

      const ing = t.ubicacion_ingreso;
      const sal = t.ubicacion_salida;

      const combinado =
         ing &&
         sal &&
         calcularDistanciaEnMetros(ing.lat, ing.lng, sal.lat, sal.lng) < 50;

      const ubicaciones = [];

      if (combinado) {
         ubicaciones.push({
            lat: ing.lat,
            lng: ing.lng,
            tipo: "combinado",
            direccion_entrada: ing.direccion,
            direccion_salida: sal.direccion,
            trabajador: t.trabajador,
            nombre,
            color,
         });
      } else {
         if (filtroTipo !== "salida" && ing) {
            ubicaciones.push({
               lat: ing.lat,
               lng: ing.lng,
               tipo: "entrada",
               direccion: ing.direccion,
               trabajador: t.trabajador,
               nombre,
               color,
            });
         }
         if (filtroTipo !== "entrada" && sal) {
            ubicaciones.push({
               lat: sal.lat,
               lng: sal.lng,
               tipo: "salida",
               direccion: sal.direccion,
               trabajador: t.trabajador,
               nombre,
               color,
            });
         }
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