import { useState } from "react";
import asistenciaService from "../service/asistenciaService";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ModalHorasExtras = ({ nombres, id, cargarDatos,hizo_horas_extras }) => {
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
         <AlertDialogTrigger asChild>
            <Button
               className="bg-green-50 text-green-700 border-green-200 cursor-pointer"
               variant="outline"
               disabled={hizo_horas_extras}
            >
               <span className="text-xs">Horas Extras</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle> Habilitar horas extras </AlertDialogTitle>
            </AlertDialogHeader>
            <div>
               Haga click en Aceptar para habiliar horas extras al trabajador{" "}
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
