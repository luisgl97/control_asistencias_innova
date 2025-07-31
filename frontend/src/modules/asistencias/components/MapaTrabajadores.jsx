import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import asistenciaService from "../service/asistenciaService";

// Generador de colores pastel únicos sin repetir
const getUniqueColorGenerator = () => {
   let index = 0;
   const saturation = 70;
   const lightness = 50;

   return () => {
      const hue = (index * 137.508) % 360; // Número irracional para dispersión
      index++;
      return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`;
   };
};

// Crear ícono personalizado
const crearIconoLucide = (color, inicial) => {
   const iconoReact = (
      <div className="flex flex-col items-center">
         <MapPin color="white" fill={color} size={36} strokeWidth={2.5} />
         <div className="text-xs font-semibold text-gray-800 -mt-1">
            {inicial}
         </div>
      </div>
   );

   return new L.DivIcon({
      html: ReactDOMServer.renderToString(iconoReact),
      className: "",
      iconSize: [36, 48],
      iconAnchor: [18, 48],
      popupAnchor: [0, -48],
   });
};

const MapaTrabajadores = () => {
   const [trabajadores, setTrabajadores] = useState([]);

   const fetchTrabajadores = async () => {
      try {
         const date = new Date();
         const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd
         console.log(formattedDate);

         const res = await asistenciaService.mapaTrabajadores({
            fecha: formattedDate,
         });
         console.log(res);

         setTrabajadores(res.data.datos || []); // Asegúrate de acceder correctamente a los datos
      } catch (error) {
         console.error("Error al cargar trabajadores:", error);
      }
   };

   useEffect(() => {
      fetchTrabajadores();
   }, []);

   // Asignar colores únicos por trabajador
   const coloresPorTrabajador = useMemo(() => {
      const getColor = getUniqueColorGenerator();
      const colores = {};
      trabajadores.forEach((t) => {
         colores[t.trabajador] = getColor();
      });
      return colores;
   }, [trabajadores]);

   return (
      <MapContainer
         center={[-12.1268, -77.0167]}
         zoom={15}
         style={{ height: "100vh", width: "100%",zIndex:1 }}
      >
         <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
         />

         {trabajadores.map((t, i) => {
            const color = coloresPorTrabajador[t.trabajador];
            const icono = crearIconoLucide(color, t.trabajador.split(" ")[0]);

            return (
               <React.Fragment key={i}>
                  {t.ubicacion_ingreso && (
                     <Marker
                        position={[
                           t.ubicacion_ingreso.lat,
                           t.ubicacion_ingreso.lng,
                        ]}
                        icon={icono}
                     >
                        <Popup>
                           <strong>Entrada / {t.trabajador}</strong>
                           <br />
                           {t.ubicacion_ingreso.direccion}
                        </Popup>
                     </Marker>
                  )}

                  {t.ubicacion_salida && (
                     <Marker
                        position={[
                           t.ubicacion_salida.lat,
                           t.ubicacion_salida.lng,
                        ]}
                        icon={icono}
                     >
                        <Popup>
                           <strong>Salida / {t.trabajador}</strong>
                           <br />
                           {t.ubicacion_salida.direccion}
                        </Popup>
                     </Marker>
                  )}
               </React.Fragment>
            );
         })}
      </MapContainer>
   );
};

export default MapaTrabajadores;
