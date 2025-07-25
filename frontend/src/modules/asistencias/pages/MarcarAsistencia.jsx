"use client";

import {
   Calendar,
   Clock,
   MapPin,
   Loader2,
   AlertCircle,
   LogIn,
   Coffee,
   LogOut,
   XCircle,
   CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import asistenciaService from "../service/asistenciaService";
import HoraActual from "../components/horaActual";
import { toast } from "sonner";
import axios from "axios";
import HorariosTrabajo from "../components/HorariosTrabajo";
import { ModalFalta } from "../components/ModalFalta";
import { diferenciaHoras } from "../libs/diferenciaHoras";

export default function MarcarAsistencia() {
   const { user, loading } = useAuth();
   const [status, setStatus] = useState({
      estadoIngreso: true,
      estadoSalida: true,
   });
   const [ubicacion, setUbicacion] = useState(null);
   const [ubicacionLoading, setUbicacionLoading] = useState(true);
   const [ubicacionError, setUbicacionError] = useState(null);
   const [asistencia, setAsistencia] = useState({});

   const fetchVerificarAsistencia = async () => {
      try {
         const res = await asistenciaService.verificaAsistencia({
            fecha: new Date(),
         });
         setStatus({
            estadoIngreso: res.data.datos.ingreso.estado,
            estadoSalida: res.data.datos.salida.estado,
         });
         console.log(res.data.datos);

         setAsistencia(res.data.datos);
      } catch (error) {
         console.error(error);
      }
   };

   const obtenerUbicacion = () => {
      setUbicacionLoading(true);
      setUbicacionError(null);

      if (!navigator.geolocation) {
         setUbicacionError(
            "La geolocalización no está soportada en este navegador"
         );
         setUbicacionLoading(false);
         return;
      }

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            try {
               const { latitude, longitude } = position.coords;
               const response = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
               );

               if (response.data) {
                  setUbicacion({
                     latitude,
                     longitude,
                     display_name: response.data.display_name,
                  });
               }
            } catch (error) {
               setUbicacionError("Error al obtener la dirección");
               console.error("Error al obtener dirección:", error);
            } finally {
               setUbicacionLoading(false);
            }
         },
         (error) => {
            let errorMessage = "Error al obtener la ubicación";
            switch (error.code) {
               case error.PERMISSION_DENIED:
                  errorMessage = "Permiso de ubicación denegado";
                  break;
               case error.POSITION_UNAVAILABLE:
                  errorMessage = "Ubicación no disponible";
                  break;
               case error.TIMEOUT:
                  errorMessage = "Tiempo de espera agotado";
                  break;
            }
            setUbicacionError(errorMessage);
            setUbicacionLoading(false);
         },
         {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
         }
      );
   };

   useEffect(() => {
      if (user) {
         fetchVerificarAsistencia();
         obtenerUbicacion();
      }
   }, [user]);

   const marcarAsistenciaIngreso = async () => {
      if (!ubicacion) {
         toast.error("Ubicación no disponible");
         return;
      }

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

      const ubicacion_ingreso = {
         lat: ubicacion.latitude,
         lng: ubicacion.longitude,
         direccion: ubicacion.display_name,
      };

      try {
         const response = await asistenciaService.registrarIngreso({
            fecha: fechaFormateada,
            hora_ingreso: hora,
            ubicacion_ingreso,
            observacion_ingreso: "",
         });
         console.log(response);
         toast.success("Asistencia guardada con éxito");
         fetchVerificarAsistencia(); // Actualizar estado
      } catch (error) {
         console.log(error);
         toast.error("Error al guardar la asistencia");
      }
   };

   const marcarAsistenciaSalida = async () => {
      if (!ubicacion) {
         toast.error("Ubicación no disponible");
         return;
      }

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

      const ubicacion_salida = {
         lat: ubicacion.latitude,
         lng: ubicacion.longitude,
         direccion: ubicacion.display_name,
      };

      try {
         const response = await asistenciaService.registrarSalida({
            fecha: fechaFormateada,
            hora_salida: hora,
            ubicacion_salida,
            observacion_salida: "",
         });
         console.log(response);
         toast.success("Asistencia guardada con éxito");
         fetchVerificarAsistencia(); // Actualizar estado
      } catch (error) {
         console.log(error);
         toast.error("Error al guardar la asistencia");
      }
   };

   // Mostrar loader mientras se obtiene la ubicación
   if (ubicacionLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
               <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-innova-blue" />
                  <h3 className="text-lg font-semibold mb-2">
                     Obteniendo ubicación...
                  </h3>
                  <p className="text-gray-600 text-sm">
                     Por favor, permite el acceso a tu ubicación para continuar
                  </p>
               </CardContent>
            </Card>
         </div>
      );
   }

   // Mostrar error si no se pudo obtener la ubicación
   if (ubicacionError) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
               <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
                     Error de ubicación
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{ubicacionError}</p>
                  <Button onClick={obtenerUbicacion} className="w-full">
                     <MapPin className="w-4 h-4 mr-2" />
                     Intentar nuevamente
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Contenido principal */}
         <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-0 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Historial reciente - Solo visible en desktop */}
            <section className="w-full order-1 md:order-2 md:col-span-2 space-y-4">
               <HorariosTrabajo className={"md:hidden"} />

               <Card className="bg-gradient-to-r from-innova-blue/95 to-innova-blue border-0 shadow-lg ">
                  <CardHeader className="text-white ">
                     <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-6 h-6" />
                        <h2 className="text-xl sm:text-2xl font-bold">
                           Marcar Asistencia
                        </h2>
                     </div>
                     <p className="text-blue-100 text-sm sm:text-base">
                        Registra tu entrada o salida del trabajo
                     </p>
                     {ubicacion && (
                        <div className="mt-2 p-2 bg-white/10 rounded-lg">
                           <p className="text-xs text-blue-100 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {ubicacion.display_name}
                           </p>
                        </div>
                     )}
                  </CardHeader>
                  <CardContent className=" sm:p-6">
                     <div className="grid grid-cols-2 gap-3">
                        <Button
                           onClick={marcarAsistenciaIngreso}
                           className="bg-green-600 hover:bg-green-500 text-white py-4 h-auto flex flex-col items-center gap-1 font-semibold text-base shadow-lg"
                           disabled={status.estadoIngreso || !ubicacion}
                        >
                           <CheckCircle className="w-5 h-5" />
                           <span className="text-sm">Marcar Entrada</span>
                        </Button>

                        <Button
                           className="bg-red-600 hover:bg-red-500 text-white py-4 h-auto flex flex-col items-center gap-1 font-semibold text-base shadow-lg"
                           onClick={marcarAsistenciaSalida}
                           disabled={
                              !status.estadoIngreso ||
                              status.estadoSalida ||
                              !ubicacion
                           }
                        >
                           <LogOut className="w-5 h-5" />
                           <span className="text-sm">Marcar Salida</span>
                        </Button>
                     </div>

                     <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-600"></div>
                        <span className="text-xs text-gray-400">
                           Permisos Especiales
                        </span>
                        <div className="flex-1 h-px bg-gray-600"></div>
                     </div>

                     {/* Botones de permisos especiales */}
                     <div className="grid grid-cols-2 gap-3">
                        <ModalFalta />

                        <Button
                           className="bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 h-auto flex flex-col items-center gap-1 text-xs border border-gray-500"
                           variant="outline"
                           disabled={
                              !status.estadoIngreso ||
                              status.estadoSalida ||
                              !ubicacion
                           }
                        >
                           <AlertCircle className="w-5 h-5" />
                           <span className="text-sm">Salida Anticipada</span>
                        </Button>
                     </div>

                     {/* Información adicional */}
                     <div className="mt-6 pt-4 border-t border-blue-500/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center text-white/90">
                           <div>
                              <p className="text-xs sm:text-sm font-medium">
                                 Fecha
                              </p>
                              <p className="text-sm sm:text-base font-semibold">
                                 {new Date().toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                 })}
                              </p>
                           </div>
                           <HoraActual />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </section>
            <section className="w-full order-2 md:order-1 md:col-span-1 space-y-4">
               <HorariosTrabajo className={"hidden md:block"} />
               <Card className="shadow-lg border-0 ">
                  <CardHeader>
                     <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Resumen de Hoy
                     </h3>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">Entrada:</span>
                           <span className="font-medium text-green-600">
                              {asistencia.ingreso.hora
                                 ? asistencia.ingreso.hora
                                 : "Pendiente"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">Salida:</span>
                           <span className="font-medium text-gray-400">
                              {asistencia.salida.hora
                                 ? asistencia.salida.hora
                                 : "Pendiente"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">
                              Horas trabajadas:
                           </span>
                           <span className="font-medium">
                              {asistencia.ingreso.hora && asistencia.salida.hora
                                 ? diferenciaHoras(
                                      asistencia.ingreso.hora,
                                      asistencia.salida.hora
                                   )
                                 : "Pendiente"}
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </section>
         </main>
      </div>
   );
}
