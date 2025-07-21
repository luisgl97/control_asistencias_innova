import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarcarAsistencia() {
   return (
      <div className="min-h-screen bg-gray-50">

         {/* Contenido principal */}
         <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Historial reciente - Solo visible en desktop */}
            <Card className="bg-gradient-to-r from-innova-blue/95 to-innova-blue border-0 shadow-lg order-1 md:order-2  md:col-span-2">
               <CardHeader className="text-white pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                     <Clock className="w-6 h-6" />
                     <h2 className="text-xl sm:text-2xl font-bold">
                        Marcar Asistencia
                     </h2>
                  </div>
                  <p className="text-blue-100 text-sm sm:text-base">
                     Registra tu entrada o salida del trabajo
                  </p>
               </CardHeader>

               <CardContent className="p-4 sm:p-6">
                  {/* Botones responsivos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Button
                        size="lg"
                        className="bg-white text-innova-blue hover:bg-blue-50 h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                     >
                        <MapPin className="w-5 h-5 mr-2" />
                        Marcar Entrada
                     </Button>

                     <Button
                        size="lg"
                        variant="outline"
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                     >
                        <MapPin className="w-5 h-5 mr-2" />
                        Marcar Salida
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
                        <div>
                           <p className="text-xs sm:text-sm font-medium">
                              Hora Actual
                           </p>
                           <p className="text-sm sm:text-base font-semibold">
                              {new Date().toLocaleTimeString("es-ES", {
                                 hour: "2-digit",
                                 minute: "2-digit",
                              })}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            <Card className="shadow-lg border-0   order-2 md:order-1 md:col-span-1">
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
                           08:15 AM
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">Salida:</span>
                        <span className="font-medium text-gray-400">
                           Pendiente
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">Horas trabajadas:</span>
                        <span className="font-medium">7h 45m</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </main>
      </div>
   );
}
