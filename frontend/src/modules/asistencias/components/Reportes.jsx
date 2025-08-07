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
import { Loader2, FileDown, Eye, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useReportes from "../hooks/useReporte";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const Reportes = () => {
   const [anio, setAnio] = useState("");
   const [mes, setMes] = useState("");
   
   const { user } = useAuth();
   const {
      isLoading,
      resultados,
      pdfSeleccionado,
      setPDFSeleccionado,
      generarReporte,
      emitirIndividual,
      emitirMasivo,
   } = useReportes(user);
   
   const anioActual = new Date().getFullYear();
   const anioInicio = 2025;
   const cantidadAnios = Math.min(anioActual - anioInicio + 1, 5);
   const primerAnio = anioInicio + Math.max(0, anioActual - anioInicio - 4);
   const anios = Array.from({ length: cantidadAnios }, (_, i) =>
      (primerAnio + i).toString()
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

   return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-md shadow-md">
         <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
            Reportes Mensuales de Asitencia
         </h2>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <Label>Año</Label>
               <Select onValueChange={setAnio} disabled={isLoading}>
                  <SelectTrigger className="w-full">
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

            <div>
               <Label>Mes</Label>
               <Select onValueChange={setMes} disabled={isLoading}>
                  <SelectTrigger className="w-full">
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
            onClick={() => generarReporte(anio, mes)}
            disabled={isLoading}
         >
            {isLoading ? (
               <span className="flex items-center gap-2 ">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Generando...
               </span>
            ) : (
               "Generar Reportes Informativos"
            )}
         </Button>

         {resultados.length > 0 && (
            <div className="space-y-6">
               <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h3 className="text-lg font-semibold">Reportes generados</h3>
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={async () => {
                           try {
                              const zip = new JSZip();
                              
                              for (const r of resultados) {
                                 const response = await fetch(r.url);

                                 if (!response.ok) {
                                    console.error(`Error descargando ${r.url}: ${response.status}`);
                                    continue;
                                 }

                                 const blob = await response.blob();
                                 
                                 const nombre = r.trabajador
                                    .replace(/ /g, "_")
                                    .replace(/[^\w]/g, "");
                                 
                                 const archivoFinal = `${nombre}_${anio}-${mes}.pdf`;

                                 zip.file(archivoFinal, blob);
                              }

                              const content = await zip.generateAsync({ type: "blob" });
                              saveAs(content, `reportes_${mes}_${anio}.zip`);
                           } catch (error) {
                              console.error("Error al generar ZIP:", error);
                              toast.error("Error al generar ZIP")
                           }
                        }}
                     >
                        Descargar todos
                     </Button>
                     <Button
                        variant="default"
                        size="sm"
                        onClick={() => emitirMasivo(anio, mes)}
                        disabled={isLoading}
                     >
                        <Download className="h-4 w-4 mr-2" />
                        Emitir todos los reportes oficiales
                     </Button>
                  </div>
               </div>

               <div className="overflow-x-auto border rounded-md">
                  <table className="min-w-full text-sm">
                     <thead className="bg-zinc-100 dark:bg-zinc-800 text-left">
                        <tr>
                           <th className="p-2">Trabajador</th>
                           <th className="p-2">Hash</th>
                           <th className="p-2">Acciones</th>
                        </tr>
                     </thead>
                     <tbody>
                        {resultados.map((r, idx) => (
                           <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-700">
                              <td className="p-2 font-medium">{r.trabajador}</td>
                              <td className="p-2 text-xs font-mono break-all">{r.hash}</td>
                              <td className="p-2">
                                 <div className="flex flex-nowrap flex-wrap sm:flex-nowrap gap-2 items-center">
                                    <Button variant="outline" size="icon" onClick={() => setPDFSeleccionado(r.url)}>
                                       <Eye className="h-4 w-4" />
                                    </Button>

                                    <a href={r.url} download target="_blank">
                                       <Button variant="outline" size="icon">
                                          <FileDown className="h-4 w-4" />
                                       </Button>
                                    </a>

                                    {r.yaEmitido ? (
                                       <span className="text-green-600 text-xs font-bold">Emitido</span>
                                    ) : (
                                       <Button
                                          variant="destructive"
                                          size="sm"
                                          disabled={isLoading}
                                          onClick={() => emitirIndividual(r, anio, mes)}
                                       >
                                          Emitir Oficial
                                       </Button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {pdfSeleccionado && (
                  <div className="mt-6 border rounded shadow bg-white dark:bg-zinc-800">
                     <h4 className="text-center py-2 font-semibold border-b dark:border-zinc-700">
                        Vista previa del PDF seleccionado
                     </h4>
                     <iframe
                        src={pdfSeleccionado}
                        title="Vista previa del PDF"
                        width="100%"
                        height="900px"
                        style={{ border: "none" }}
                     />
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Reportes;
