"use client";

import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import {
   AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
   AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileDown, Eye, Download, Search, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useReportes from "../hooks/useReporte";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

// Util: descarga individual
async function descargarArchivo(url, nombreFinal) {
   const res = await fetch(url);
   if (!res.ok) throw new Error(`Error descargando ${url}: ${res.status}`);
   const blob = await res.blob();
   saveAs(blob, nombreFinal);
}

const Reportes = () => {
   // Estado de confirmación unificado
   const [confirm, setConfirm] = useState({
      open: false,
      title: "",
      description: "",
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      onConfirm: null,
   });
   const [confirmBusy, setConfirmBusy] = useState(false);

   const openConfirm = (cfg) =>
      setConfirm({
         open: true,
         title: cfg.title ?? "Confirmar acción",
         description: cfg.description ?? "¿Deseas continuar?",
         confirmText: cfg.confirmText ?? "Confirmar",
         cancelText: cfg.cancelText ?? "Cancelar",
         onConfirm: cfg.onConfirm ?? null,
      });

   const closeConfirm = () => {
      if (confirmBusy) return;
      setConfirm((c) => ({ ...c, open: false, onConfirm: null }));
   };

   const runConfirm = async () => {
      if (!confirm.onConfirm) return;
      try {
         setConfirmBusy(true);
         await confirm.onConfirm();
         closeConfirm();
      } catch (err) {
         console.error(err);
         toast.error(err.message || "Ocurrió un error en la operación.");
      } finally {
         setConfirmBusy(false);
      }
   };

   const [anio, setAnio] = useState("");
   const [mes, setMes] = useState("");

   // Busqueda por trabajador
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredResultados, setFilteredResultados] = useState([]);

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

   // Filtramos en tiempo real por trabajador
   useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = resultados.filter((r) =>
      (r.trabajador || "").toLowerCase().includes(term)
    );
    setFilteredResultados(filtered);
  }, [searchTerm, resultados]);

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
      <>
         {/* MODAL DE CONFIRMACIÓN UNIFICADO */}
         <AlertDialog
            open={confirm.open}
            onOpenChange={(o) => (!o ? closeConfirm() : null)}
         >
            <AlertDialogContent>
               <AlertDialogHeader className="text-start">
                  <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
                  {confirm.description && (
                     <AlertDialogDescription>
                        {confirm.description}
                     </AlertDialogDescription>
                  )}
               </AlertDialogHeader>
               <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel
                     disabled={confirmBusy}
                     onClick={closeConfirm}
                  >
                     {confirm.cancelText}
                  </AlertDialogCancel>
                  <AlertDialogAction
                     disabled={confirmBusy}
                     className="bg-innova-blue"
                     onClick={runConfirm}
                  >
                     {confirmBusy ? (
                        <span className="flex items-center gap-2">
                           <Loader2 className="animate-spin h-4 w-4" />
                           Procesando...
                        </span>
                     ) : (
                        confirm.confirmText
                     )}
                  </AlertDialogAction>
               </div>
            </AlertDialogContent>
         </AlertDialog>

         {/* CONTENIDO */}
         <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
               Reportes Mensuales de Asitencia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <Label>Año</Label>
                  <Select onValueChange={setAnio} disabled={isLoading || confirmBusy}>
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
                  <Select onValueChange={setMes} disabled={isLoading || confirmBusy}>
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
               disabled={isLoading || confirmBusy}
               onClick={() => {
                  if (!anio || !mes) {
                     toast.warning("Selecciona año y mes antes de continuar.");
                     return;
                  }
                  openConfirm({
                     title: "Generar reportes informativos",
                     description: `Se generarán reportes informativos para el mes ${mes} del año ${anio}.`,
                     confirmText: "Generar",
                     onConfirm: async () => {
                        await generarReporte(anio, mes);
                     },
                  });
               }}
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

            {/* Barra de búsqueda de trabajador solo cuando hay resultados */}
            {resultados.length > 0 && (
               <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <Input
                        placeholder="Buscar trabajador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                     />
                  </div>
                  <div className="text-sm text-muted-foreground shrink-0">
                     {filteredResultados.length} de {resultados.length} reportes
                  </div>
               </div>
            )}

            {/* Acciones masivas + Tabla/Listado */}
            {resultados.length > 0 && (
               <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                     <h3 className="text-lg font-semibold">
                        Reportes generados
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:flex md:gap-2 w-full md:w-auto">
                        {/* DESCARGAR TODOS (ZIP) CON CONFIRMACIÓN */}
                        <Button
                           variant="outline"
                           size="sm"
                           className="w-full md:w-auto"
                           disabled={isLoading || confirmBusy}
                           onClick={() =>
                              openConfirm({
                                 title: "Descargar todos los PDFs",
                                 description: `Se descargarán ${resultados.length} archivos en un ZIP para ${mes}/${anio}.`,
                                 confirmText: "Descargar ZIP",
                                 onConfirm: async () => {
                                    const zip = new JSZip();
                                    for (const r of resultados) {
                                       const response = await fetch(r.url);
                                       if (!response.ok) continue;
                                       const blob = await response.blob();
                                       const nombre = r.trabajador
                                          .replace(/ /g, "_")
                                          .replace(/[^\w]/g, "");
                                       const archivoFinal = `${nombre}_${anio}-${mes}.pdf`;
                                       zip.file(archivoFinal, blob);
                                    }
                                    const content = await zip.generateAsync({
                                       type: "blob",
                                    });
                                    saveAs(
                                       content,
                                       `reportes_${mes}_${anio}.zip`
                                    );
                                    toast.success("ZIP generado y descargado.");
                                 },
                              })
                           }
                        >
                           Descargar todos
                        </Button>

                        {/* EMITIR TODOS (OFICIALES) CON CONFIRMACIÓN */}
                        <Button
                           variant="default"
                           size="sm"
                           className="w-full md:w-auto whitespace-normal md:whitespace-nowrap"
                           disabled={isLoading || confirmBusy}
                           onClick={() => {
                              if (!anio || !mes) {
                                 toast.warning(
                                    "Selecciona año y mes antes de emitir."
                                 );
                                 return;
                              }
                              openConfirm({
                                 title: "Emitir todos los reportes oficiales",
                                 description:
                                    "Esto generará hash y QR, guardará en base de datos y no permitirá re-emisión si ya existen.",
                                 confirmText: "Emitir oficiales",
                                 onConfirm: async () => {
                                    await emitirMasivo(anio, mes);
                                    toast.success(
                                       "Reportes oficiales emitidos."
                                    );
                                 },
                              });
                           }}
                        >
                           <Download className="h-4 w-4 mr-2" />
                           Emitir todos los reportes oficiales
                        </Button>
                     </div>
                  </div>

                  {/* Estado vacío del filtro */}
                  {filteredResultados.length === 0 && (
                     <div className="border rounded-md p-6 text-center text-muted-foreground">
                        No se encontraron reportes que coincidan con la búsqueda.
                     </div>
                  )}

                  {/* Desktop: tabla */}
                  {filteredResultados.length > 0 && (
                     <>
                        <div className="hidden md:block overflow-x-auto border rounded-md">
                           <table className="min-w-full text-sm">
                              <thead className="bg-zinc-100 dark:bg-zinc-800 text-left">
                                 <tr>
                                    <th className="p-2 w-1/3">Trabajador</th>
                                    <th className="p-2 w-1/2">Hash</th>
                                    <th className="p-2 w-1/6">Acciones</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {filteredResultados.map((r, idx) => (
                                    <tr
                                       key={idx}
                                       className="border-t border-zinc-200 dark:border-zinc-700"
                                    >
                                       <td className="p-2 font-medium">
                                          {r.trabajador}
                                       </td>
                                       <td className="p-2 text-xs font-mono">
                                          <div className="max-w-[520px] truncate">{r.hash}</div>
                                       </td>
                                       <td className="p-2">
                                          <div className="flex flex-nowrap gap-2 items-center">
                                             {/* PREVISUALIZAR */}
                                             <Tooltip>
                                                <TooltipTrigger asChild>
                                                   <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                         setPDFSeleccionado(r.url)
                                                      }
                                                   >
                                                      <Eye className="h-4 w-4" />
                                                   </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                   <span>Previsualizar PDF</span>
                                                </TooltipContent>
                                             </Tooltip>
                                             
                                             {/* Abrir en pestaña (solo móvil) */}
                                             <a href={r.url} target="_blank" rel="noopener noreferrer" className="md:hidden">
                                                <Button variant="outline" size="icon">
                                                   <ExternalLink className="h-4 w-4" />
                                                </Button>
                                             </a>

                                             {/* DESCARGA INDIVIDUAL CON CONFIRMACIÓN */}

                                             <Tooltip>
                                                <TooltipTrigger asChild>
                                                   <Button
                                                      variant="outline"
                                                      size="icon"
                                                      disabled={confirmBusy}
                                                      onClick={() =>
                                                         openConfirm({
                                                            title: "Descargar PDF",
                                                            description: `Se descargará el PDF de "${r.trabajador}" para ${mes}/${anio}.`,
                                                            confirmText: "Descargar",
                                                            onConfirm: async () => {
                                                               const nombre =
                                                                  r.trabajador
                                                                     .replace(
                                                                        / /g,
                                                                        "_"
                                                                     )
                                                                     .replace(
                                                                        /[^\w]/g,
                                                                        ""
                                                                     );
                                                               await descargarArchivo(
                                                                  r.url,
                                                                  `${nombre}_${anio}-${mes}.pdf`
                                                               );
                                                               toast.success(
                                                                  "PDF descargado."
                                                               );
                                                            },
                                                         })
                                                      }
                                                   >
                                                      <FileDown className="h-4 w-4" />
                                                   </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                   <span>Descargar PDF</span>
                                                </TooltipContent>
                                             </Tooltip>

                                             {/* EMITIR INDIVIDUAL CON CONFIRMACIÓN */}
                                             {r.yaEmitido ? (
                                                <span className="text-green-600 text-xs font-bold">
                                                   Emitido
                                                </span>
                                             ) : (
                                                <Button
                                                   variant="destructive"
                                                   size="sm"
                                                   disabled={isLoading || confirmBusy}
                                                   onClick={() =>
                                                      openConfirm({
                                                         title: "Emitir reporte oficial",
                                                         description:
                                                            "Se generará hash y QR y se guardará en base de datos. Si ya existe, no se reemitirá.",
                                                         confirmText:
                                                            "Emitir oficial",
                                                         onConfirm: async () => {
                                                            await emitirIndividual(
                                                               r,
                                                               anio,
                                                               mes
                                                            );
                                                            toast.success(
                                                               "Reporte oficial emitido."
                                                            );
                                                         },
                                                      })
                                                   }
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

                        {/* Mobile: tarjetas */}
                        <div className="md:hidden space-y-3">
                           {filteredResultados.map((r, idx) => (
                           <div key={idx} className="border rounded-md p-3 bg-white dark:bg-zinc-800">
                              <div className="font-semibold">{r.trabajador}</div>
                              <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 mt-1 break-all">
                                 {r.hash}
                              </div>

                              <div className="mt-3 grid grid-cols-3 gap-2">
                                 {/* Abrir en pestaña (móvil) */}
                                 <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="col-span-1"
                                 >
                                 <Button variant="outline" size="sm" className="w-full">
                                    <ExternalLink className="h-4 w-4 mr-1" /> Abrir
                                 </Button>
                                 </a>

                                 <Button
                                    variant="outline"
                                    size="sm"
                                    className="col-span-1"
                                    disabled={confirmBusy}
                                    onClick={() =>
                                       openConfirm({
                                          title: "Descargar PDF",
                                          description: `Se descargará el PDF de "${r.trabajador}".`,
                                          confirmText: "Descargar",
                                          onConfirm: async () => {
                                          const nombre = r.trabajador.replace(/ /g, "_").replace(/[^\w]/g, "");
                                          await descargarArchivo(r.url, `${nombre}_${anio}-${mes}.pdf`);
                                          toast.success("PDF descargado.");
                                          },
                                       })
                                    }
                                 >
                                    <FileDown className="h-4 w-4 mr-1" /> PDF
                                 </Button>

                                 {r.yaEmitido ? (
                                 <span className="self-center text-center text-green-600 text-xs font-bold">
                                    Emitido
                                 </span>
                                 ) : (
                                 <Button
                                    variant="destructive"
                                    size="sm"
                                    className="col-span-1"
                                    onClick={() =>
                                       openConfirm({
                                       title: "Emitir reporte oficial",
                                       description: "Se generará hash y QR y se guardará en base de datos.",
                                       confirmText: "Emitir",
                                       onConfirm: async () => {
                                          await emitirIndividual(r, anio, mes);
                                          toast.success("Reporte oficial emitido.");
                                       },
                                       })
                                    }
                                 >
                                    Emitir
                                 </Button>
                                 )}
                              </div>
                           </div>
                           ))}
                        </div>
                     </>
                     )}
                  </div>
               )}

               {/* Vista previa (SOLO DESKTOP). En móvil mostramos aviso + botón abrir */}
               {pdfSeleccionado && (
                  <>
                     {/* Desktop */}
                     <div className="hidden md:block mt-6 border rounded shadow bg-white dark:bg-zinc-800">
                        <h4 className="text-center py-2 font-semibold border-b dark:border-zinc-700">
                           Vista previa del PDF seleccionado
                        </h4>
                        <div className="w-full h-[70vh]">
                           <iframe
                              key={pdfSeleccionado}
                              src={pdfSeleccionado}
                              title="Vista previa del PDF"
                              className="w-full h-full"
                              style={{ border: "none" }}
                              loading="lazy"
                           />
                        </div>
                     </div>

                     {/* Móvil */}
                     <div className="md:hidden mt-4 border rounded p-4 bg-white dark:bg-zinc-800">
                        <div className="text-sm text-muted-foreground mb-3">
                           La previsualización de PDF no está disponible en dispositivos móviles.
                        </div>
                        <a href={pdfSeleccionado} target="_blank" rel="noopener noreferrer">
                           <Button className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Abrir PDF en una pestaña
                           </Button>
                        </a>
                     </div>
                  </>
               )}
            </div>
         </>
      );
   };

export default Reportes;
