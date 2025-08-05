export const calcularDistanciaEnMetros = (lat1, lon1, lat2, lon2) => {
   console.log("==== CÁLCULO DE DISTANCIA ====");
   console.log("Punto 1 (lat1, lon1):", lat1, lon1);
   console.log("Punto 2 (lat2, lon2):", lat2, lon2);

   const R = 6371e3; // Radio de la Tierra en metros
   console.log("Radio de la Tierra (R):", R);

   const rad = (x) => (x * Math.PI) / 180;

   const dLat = rad(lat2 - lat1);
   const dLon = rad(lon2 - lon1);
   console.log("Diferencia de latitud en radianes (dLat):", dLat);
   console.log("Diferencia de longitud en radianes (dLon):", dLon);

   const lat1Rad = rad(lat1);
   const lat2Rad = rad(lat2);
   console.log("lat1 en radianes:", lat1Rad);
   console.log("lat2 en radianes:", lat2Rad);

   const sinDLat = Math.sin(dLat / 2);
   const sinDLon = Math.sin(dLon / 2);
   console.log("sin(dLat / 2):", sinDLat);
   console.log("sin(dLon / 2):", sinDLon);

   const a =
      sinDLat ** 2 +
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      sinDLon ** 2;
   console.log("Resultado de 'a':", a);

   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   console.log("Resultado de 'c':", c);

   const distancia = R * c;
   console.log("Distancia final en metros:", distancia);
   console.log("==============================");

   return distancia;
};
