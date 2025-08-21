import { Alert, AlertDescription } from "@/components/ui/alert";
import asistenciaService from "../service/asistenciaService";
import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
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
import AsistenciaDetailDialog from "./AsistenciaDetalleModal";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { normalizarTexto } from "../libs/mormalizarTextoBusqueda";
import { ModalJustificarPermiso } from "./ModalJustificarPermiso";

const estilos = {
   ASISTIO: "bg-green-50 text-green-700 border-green-200",
   PRESENTE: "bg-green-50 text-green-700 border-green-200",
   "FALTA JUSTIFICADA": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const AsistenciaPordia = () => {
   const { user } = useAuth();
   const [datosAsistencia, setDatosAsistencia] = useState([]);
   const [datosAsistenciaGuard, setDatosAsistenciaGuard] = useState([]);
   const [cargando, setCargando] = useState(true);
   const [error, setError] = useState(null);
   const hoy = new Date();
hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
const [fechaSeleccionada, setFechaSeleccionada] = useState(
  hoy.toISOString().split("T")[0]
);
   const [nombreTrabajador, setNombreTrabajador] = useState("");
   const cargarDatos = async () => {
      try {
         setCargando(true);
         setError(null);
         const res = await asistenciaService.asistenciasDelDia({
            fecha: fechaSeleccionada,
         });
     
         setDatosAsistencia(res.data.datos);
         setDatosAsistenciaGuard(res.data.datos);
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
      if (fechaSeleccionada) {
         cargarDatos();
      }
   }, [fechaSeleccionada]);

   useEffect(() => {
      let copy = [...datosAsistenciaGuard];
      if (nombreTrabajador) {
         copy = copy.filter((t) =>
            normalizarTexto(t.trabajador).includes(
               normalizarTexto(nombreTrabajador)
            )
         );
      }
      setDatosAsistencia(copy);
   }, [nombreTrabajador, datosAsistenciaGuard]);

   if (cargando) {
      return (
         <div className="w-full max-w-7xl ">
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
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                  <div className="flex-1 min-w-[200px]">
                     <CardTitle className="text-lg md:text-2xl">
                        Control de Asistencias Diarias
                     </CardTitle>
                  </div>
                  <div className="w-full md:w-auto">
                     <Input
                        placeholder="Buscar trabajador"
                        value={nombreTrabajador}
                        onChange={(e) => setNombreTrabajador(e.target.value)}
                        className="w-full md:min-w-[200px]"
                     />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                     <Calendar className="h-4 w-4" />
                     <Label
                        htmlFor="fecha"
                        className="text-sm whitespace-nowrap"
                     >
                        Fecha:
                     </Label>
                     <Input
                        id="fecha"
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        className="w-full md:w-auto"
                        max={new Date().toISOString().slice(0, 10)}
                     />
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
                                    {trabajador.tipo_documento}: {trabajador.dni}
                                 </p>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className={`${
                                       estilos[trabajador.estado]
                                    } text-xs`}
                                 >
                                    {trabajador.estado}
                                 </Badge>
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

                              <TableCell className="text-center space-x-2">
                                 <AsistenciaDetailDialog
                                    asistenciaId={trabajador.asistencia_id}
                                 />
                                 {(trabajador.estado === "SIN REGISTRO"||trabajador.estado === "FALTA") && (
                                    <ModalJustificarPermiso
                                       fecha_dia={trabajador.fecha}
                                       id={trabajador.id}
                                       cargarDatos={cargarDatos}
                                       tipo={"FALTA"}
                                    />
                                 )}
                                 {(trabajador.estado === "TARDANZA") && (
                                    <ModalJustificarPermiso
                                       fecha_dia={trabajador.fecha}
                                       id={trabajador.id}
                                       cargarDatos={cargarDatos}
                                       tipo={"TARDANZA"}
                                       asistencia_id={trabajador.asistencia_id}

                                    />
                                 )}
                                 {trabajador.asistencia_id &&
                                    trabajador.estado !== "FALTA JUSTIFICADA" &&
                                    user.rol !== "LIDER TRABAJADOR" && (
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
