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
   CoffeeIcon,
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
import { ModalSalidaAnticipada } from "../components/ModalSalidaAnticipada";
import { fecha_hora_asistencia } from "../libs/fecha_hora_asistencia";
import { obtenerCoordenadas } from "../libs/obtenerCoordenadas";
import { calcularDistanciaEnMetros } from "../libs/calcularDistancias";
import { obtenerUbicacionesSimuladas } from "../mocks/obras_simuladas";
import MisObrasAsignadas from "../components/MisObrasAsignadas";

export default function MarcarAsistencia() {
   const { user, loading } = useAuth();
   const [accionEnProceso, setAccionEnProceso] = useState(false);
   const [status, setStatus] = useState({
      estadoIngreso: true,
      estadoSalida: true,
      hora_inicio_refrigerio: null,
      hora_fin_refrigerio: null,
   });
   const [ubicacion, setUbicacion] = useState(null);
   const [ubicacionLoading, setUbicacionLoading] = useState(true);
   const [ubicacionError, setUbicacionError] = useState(null);
   const [asistencia, setAsistencia] = useState({});
   const [obras, setObras] = useState([]);
   const [obrasSiguiente, setObrasSiguiente] = useState([]);

   const fecha_active = new Date();
   const esSabado =
      fecha_active.toLocaleDateString("es-PE", {
         timeZone: "America/Lima",
         weekday: "short",
      }) === "sáb";

   const fetchVerificarAsistencia = async () => {
      try {
         const res = await asistenciaService.verificaAsistencia({
            fecha: new Date(),
         });
         setStatus({
            ...status,
            estadoIngreso: res.data.datos.ingreso.estado,
            estadoSalida: res.data.datos.salida.estado,
            hora_inicio_refrigerio: res.data.datos.hora_inicio_refrigerio,
            hora_fin_refrigerio: res.data.datos.hora_fin_refrigerio,
         });
         setObras(res.data.datos.obras_asignadas_del_dia);
         setObrasSiguiente(res.data.datos.obras_asignadas_de_maniana);
         setAsistencia(res.data.datos);
      } catch (error) {
         console.error(error);
      }
   };

   const obtenerUbicacionActual = async () => {
      setUbicacionLoading(true);
      setUbicacionError(null);
      try {
         const { lat, lng } = await obtenerCoordenadas();

         const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
         );
         if (response.data) {
            setUbicacion({
               latitude: lat,
               longitude: lng,
               display_name: response.data.display_name,
            });
         }
      } catch (error) {
         console.error(error);
         setUbicacionError("Error al obtener la ubicación");
      } finally {
         setUbicacionLoading(false);
      }
   };

   useEffect(() => {
      if (user) {
         fetchVerificarAsistencia();
         obtenerUbicacionActual();
      }
   }, [user]);

   const construccionDataDeEnvio = async () => {
      if (!ubicacion) {
         toast.error("Ubicación no disponible");
         return null;
      }
      let posicion;
      try {
         posicion = await obtenerCoordenadas();
      } catch (error) {
         toast.error("No se pudo obtener la ubicación");
         return null;
      }
      let obraEncontrada = null;

      for (const obra of obras) {
         const distancia = calcularDistanciaEnMetros(
            posicion.lat,
            posicion.lng,
            obra.latitud,
            obra.longitud
         );
         if (distancia <100) {
            obraEncontrada = obra;
            break;
         }
      }
      if (!obraEncontrada) {
         toast.error("Usted no se encuentra en el rango de la obra.");
         return null;
      }
      return {
         lat: posicion.lat,
         lng: posicion.lng,
         direccion: ubicacion.display_name,
         obra_id: obraEncontrada.id,
         obra_nombre: obraEncontrada.nombre,
         obra_direccion: obraEncontrada.direccion,
      };
   };
   const marcarAsistenciaIngreso = async () => {
      setAccionEnProceso(true);
      const datosUbicacion = await construccionDataDeEnvio();
      if (!datosUbicacion) {
         setAccionEnProceso(false);
         return;
      }
      const { fecha_a, hora_a } = fecha_hora_asistencia();
      try {
         const response = await asistenciaService.registrarIngreso({
            fecha: fecha_a,
            hora_ingreso: hora_a,
            ubicacion_ingreso: datosUbicacion,
            observacion_ingreso: "",
         });
         toast.success("Asistencia guardada con éxito");
         fetchVerificarAsistencia(); // Actualizar estado
      } catch (error) {
         console.error(error);
         toast.error("Error al guardar la asistencia");
      } finally {
         setAccionEnProceso(false);
      }
   };
   const marcarAsistenciaSalida = async () => {
      setAccionEnProceso(true);
      const datosUbicacion = await construccionDataDeEnvio();
      if (!datosUbicacion) {
         setAccionEnProceso(false);
         return;
      }

      const { fecha_a, hora_a } = fecha_hora_asistencia();
      try {
         const response = await asistenciaService.registrarSalida({
            fecha: fecha_a,
            hora_salida: hora_a,
            ubicacion_salida: datosUbicacion,
            observacion_salida: "",
         });
         toast.success("Asistencia guardada con éxito");
         fetchVerificarAsistencia(); // Actualizar estado
      } catch (error) {
         console.error(error);
         toast.error("Error al guardar la asistencia");
      } finally {
         setAccionEnProceso(false);
      }
   };
   const marcarInicioRefrigerio = async () => {
      setAccionEnProceso(true);

      const hora = new Intl.DateTimeFormat("es-PE", {
         timeZone: "America/Lima",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
         hour12: false,
      }).format(new Date());
      try {
         const res = await asistenciaService.registrarInicioRefrigerio({
            asistencia_id: asistencia.asistencia_id,
            hora_inicio_refrigerio: hora,
         });

         toast.success("Inicio de refrigerio guardado con éxito");
         fetchVerificarAsistencia();
      } catch (error) {
         console.error(error);
         toast.error("Se produjo un error");
      } finally {
         setAccionEnProceso(false);
      }
   };
   const marcarFinRefrigerio = async () => {
      setAccionEnProceso(true);
      const hora = new Intl.DateTimeFormat("es-PE", {
         timeZone: "America/Lima",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
         hour12: false,
      }).format(new Date());
      try {
         const res = await asistenciaService.registrarFinRefrigerio({
            asistencia_id: asistencia.asistencia_id,
            hora_fin_refrigerio: hora,
         });
         toast.success("Fin de refrigerio guardado con éxito");
         fetchVerificarAsistencia();
      } catch (error) {
         console.error(error);
         toast.error("Se produjo un error");
      } finally {
         setAccionEnProceso(false);
      }
   };

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
                  <Button onClick={obtenerUbicacionActual} className="w-full">
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
               <HorariosTrabajo className={"md:hidden"} esSabado={esSabado} />

               <Card className="bg-gradient-to-r from-innova-blue/95 to-innova-blue border-0 shadow-lg gap-4">
                  <CardHeader className="text-white ">
                     <div className="flex justify-between mb-2">
                        <div className="flex items-center space-x-2 ">
                           <Clock className="w-6 h-6" />
                           <h2 className="text-xl sm:text-2xl font-bold">
                              Marcar Asistencia
                           </h2>
                        </div>
                        <MisObrasAsignadas obrasHoy={obras} obrasSiguiente={obrasSiguiente}/>
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
                     {asistencia.falta_justificada && (
                        <div className="text-sm bg-amber-500 text-white flex items-center rounded-lg p-2 gap-2 mt-2">
                           <AlertCircle className="w-4 h-4" />
                           <p>Usted a registrado una falta justificada</p>
                        </div>
                     )}
                  </CardHeader>
                  <CardContent className="sm:p-6 ">
                     {accionEnProceso ? (
                        <div className="flex flex-col items-center justify-center min-h-[250px]">
                           <Loader2 className="w-8 h-8 animate-spin text-innova-blue mb-3" />
                           <p className="text-sm text-gray-600">
                              Registrando asistencia...
                           </p>
                        </div>
                     ) : (
                        <>
                           {/* Botones y contenido original */}
                           <div className="grid grid-cols-2 gap-3">
                              <Button
                                 onClick={marcarAsistenciaIngreso}
                                 className="bg-green-600 hover:bg-green-500 text-white py-4 h-auto flex flex-col items-center gap-1 font-semibold text-base shadow-lg"
                                 disabled={
                                    status.estadoIngreso ||
                                    !ubicacion ||
                                    asistencia.falta_justificada
                                 }
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
                                    !ubicacion ||
                                    (!esSabado && !status.hora_fin_refrigerio)
                                 }
                              >
                                 <LogOut className="w-5 h-5" />
                                 <span className="text-sm">Marcar Salida</span>
                              </Button>
                           </div>

                           <div
                              className={`grid ${
                                 esSabado ? "grid-cols-1" : "grid-cols-2"
                              }  gap-3 mt-6`}
                           >
                              {!esSabado && (
                                 <>
                                    {status.hora_inicio_refrigerio ? (
                                       <Button
                                          className="bg-amber-600 hover:bg-amber-500 text-white py-2 h-auto flex items-center justify-center gap-1 text-xs border border-amber-500 cursor-pointer"
                                          variant="outline"
                                          disabled={
                                             status.hora_fin_refrigerio ||
                                             status.estadoSalida
                                          }
                                          onClick={marcarFinRefrigerio}
                                       >
                                          <CoffeeIcon className="w-5 h-5" />
                                          <span className="text-sm">
                                             Terminar Break
                                          </span>
                                       </Button>
                                    ) : (
                                       <Button
                                          className="bg-amber-600 hover:bg-amber-500 text-white py-2 h-auto flex items-center justify-center gap-1 text-xs border border-amber-500 cursor-pointer"
                                          variant="outline"
                                          disabled={
                                             !status.estadoIngreso ||
                                             status.estadoSalida
                                          }
                                          onClick={marcarInicioRefrigerio}
                                       >
                                          <Coffee className="w-5 h-5" />
                                          <span className="text-sm">
                                             Iniciar Break
                                          </span>
                                       </Button>
                                    )}
                                 </>
                              )}

                              <ModalSalidaAnticipada
                                 estado_ingreso={status.estadoIngreso}
                                 estado_salida={status.estadoSalida}
                                 estado_fin_refrigerio={
                                    status.hora_fin_refrigerio
                                 }
                                 ubicacion={ubicacion}
                                 id={asistencia.asistencia_id}
                                 construccionDataDeEnvio={
                                    construccionDataDeEnvio
                                 }
                                 fetchVerificarAsistencia={
                                    fetchVerificarAsistencia
                                 }
                              />
                           </div>

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
                        </>
                     )}
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
                           <span className="text-gray-600">
                              Inicio refrigerio:
                           </span>
                           <span className="font-medium text-amber-600">
                              {asistencia.hora_inicio_refrigerio
                                 ? asistencia.hora_inicio_refrigerio
                                 : "Pendiente"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">
                              Fin refrigerio:
                           </span>
                           <span className="font-medium text-amber-600">
                              {asistencia.hora_fin_refrigerio
                                 ? asistencia.hora_fin_refrigerio
                                 : "Pendiente"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">Salida:</span>
                           <span className="font-medium text-red-600">
                              {asistencia.salida.hora
                                 ? asistencia.salida.hora
                                 : "Pendiente"}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">
                              Horas trabajadas:
                           </span>
                           <span className="font-medium text-innova-blue">
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
