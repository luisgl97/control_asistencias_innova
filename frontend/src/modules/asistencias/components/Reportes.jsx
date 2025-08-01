"use client";

import { useState } from "react";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import usuarioService from "@/modules/usuarios/services/usuarioService";
import asistenciaService from "../service/asistenciaService";
import { generarPDF } from "../libs/generarPDF";

const Reportes = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [anio, setAnio] = useState("");
   const [mes, setMes] = useState("");

   const anioActual = new Date().getFullYear();
   const anios = Array.from({ length: 5 }, (_, i) =>
      (anioActual - i).toString()
   );

   const meses = [
      { value: "01", label: "Enero" },
      { value: "02", label: "Febrero" },
      { value: "03", label: "Marzo" },
      { value: "04", label: "Abril" },
      { value: "05", label: "Mayo" },
      { value: "06", label: "Junio" },
      { value: "07", label: "Julio" },
      { value: "08", label: "Agosto" },
      { value: "09", label: "Septiembre" },
      { value: "10", label: "Octubre" },
      { value: "11", label: "Noviembre" },
      { value: "12", label: "Diciembre" },
   ];

   const generarReporte = async () => {
      if (!anio || !mes) {
         toast.error("Por favor selecciona un año y un mes");
         return;
      }
      console.log(mes);
      
      const fechaInicio = `${anio}-${mes}-01`;
      const ultimoDia = new Date(anio, mes, 0).getDate(); // mes +1, día 0 da último día del mes
      const fechaFin = `${anio}-${mes
         .toString()
         .padStart(2, "0")}-${ultimoDia}`;
      console.log(fechaInicio, fechaFin);

      try {
         setIsLoading(true);
         const resT = await usuarioService.getUsuarios();
         const trabajadores = resT.data.datos;
         let asistencias = [];
         for (const trabajador of trabajadores) {
            const res = await asistenciaService.asistenciaPorUsuario({
               fecha_inicio: fechaInicio,
               fecha_fin: fechaFin,
               usuario_id: trabajador.id,
            });
            asistencias.push(res.data.datos);
         }
         console.log(asistencias);

         await generarPDF(asistencias);
         toast.success("Reporte generado con éxito");
      } catch (error) {
         console.log(error);

         toast.error("Hubo un error al generar el pdf ");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="max-w-md mx-auto p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-md shadow-md">
         <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
            Generar Reporte Mensual
         </h2>

         <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="anio">Año</Label>
               <Select onValueChange={setAnio} disabled={isLoading}>
                  <SelectTrigger id="anio" className="w-full">
                     <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>
                  <SelectContent>
                     {anios.map((a) => (
                        <SelectItem key={a} value={a}>
                           {a}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <Label htmlFor="mes">Mes</Label>
               <Select onValueChange={setMes} disabled={isLoading}>
                  <SelectTrigger id="mes" className="w-full">
                     <SelectValue placeholder="Selecciona un mes" />
                  </SelectTrigger>
                  <SelectContent>
                     {meses.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                           {m.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         <Button
            className="w-full"
            onClick={generarReporte}
            disabled={isLoading}
         >
            Generar reporte
         </Button>
      </div>
   );
};

export default Reportes;
