import { useEffect, useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTabla } from "../components/SkeletonTable";
import asistenciaService from "../service/asistenciaService";
import { getRangoSemanaActual } from "../libs/getRangoSemanaActual";

// --- helpers ---
const diasSemana = [
   "lunes",
   "martes",
   "miércoles",
   "jueves",
   "viernes",
   "sábado",
];

function obtenerFechasSemana() {
   const { fecha_inicio } = getRangoSemanaActual();
   // Separar YYYY-MM-DD
   const [anio, mes, dia] = fecha_inicio.split("-").map(Number);
   // OJO: mes es 0-based para new Date
   let fecha = new Date(anio, mes - 1, dia);

   const fechas = [];
   for (let i = 0; i < diasSemana.length; i++) {
      fechas.push(new Date(fecha)); // Clona fecha local correcta
      fecha.setDate(fecha.getDate() + 1);
   }
   return fechas;
}

function esFechaFutura(fechaDia) {
   const hoy = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
   );
   hoy.setHours(0, 0, 0, 0);

   const fecha = new Date(fechaDia);
   fecha.setHours(0, 0, 0, 0);

   return fecha > hoy;
}

function obtenerBadgeEstado(estado) {
   if (estado === "Falta") return <Badge variant="destructive">Falta</Badge>;
   if (estado.includes("No marcado (Observado)"))
      return <Badge variant="secondary">Observado</Badge>;
   if (estado.includes(" - ")) return <Badge variant="default">Presente</Badge>;
   if (estado === "Pendiente")
      return <Badge variant="outline">Pendiente</Badge>;
   return <Badge variant="outline">{estado}</Badge>;
}

function formatearCeldaAsistencia(estado, fechaDia) {
   if (esFechaFutura(fechaDia)) {
      return (
         <div className="flex flex-col items-center gap-1">
            {obtenerBadgeEstado("Pendiente")}
         </div>
      );
   }

   if (estado === "Falta") {
      return (
         <div className="flex flex-col items-center gap-1">
            {obtenerBadgeEstado(estado)}
         </div>
      );
   }

   if (estado && estado.includes("No marcado (Observado)")) {
      const [entrada] = estado.split(" - ");
      return (
         <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-mono">{entrada}</span>
            <span className="text-xs text-muted-foreground">Sin salida</span>
            {obtenerBadgeEstado(estado)}
         </div>
      );
   }

   if (estado && estado.includes(" - ")) {
      const [entrada, salida] = estado.split(" - ");
      return (
         <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-mono">
               <span className="text-green-600">{entrada}</span>
               <span className="mx-1">-</span>
               <span className="text-red-600">{salida}</span>
            </div>
            {obtenerBadgeEstado(estado)}
         </div>
      );
   }

   return estado || "-";
}

// --- main component ---
export default function TablaAsistencias() {
   const [datosAsistencia, setDatosAsistencia] = useState([]);
   const [cargando, setCargando] = useState(true);
   const [error, setError] = useState(null);

   const cargarDatos = async () => {
      try {
         setCargando(true);
         setError(null);
         const res = await asistenciaService.generarReporte(
            getRangoSemanaActual()
         );
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

   const fechasSemana = obtenerFechasSemana();

   if (cargando) {
      return (
         <div className="w-full max-w-7xl mx-auto p-4">
            <SkeletonTabla />
         </div>
      );
   }

   if (error) {
      return (
         <div className="w-full max-w-7xl mx-auto p-4">
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
      <div className="w-full max-w-7xl mx-auto p-4">
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Control de Asistencias Semanal</CardTitle>
                     <CardDescription>
                        Registro semanal de asistencias, tardanzas y
                        observaciones del personal
                     </CardDescription>
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
                           {diasSemana.map((dia) => (
                              <TableHead
                                 key={dia}
                                 className="text-center min-w-[120px]"
                              >
                                 {dia.charAt(0).toUpperCase() + dia.slice(1)}
                              </TableHead>
                           ))}
                           <TableHead className="text-center">
                              Asistencias
                           </TableHead>
                           <TableHead className="text-center">
                              Tardanzas
                           </TableHead>
                           <TableHead className="text-center">
                              Observados
                           </TableHead>
                           <TableHead className="text-center">Faltas</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {datosAsistencia.map((trabajador, indice) => (
                           <TableRow key={indice}>
                              <TableCell className="font-medium">
                                 {trabajador.trabajador}
                              </TableCell>
                              {diasSemana.map((dia, i) => (
                                 <TableCell className="text-center" key={dia}>
                                    {formatearCeldaAsistencia(
                                       trabajador[dia],
                                       fechasSemana[i]
                                    )}
                                 </TableCell>
                              ))}
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200"
                                 >
                                    {trabajador.asistencias}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                 >
                                    {trabajador.tardanzas}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                 >
                                    {trabajador.observados}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200"
                                 >
                                    {trabajador.faltas}
                                 </Badge>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>

               {/* <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Badge variant="default">Presente</Badge>
                     <span>Horario completo registrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="secondary">Observado</Badge>
                     <span>Sin marcado de salida</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="destructive">Falta</Badge>
                     <span>No asistió</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline">Pendiente</Badge>
                     <span>Día aún no ha llegado</span>
                  </div>
               </div> */}
            </CardContent>
         </Card>
      </div>
   );
}
