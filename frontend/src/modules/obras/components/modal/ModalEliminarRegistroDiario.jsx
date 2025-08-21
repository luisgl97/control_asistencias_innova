import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import obraService from "../../services/obraService";

const ModalEliminarRegistroDiario = ({
   nombre,
   fecha,
   id,
   fetchListaTareasDiario,
}) => {
   const [open, setOpen] = useState(false);

   const handleDelete =async () => {
      try {
         const payLoad = {
            fecha: fecha,
            obra_id: id,
         };
        
         const res=await obraService.eliminarRegistroDiario(payLoad);
         
         await fetchListaTareasDiario()
         setOpen(false);
         toast.success("Registro eliminado exitosamente");
      } catch (error) {
        
        if(error?.response?.data?.mensaje){
            toast.error(error?.response?.data?.mensaje);
        }else{
            toast.error("No se pudo eliminar el registro");
        }
         
      }
   };

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant="ghost"
               size="icon"
               aria-label="Eliminar registro"
               title="Eliminar registro"
               className="text-white cursor-pointer hover:bg-white/20 hover:text-white h-9 w-9 sm:h-8 sm:w-8"
            >
               <Trash className="size-4.5"/>
            </Button>
         </AlertDialogTrigger>

         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Eliminar registro diario</AlertDialogTitle>
               <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará de forma
                  permanente el registro de la obra <strong>"{nombre}"</strong> correspondiente
                  a la fecha <strong>{fecha}</strong>.
               </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-6 flex justify-end gap-4">
               <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
               </Button>
               <Button variant="destructive" onClick={handleDelete}>
                  Eliminar
               </Button>
            </div>
         </AlertDialogContent>
      </AlertDialog>
   );
};
export default ModalEliminarRegistroDiario;
