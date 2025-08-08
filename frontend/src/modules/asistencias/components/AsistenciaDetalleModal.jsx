import {
   Eye,
   Calendar,
   Clock,
   User,
   Briefcase,
   FileText,
   CheckCircle,
} from "lucide-react";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import asistenciaService from "../service/asistenciaService";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";

// Componente de esqueleto de carga
const LoadingSkeleton = () => (
   <div className="grid gap-4 py-4 text-sm">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
   </div>
);

export default function AsistenciaDetailDialog({ asistenciaId }) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [isOpen, setIsOpen] = useState(false);

   const fetchAsistenciaDetails = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await asistenciaService.detalle({
            asistencia_id: asistenciaId,
         });
         setData(response.data); // ✅ Corrección aquí
      } catch (err) {
         setError(
            err.message || "Error al cargar los detalles de la asistencia."
         );
         setData(null);
      } finally {
         setLoading(false);
      }
   }, [asistenciaId]);

   useEffect(() => {
      if (isOpen) {
         fetchAsistenciaDetails();
      } else {
         setData(null);
         setError(null);
      }
   }, [isOpen, fetchAsistenciaDetails]);

   const getEstadoBadgeVariant = (estado) => {
      switch (estado) {
         case "PRESENTE":
         case "ASISTIO":
            return "default";
         case "ASISTIO TARDE":
         case "TARDANZA":
            return "warning";
         case "FALTA JUSTIFICADA":
            return "secondary";
         case "SALIDA ANTICIPADA":
            return "outline";
         default:
            return "outline";
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <Tooltip>
            {asistenciaId ? (
               <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                     <Button variant="outline" size="icon" className="text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                        <Eye className="h-4 w-4" />
                     </Button>
                  </TooltipTrigger>
               </DialogTrigger>
            ) : (
               <TooltipTrigger asChild>
                  <span tabIndex={-1}>
                     <Button
                        variant="outline"
                        size="icon"
                        className="text-gray-400 pointer-events-none opacity-60"
                        tabIndex={-1} // opcional: evitar focus
                     >
                        <Eye className="h-4 w-4" />
                     </Button>
                  </span>
               </TooltipTrigger>
            )}
            <TooltipContent>
               <p>{asistenciaId ? "Ver detalles" : "No disponible"}</p>
            </TooltipContent>
         </Tooltip>

         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Detalles de Asistencia </DialogTitle>
            </DialogHeader>

            {loading && <LoadingSkeleton />}

            {error && (
               <div className="py-4 text-center text-red-500 font-medium">
                  <p>{error}</p>
               </div>
            )}

            {data && !loading && !error && (
               <div className="grid gap-4 py-4">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" /> Detalles
                     de Asistencia
                  </h3>

                  <div className="grid grid-cols-2 items-center gap-y-3 gap-x-4">
                     <Label className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Fecha:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.fecha || "No disponible"}
                     </span>

                     <Label className="text-gray-600 flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Estado:
                     </Label>
                     <Badge
                        variant={getEstadoBadgeVariant(
                           data.datos?.asistencia?.estado
                        )}
                     >
                        {data.datos?.asistencia?.estado || "N/A"}
                     </Badge>

                     <Label className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Hora Ingreso:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.hora_ingreso || "N/A"}
                     </span>

                     <Label className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Hora Salida:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.hora_salida || "Sin registrar"}
                     </span>
                     <Label className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Horas extras:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.horas_extras || "0"}
                     </span>

                     <Label className="text-gray-600 flex items-center gap-1">
                        <User className="h-4 w-4" /> Usuario:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.usuario?.nombres}{" "}
                        {data.datos?.asistencia?.usuario?.apellidos}
                     </span>

                     <Label className="text-gray-600 flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /> Cargo:
                     </Label>
                     <span className="font-medium text-gray-900">
                        {data.datos?.asistencia?.usuario?.cargo ||
                           "No disponible"}
                     </span>
                  </div>

                  {data.datos?.permiso && (
                     <>
                        <Separator className="my-4" />
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                           <FileText className="h-5 w-5 text-blue-600" />{" "}
                           Detalles de Permiso
                        </h3>

                        <div className="grid grid-cols-2 items-center gap-y-3 gap-x-4">
                           <Label className="text-gray-600 flex items-center gap-1">
                              <FileText className="h-4 w-4" /> Observación:
                           </Label>
                           <span className="font-medium text-gray-900">
                              {data.datos.permiso.observacion ||
                                 "Sin observación"}
                           </span>

                           {data.datos.permiso.autorizado_por_usuario && (
                              <>
                                 <Label className="text-gray-600 flex items-center gap-1">
                                    <User className="h-4 w-4" /> Autorizado por:
                                 </Label>
                                 <span className="font-medium text-gray-900">
                                    {
                                       data.datos.permiso.autorizado_por_usuario
                                          .nombres
                                    }{" "}
                                    {
                                       data.datos.permiso.autorizado_por_usuario
                                          .apellidos
                                    }{" "}
                                    (
                                    {
                                       data.datos.permiso.autorizado_por_usuario
                                          .cargo
                                    }
                                    )
                                 </span>
                              </>
                           )}
                        </div>
                     </>
                  )}
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
