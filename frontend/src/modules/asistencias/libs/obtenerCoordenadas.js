// Función reutilizable para obtener coordenadas
export const obtenerCoordenadas = () => {
   return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
         reject({
            code: 0,
            message: "La geolocalización no está soportada en este navegador",
         });
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
         },
         (error) => {
            reject(error);
         },
         {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
         }
      );
   });
};
