import { useState } from "react";
import asistenciaService from "../service/asistenciaService";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

const ModalHorasExtras = ({ nombres, id, cargarDatos, hizo_horas_extras }) => {
   const [open, setOpen] = useState(false);
   const [isLoading, setLoading] = useState(false);
   const handleClose = () => {
      setOpen(false);
   };
   const handleClick = async () => {
      try {
         setLoading(true);
         await asistenciaService.habilitarHorasExtras({ asistencia_id: id });
         await cargarDatos();
         toast.success("Horas extras Habilitadas");
         handleClose();
      } catch (error) {
         toast.error("Error en la Habilitación");
      } finally {
         setLoading(false);
      }
   };
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <Tooltip>
            <AlertDialogTrigger asChild>
               <TooltipTrigger asChild>
                  <Button
                     className="bg-green-50 text-green-700 hover:text-green-500 border-green-200 cursor-pointer"
                     variant="outline"
                     disabled={hizo_horas_extras}
                     size={"icon"}
                  >
                     <CalendarClock />
                  </Button>
               </TooltipTrigger>
            </AlertDialogTrigger>
            <TooltipContent>
               <p>Activar horas extras</p>
            </TooltipContent>
         </Tooltip>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle> Habilitar horas extras </AlertDialogTitle>
            </AlertDialogHeader>
            <div>
               Haga click en Aceptar para habilitar horas extras a{" "}
               <span className="font-semibold">"{nombres}"</span>
            </div>

            <article className="flex-1 flex justify-end gap-4">
               <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleClose}
               >
                  Cancelar
               </Button>
               <Button
                  className="bg-innova-blue"
                  disabled={isLoading}
                  onClick={handleClick}
               >
                  {isLoading ? (
                     <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                     </span>
                  ) : (
                     "Aceptar"
                  )}
               </Button>
            </article>
         </AlertDialogContent>
      </AlertDialog>
   );
};
export default ModalHorasExtras;
