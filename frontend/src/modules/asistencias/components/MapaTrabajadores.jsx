import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CalendarIcon, LogIn, LogOut, MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import asistenciaService from "../service/asistenciaService";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { endOfToday, format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { MapPinHouse, MapPinXInside, MapPinCheckInside } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

// ================== UTILS ==================

const calcularDistanciaEnMetros = (lat1, lon1, lat2, lon2) => {
   const R = 6371e3;
   const rad = (x) => (x * Math.PI) / 180;
   const dLat = rad(lat2 - lat1);
   const dLon = rad(lon2 - lon1);
   const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
};

const getUniqueColorGenerator = () => {
   let index = 0;
   const saturation = 70;
   const lightness = 50;
   return () => {
      const hue = (index * 137.508) % 360;
      index++;
      return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`;
   };
};

const crearIconoLucide = (color, nombre, tipo = "entrada") => {
   const Icono = tipo === "entrada" ? MapPinHouse : MapPinXInside;
   const iconoReact = (
      <div className="flex flex-col items-center">
         <Icono color="white" fill={color} size={36} strokeWidth={2.5} />
         <div className="text-xs font-semibold text-gray-800 -mt-1">
            {nombre}
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

const crearIconoCombinado = (color, nombre) => {
   const iconoReact = (
      <div className="flex flex-col items-center">
         <MapPinCheckInside
            color="white"
            fill={color}
            size={36}
            strokeWidth={2.5}
         />
         <div className="text-xs font-semibold text-gray-800 -mt-1">
            {nombre}
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

// ================== AGRUPADOR ==================

const agruparTrabajadoresPorUbicacion = (trabajadores, filtroTipo) => {
   const grupos = [];

   trabajadores.forEach((t) => {
      const nombre = t.trabajador?.split(" ")[0] ?? "Desconocido";
      const color = t.color;

      const ing = t.ubicacion_ingreso;
      const sal = t.ubicacion_salida;

      const combinado =
         ing &&
         sal &&
         calcularDistanciaEnMetros(ing.lat, ing.lng, sal.lat, sal.lng) < 200;

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

// ================== COMPONENT ==================

const MapaTrabajadores = () => {
   const [trabajadores, setTrabajadores] = useState([]);
   const [trabajadoresRespaldo, setTrabajadoresRespaldo] = useState([]);
   const [date, setDate] = useState(new Date());
   const [filtroTipo, setFiltroTipo] = useState("todas");
   const [trabajadorSeleccionado, setTrabajadorSeleccionado] =
      useState("todos");

   const fetchTrabajadores = async (fecha) => {
      try {
         const res = await asistenciaService.mapaTrabajadores({ fecha });
         setTrabajadores(res.data.datos || []);
         setTrabajadoresRespaldo(res.data.datos || []);
      } catch (error) {
         console.error("Error al cargar trabajadores:", error);
      }
   };

   useEffect(() => {
      if (date) {
         const formattedDate = date.toISOString().split("T")[0];
         fetchTrabajadores(formattedDate);
      }
   }, [date]);

   useEffect(() => {
      let copyData = [...trabajadoresRespaldo];
      if (filtroTipo !== "todas") {
         copyData = copyData.map((t) => ({
            ...t,
            ...(filtroTipo === "entrada" ? { ubicacion_salida: null } : {}),
            ...(filtroTipo === "salida" ? { ubicacion_ingreso: null } : {}),
         }));
      }
      setTrabajadores(copyData);
   }, [filtroTipo, trabajadoresRespaldo]);

   const trabajadoresConColores = useMemo(() => {
      const getColor = getUniqueColorGenerator();
      return trabajadores.map((t) => ({
         ...t,
         color: getColor(),
      }));
   }, [trabajadores]);

   const trabajadoresUnicos = useMemo(() => {
      const nombres = new Set();
      trabajadores.forEach((t) => {
         nombres.add(t.trabajador);
      });
      return Array.from(nombres);
   }, [trabajadores]);

   const trabajadoresFiltrados = useMemo(() => {
      return trabajadoresConColores.filter((t) => {
         return (
            trabajadorSeleccionado === "todos" ||
            t.trabajador === trabajadorSeleccionado
         );
      });
   }, [trabajadoresConColores, trabajadorSeleccionado]);

   return (
      <article>
         <section className="w-full flex flex-wrap gap-4 mb-8">
            {/* Fecha */}
            <Popover>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     data-empty={!date}
                     className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                     <CalendarIcon />
                     {date ? (
                        format(date, "EEEE d 'de' MMMM yyyy", { locale: es })
                     ) : (
                        <span>Selecciona una fecha</span>
                     )}
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0">
                  <Calendar
                     mode="single"
                     selected={date}
                     onSelect={setDate}
                     captionLayout="dropdown"
                     locale={es}
                     disabled={(date) => isAfter(date, endOfToday())}
                  />
               </PopoverContent>
            </Popover>

            {/* Filtro tipo de ubicación */}
            <Select onValueChange={setFiltroTipo} defaultValue="todas">
               <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de ubicación" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="entrada">Solo entradas</SelectItem>
                  <SelectItem value="salida">Solo salidas</SelectItem>
               </SelectContent>
            </Select>

            {/* Filtro por trabajador */}
            <Select
               onValueChange={setTrabajadorSeleccionado}
               defaultValue="todos"
            >
               <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trabajador" />
               </SelectTrigger>
               <SelectContent className="max-h-[450px]">
                  <SelectItem value="todos">Todos</SelectItem>
                  {trabajadoresUnicos.map((nombre, idx) => (
                     <SelectItem key={idx} value={nombre}>
                        {nombre}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </section>

         <section>
            <MapContainer
               center={[-12.1268, -77.0167]}
               zoom={15}
               style={{ height: "100vh", width: "100%", zIndex: 1 }}
            >
               <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap &copy; CARTO"
               />

               {agruparTrabajadoresPorUbicacion(
                  trabajadoresFiltrados,
                  filtroTipo
               ).map((grupo, i) => {
                  const esUnico = grupo.trabajadores.length === 1;
                  const unico = grupo.trabajadores[0];

                  let icon;
                  if (esUnico) {
                     icon =
                        unico.tipo === "combinado"
                           ? crearIconoCombinado(unico.color, unico.nombre)
                           : crearIconoLucide(
                                unico.color,
                                unico.nombre,
                                unico.tipo
                             );
                  } else {
                     icon = new L.DivIcon({
                        html: ReactDOMServer.renderToString(
                           <div className="flex flex-col items-center">
                              <MapPin color="white" fill="#4ade80" size={36} />
                              <div className="text-xs font-semibold truncate text-gray-800 -mt-1">
                                 {grupo.trabajadores.length} Trab.
                              </div>
                           </div>
                        ),
                        className: "",
                        iconSize: [36, 48],
                        iconAnchor: [18, 48],
                        popupAnchor: [0, -48],
                     });
                  }

                  return (
                     <Marker
                        key={`grupo-${i}`}
                        position={[grupo.lat, grupo.lng]}
                        icon={icon}
                     >
                        <Popup>
                           <div className="max-w-xs space-y-2">
                              {grupo.trabajadores.map((t, idx) => (
                                 <div
                                    key={idx}
                                    className="flex items-start gap-2"
                                 >
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 truncate">
                                          {t.trabajador}
                                       </div>

                                       {t.tipo === "combinado" ? (
                                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                             <LogIn
                                                size={14}
                                                className="text-green-600"
                                             />
                                             <span
                                                className="truncate"
                                                title={t.direccion_entrada}
                                             >
                                                {t.direccion_entrada?.length >
                                                50
                                                   ? t.direccion_entrada.substring(
                                                        0,
                                                        50
                                                     ) + "..."
                                                   : t.direccion_entrada}
                                             </span>
                                          </div>
                                       ) : null}

                                       {t.tipo === "combinado" ? (
                                          <div className="flex items-center gap-2 text-xs text-gray-600">
                                             <LogOut
                                                size={14}
                                                className="text-red-600"
                                             />
                                             <span
                                                className="truncate"
                                                title={t.direccion_salida}
                                             >
                                                {t.direccion_salida?.length > 50
                                                   ? t.direccion_salida.substring(
                                                        0,
                                                        50
                                                     ) + "..."
                                                   : t.direccion_salida}
                                             </span>
                                          </div>
                                       ) : (
                                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                             {t.tipo === "entrada" ? (
                                                <LogIn
                                                   size={14}
                                                   className="text-green-600"
                                                />
                                             ) : (
                                                <LogOut
                                                   size={14}
                                                   className="text-red-600"
                                                />
                                             )}
                                             <span
                                                className="truncate"
                                                title={t.direccion}
                                             >
                                                {t.direccion?.length > 50
                                                   ? t.direccion.substring(
                                                        0,
                                                        50
                                                     ) + "..."
                                                   : t.direccion}
                                             </span>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </Popup>
                     </Marker>
                  );
               })}
            </MapContainer>
         </section>
      </article>
   );
};

export default MapaTrabajadores;
