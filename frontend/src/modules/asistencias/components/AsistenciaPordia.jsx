import { Alert, AlertDescription } from "@/components/ui/alert";
import asistenciaService from "../service/asistenciaService";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SkeletonTabla } from "./SkeletonTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ModalJustificarFalta } from "./ModalJustificarFalta";
import ModalHorasExtras from "./ModalHorasExtras";

const estilos = {
   ASISTIO: "bg-green-50 text-green-700 border-green-200",
   PRESENTE: "bg-green-50 text-green-700 border-green-200",
   "FALTA JUSTIFICADA": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const AsistenciaPordia = () => {
   const [datosAsistencia, setDatosAsistencia] = useState([]);
   const [cargando, setCargando] = useState(true);
   const [error, setError] = useState(null);

   const cargarDatos = async () => {
      try {
         setCargando(true);
         const date = new Date();
         const year = date.getFullYear();
         const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes comienza en 0
         const day = String(date.getDate()).padStart(2, "0");

         const formattedDate = `${year}-${month}-${day}`;
         setError(null);

         const res = await asistenciaService.asistenciasDelDia({
            fecha: formattedDate,
         });


         setDatosAsistencia(res.data.datos);
      } catch (err) {
         setError(
            "Error al cargar los datos de asistencia. Por favor, intenta nuevamente."
         );
         console.error("Error cargando datos:", err);
      } finally {
         setCargando(false);
      }
   };

   useEffect(() => {
      cargarDatos();
   }, []);

   if (cargando) {
      return (
         <div className="w-full mx-auto ">
            <SkeletonTabla />
         </div>
      );
   }

   if (error) {
      return (
         <div className="w-full max-w-7xl mx-auto ">
            <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={cargarDatos}
                     className="ml-4 bg-transparent"
                  >
                     <RefreshCw className="h-4 w-4 mr-2" />
                     Reintentar
                  </Button>
               </AlertDescription>
            </Alert>
         </div>
      );
   }
   return (
      <div className="w-full ">
         <Card className="">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Control de Asistencias Diarias</CardTitle>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="min-w-[150px]">
                              Trabajador
                           </TableHead>
                           <TableHead className="text-center">Estado</TableHead>
                           <TableHead className="text-center">
                              Hora ingreso
                           </TableHead>
                           <TableHead className="text-center">
                              Hora salida
                           </TableHead>
                           <TableHead className="text-center">
                              Horas extras
                           </TableHead>
                           <TableHead className="text-center">
                              Acciones
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {datosAsistencia.map((trabajador, indice) => (
                           <TableRow key={indice}>
                              <TableCell className="font-medium">
                                 {trabajador.trabajador}
                                 <br />
                                 <p className="text-xs">
                                    DNI: {trabajador.dni}
                                 </p>
                              </TableCell>
                              <TableCell className="text-center">
                                 {trabajador.estado == "SIN REGISTRO" ? (
                                    <ModalJustificarFalta
                                       fecha_dia={trabajador.fecha}
                                       id={trabajador.id}
                                       cargarDatos={cargarDatos}
                                    />
                                 ) : (
                                    <Badge
                                       variant="outline"
                                       className={`${
                                          estilos[trabajador.estado]
                                       } text-xs`}
                                    >
                                       {trabajador.estado}
                                    </Badge>
                                 )}
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                 >
                                    {trabajador.hora_ingreso}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200"
                                 >
                                    {trabajador.hora_salida}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200"
                                 >
                                    {trabajador.horas_extras}
                                 </Badge>
                              </TableCell>

                              <TableCell className="text-center">
                                 {(trabajador.asistencia_id &&
                                    trabajador.estado !==
                                       "FALTA JUSTIFICADA") && (
                                    <ModalHorasExtras
                                       cargarDatos={cargarDatos}
                                       id={trabajador.asistencia_id}
                                       nombres={trabajador.trabajador}
                                       hizo_horas_extras={
                                          trabajador.hizo_horas_extras
                                       }
                                    />
                                 )}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
export default AsistenciaPordia;
