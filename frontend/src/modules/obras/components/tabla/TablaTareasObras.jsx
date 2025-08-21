import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Building2,
   Calendar,
   ChevronDown,
   ChevronRight,
   Copy,
   Edit3,
   Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TareaDescipcion from "../TareaDescipcion";
import ModalEliminarRegistroDiario from "../modal/ModalEliminarRegistroDiario";

const TablaTareasObras = ({ tareas, copyToClipboard,fetchListaTareasDiario }) => {
   const [expandedIndex, setExpandedIndex] = useState(null);
   const navigate = useNavigate();

   const toggleExpand = (index) => {
      setExpandedIndex((prev) => (prev === index ? null : index));
   };

   const toLocalDateOnly = (yyyyMmDd) => {
      const [y, m, d] = yyyyMmDd.split("-").map(Number);
      return new Date(y, m - 1, d); // Local midnight
   };

   const isTodayOrFuture = (yyyyMmDd) => {
      const task = toLocalDateOnly(yyyyMmDd);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return task >= today;
   };


   return (
      <div className="px-2 sm:px-4 md:px-6 bg-gradient-to-br">
         <div className="space-y-3 sm:space-y-4">
            {tareas.map((tarea, index) => (
               <div
                  key={index}
                  className="bg-[#1b274a] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
               >
                  <CardHeader className="text-white p-3 sm:p-4">
                     {/* Header: en móvil apila; en md distribuye */}
                     <div className="flex flex-row justify-between  sm:gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Info izquierda */}
                        <div className="flex items-center md:items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                           <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg shrink-0">
                              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                           </div>

                           <div className="min-w-0">
                              <CardTitle className="text-base sm:text-lg font-semibold truncate">
                                 {tarea.obra?.nombre}
                              </CardTitle>

                              {/* Meta en varias filas en móvil */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 sm:mt-2 text-blue-100">
                                 <div className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                       {tarea.dia}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                                    <Users className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                       {tarea.nro_trabajadores_asignados}{" "}
                                       trabajadores
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-row items-center justify-end gap-1.5 sm:gap-2">
                           <ModalEliminarRegistroDiario
                              fecha={tarea.dia}
                              id={tarea.obra.id}
                              nombre={tarea.obra.nombre}
                              fetchListaTareasDiario={fetchListaTareasDiario}
                           />

                           <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 h-9 w-9 sm:h-8 sm:w-8"
                              onClick={() =>
                                 copyToClipboard(tarea, index, "uno")
                              }
                              aria-label="Copiar información"
                              title="Copiar información"
                           >
                              <Copy className="h-4 w-4" />
                           </Button>

                           {isTodayOrFuture(tarea.dia) && (
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="text-white hover:bg-white/20 h-9 w-9 sm:h-8 sm:w-8 mr-2 md:mr-8"
                                 onClick={() =>
                                    navigate(
                                       `/registro-diario/registrar?id_registro_diario=${tarea.obra.id}&dia=${tarea.dia}`
                                    )
                                 }
                                 aria-label="Editar registro"
                                 title="Editar registro"
                              >
                                 <Edit3 className="h-4 w-4" />
                              </Button>
                           )}

                           <Button
                              onClick={() => toggleExpand(index)}
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 h-9 w-9 sm:h-8 sm:w-8 transition-all duration-200"
                              aria-label={
                                 expandedIndex === index
                                    ? "Contraer"
                                    : "Expandir"
                              }
                              title={
                                 expandedIndex === index
                                    ? "Contraer"
                                    : "Expandir"
                              }
                           >
                              {expandedIndex === index ? (
                                 <ChevronDown className="h-5 w-5" />
                              ) : (
                                 <ChevronRight className="h-5 w-5" />
                              )}
                           </Button>
                        </div>
                     </div>
                  </CardHeader>

                  {expandedIndex === index && (
                     <CardContent className="bg-white p-3 sm:p-4 md:p-5 border-x-2 border-b-2 border-gray-500 rounded-b-lg">
                        <TareaDescipcion index={index} tarea={tarea} />
                     </CardContent>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default TablaTareasObras;
