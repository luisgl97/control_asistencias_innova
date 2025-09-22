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
            let mensaje = "Error al acceder a la geolocalización";

            switch (error.code) {
               case error.PERMISSION_DENIED:
                  mensaje = "Permiso de geolocalización denegado";
                  break;
               case error.POSITION_UNAVAILABLE:
                  mensaje = "La ubicación no está disponible";
                  break;
               case error.TIMEOUT:
                  mensaje = "Tiempo de espera agotado al obtener la ubicación";
                  break;
            }

            reject({ code: error.code, message: mensaje });
         },
         {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
         }
      );
   });
};
