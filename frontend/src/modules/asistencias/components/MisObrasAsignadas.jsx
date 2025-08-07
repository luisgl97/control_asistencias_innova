"use client";

import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import {
   Hotel,
   HomeIcon,
   Loader2,
   ClipboardList,
   Calendar,
} from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const MisObrasAsignadas = ({ obrasHoy, obrasSiguiente }) => {
   const [isOpen, setIsOpen] = useState(false);

   const handleClose = () => {
      setIsOpen(false);
   };
   const handleRedirect = (latitude, longitude) => {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
   };
   const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <TooltipProvider>
            <Tooltip>
               <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                     <Button
                        variant="outline"
                        className="flex gap-2 items-center text-innova-blue border-innova-blue hover:bg-blue-50 hover:text-innova-blue"
                     >
                        <Hotel className="h-5 w-5" />
                        Obras asignadas
                     </Button>
                  </TooltipTrigger>
               </AlertDialogTrigger>
               <TooltipContent>
                  <p>Ver mis obras asignadas</p>
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>

         <AlertDialogContent className="sm:max-w-[500px] p-6">
            <AlertDialogHeader>
               <AlertDialogTitle className="text-2xl font-semibold text-innova-blue ">
                  Obras asignadas
               </AlertDialogTitle>
            </AlertDialogHeader>

            <Tabs defaultValue="hoy" className="w-full mt-4">
               <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger
                     value="hoy"
                     className="text-base data-[state=active]:text-innova-blue data-[state=active]:border-b-2 data-[state=active]:border-innova-blue  data-[state=active]:shadow-none"
                  >
                     Hoy
                  </TabsTrigger>
                  <TabsTrigger
                     value="proximamente"
                     className="text-base data-[state=active]:text-innova-blue data-[state=active]:border-b-2 data-[state=active]:border-innova-blue data-[state=active]:shadow-none"
                  >
                     Próximamente
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="hoy" className="mt-4">
                  <ScrollArea className="h-[300px] ">
                     {obrasHoy && obrasHoy.length > 0 ? (
                        <div className="space-y-4">
                           {obrasHoy.map((o) => (
                              <div
                                 key={o.id}
                                 className="flex items-start gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                              >
                                 <HomeIcon className="h-6 w-6 text-innova-blue mt-1 flex-shrink-0" />
                                 <div>
                                    <h3
                                       className="font-semibold text-lg cursor-pointer underline text-innova-blue"
                                       onClick={() =>
                                          handleRedirect(o.latitud, o.longitud)
                                       }
                                    >
                                       {o.direccion}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {o.nombre}
                                    </p>
                                    <p className="text-sm mt-1">
                                       {o.descripcion_tarea}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                           <ClipboardList className="h-12 w-12 mb-4 text-innova-blue" />
                           <p className="text-lg font-medium">
                              No hay obras asignadas para hoy.
                           </p>
                        </div>
                     )}
                  </ScrollArea>
               </TabsContent>

               <TabsContent value="proximamente" className="mt-4">
                  <ScrollArea className="h-[300px] ">
                     {obrasSiguiente && obrasSiguiente.length > 0 ? (
                        <div className="space-y-4">
                           {obrasSiguiente.map((o) => (
                              <div
                                 key={o.id}
                                 className="flex items-start gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                              >
                                 <HomeIcon className="h-6 w-6 text-innova-blue mt-1 flex-shrink-0" />
                                 <div>
                                    <h3
                                       className="font-semibold text-lg cursor-pointer underline text-innova-blue"
                                       onClick={() =>
                                          handleRedirect(o.latitud, o.longitud)
                                       }
                                    >
                                       {o.direccion}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {o.nombre} {" - "}{" "}
                                       {capitalizar(
                                          format(
                                             parseISO(o.fecha),
                                             "EEEE d 'de' MMMM yyyy",
                                             { locale: es }
                                          )
                                       )}
                                    </p>

                                    <p className="text-sm mt-1">
                                       {o.descripcion_tarea}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                           <ClipboardList className="h-12 w-12 mb-4 text-innova-blue" />
                           <p className="text-lg font-medium">
                              No hay obras próximas asignadas.
                           </p>
                           <p className="text-sm">
                              Revisa más tarde o contacta a tu supervisor.
                           </p>
                        </div>
                     )}
                  </ScrollArea>
               </TabsContent>
            </Tabs>

            <AlertDialogFooter className="mt-6">
               <Button onClick={handleClose} variant="outline">
                  Cerrar
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default MisObrasAsignadas;
