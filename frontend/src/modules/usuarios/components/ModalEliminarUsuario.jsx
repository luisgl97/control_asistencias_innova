import { Loader2, Trash2, UserX } from "lucide-react";
import usuarioService from "../services/usuarioService";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ModalEliminarUsuario = ({ id, nombres, cargarDatos }) => {
   const [open, setOpen] = useState(false);
   const [isLoading, setLoading] = useState(false);
   const handleClose = () => {
      setOpen(false);
   };
   const handleClick = async () => {
      try {
         setLoading(true);
         const res=await usuarioService.eliminar(id);            
         await cargarDatos();
         toast.success("Usuario desactivado");
         handleClose();
      } catch (error) {
         console.log(error);
         
         toast.error("Hubo un error");
      } finally {
         setLoading(false);
      }
   };
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button variant="outline" size={"icon"} className="size-7">
               <UserX className="size-3.5 text-red-500" />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle> Deshabilitar Trabajador</AlertDialogTitle>
            </AlertDialogHeader>
            <div>
               ¿Esta seguro que quiere Deshabilitar al trabajador,
               <span className="font-semibold">"{nombres}"</span>?
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
export default ModalEliminarUsuario;
