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
import { AlertCircle, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTabla } from "../components/SkeletonTable";
import asistenciaService from "../service/asistenciaService";
import { getRangoSemanaActual } from "../libs/getRangoSemanaActual";
import { Input } from "@/components/ui/input";
import { normalizarTexto } from "../libs/mormalizarTextoBusqueda";

function esFechaFutura(fechaStr) {
   const hoy = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
   );
   hoy.setHours(0, 0, 0, 0);

   const partesFecha = fechaStr.match(/\((\d{2}-\d{2}-\d{4})\)/);
   if (!partesFecha) return false;

   const [dia, mes, anio] = partesFecha[1].split("-").map(Number);
   const fecha = new Date(anio, mes - 1, dia);
   fecha.setHours(0, 0, 0, 0);

   return fecha > hoy;
}

function obtenerBadgeEstado(estado) {
   if (estado === "Falta") return <Badge variant="destructive">Falta</Badge>;
   if (estado.includes("Justificada"))
      return <Badge variant="secondary">Justificada</Badge>;
   if (estado.includes("No marcado") || estado.includes("- -"))
      return <Badge variant="secondary">Observado</Badge>;
   if (estado.includes(" - ")) return <Badge variant="default">Presente</Badge>;
   if (estado === "Pendiente")
      return <Badge variant="outline">Pendiente</Badge>;
   return <Badge variant="outline">{estado}</Badge>;
}

function formatearCeldaAsistencia(estado, diaConFecha) {
   if (esFechaFutura(diaConFecha)) {
      return (
         <div className="flex flex-col items-center gap-1">
            {obtenerBadgeEstado("Pendiente")}
         </div>
      );
   }

   if (estado === "Falta" || estado.includes("Justificada")) {
      return (
         <div className="flex flex-col items-center gap-1">
            {obtenerBadgeEstado(estado)}
         </div>
      );
   }

   if (estado && estado.includes(" - ") && estado.includes("🕒")) {
      const [entrada, salidaYEstado] = estado.split(" - ");
      const salida = salidaYEstado.split(" ")[0];
      return (
         <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-mono text-yellow-800">
               {entrada} - {salida}
            </div>
            {obtenerBadgeEstado("Tarde")}
         </div>
      );
   }

   if (estado && estado.includes(" - ") && estado.includes("✅")) {
      const [entrada, salida] = estado.split(" - ");
      return (
         <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-mono text-green-700">
               {entrada} - {salida.replace("✅", "").trim()}
            </div>
            {obtenerBadgeEstado("Presente")}
         </div>
      );
   }

   if (estado && estado.includes("- -")) {
      return (
         <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-mono text-muted-foreground">
               Sin salida
            </span>
            {obtenerBadgeEstado("Observado")}
         </div>
      );
   }

   return estado || "-";
}

export default function AsistenciaSemanal() {
   const [datosAsistenciaGuard, setDatosAsistenciaGuard] = useState([]);
   const [datosAsistencia, setDatosAsistencia] = useState([]);
   const [cargando, setCargando] = useState(true);
   const [error, setError] = useState(null);
   const [columnasDias, setColumnasDias] = useState([]);
   const [offset, setOffset] = useState(0);
   const [numeroSemana, setNumeroSemana] = useState("...loading");
   const [nombreTrabajador, setNombreTrabajador] = useState("");
   const [desactivar, setDesactivar] = useState(false);
   const cargarDatos = async () => {
      try {
         const { fecha_fin, fecha_inicio, numero_semana, desactivar } =
            getRangoSemanaActual(offset);
         const data=getRangoSemanaActual(offset+1);
         if (data.desactivar) {
            setDesactivar(true)
         }
         setError(null);

         setCargando(true);

         setNumeroSemana(numero_semana);
         const res = await asistenciaService.generarReporte({
            fecha_fin,
            fecha_inicio,
         });
         const datos = res.data.datos;
         setDatosAsistencia(datos);
         setDatosAsistenciaGuard(datos);
         if (datos.length > 0) {
            const claves = Object.keys(datos[0]);
            const dias = claves.filter((k) =>
               k
                  .toLowerCase()
                  .match(/^(lunes|martes|miércoles|jueves|viernes|sábado)/)
            );
            setColumnasDias(dias);
         }
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
   }, [offset]);
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
         <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               <section className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8 w-full">
                  <div className="flex-1 min-w-[200px]">
                     <CardTitle className="text-lg md:text-2xl">
                        Control de Asistencias Semanal
                     </CardTitle>
                     <CardDescription>
                        Registro semanal de asistencias, tardanzas y
                        observaciones del personal
                     </CardDescription>
                  </div>

                  <div className="w-full md:w-auto">
                     <Input
                        placeholder="Nombre trabajador"
                        value={nombreTrabajador}
                        onChange={(e) => setNombreTrabajador(e.target.value)}
                        className="w-full md:min-w-[200px]"
                     />
                  </div>
               </section>

               <section className="flex items-center justify-end gap-2 mt-2 md:mt-0">
                  <Button
                     onClick={() => setOffset(offset - 1)}
                     size="icon"
                     variant="outline"
                     aria-label="Semana anterior"
                  >
                     <ArrowLeft />
                  </Button>
                  <span className="text-sm font-medium truncate">
                     {numeroSemana}
                  </span>
                  <Button
                     onClick={() => setOffset(offset + 1)}
                     size="icon"
                     variant="outline"
                     aria-label="Semana siguiente"
                     disabled={desactivar}
                  >
                     <ArrowRight />
                  </Button>
               </section>
            </CardHeader>

            <CardContent>
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="min-w-[150px]">
                              Trabajador
                           </TableHead>
                           {columnasDias.map((dia) => (
                              <TableHead
                                 key={dia}
                                 className="text-center min-w-[150px]"
                              >
                                 {dia}
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
                              {columnasDias.map((dia) => (
                                 <TableCell className="text-center" key={dia}>
                                    {formatearCeldaAsistencia(
                                       trabajador[dia],
                                       dia
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
            </CardContent>
         </Card>
      </div>
   );
}
