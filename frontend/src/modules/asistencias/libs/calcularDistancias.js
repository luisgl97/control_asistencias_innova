export const calcularDistanciaEnMetros = (lat1, lon1, lat2, lon2) => {
   const R = 6371e3; // Radio de la Tierra en metros

   const rad = (x) => (x * Math.PI) / 180;

   const dLat = rad(lat2 - lat1);
   const dLon = rad(lon2 - lon1);

   const lat1Rad = rad(lat1);
   const lat2Rad = rad(lat2);

   const sinDLat = Math.sin(dLat / 2);
   const sinDLon = Math.sin(dLon / 2);

   const a =
      sinDLat ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinDLon ** 2;

   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   const distancia = R * c;

   return distancia;
};
