import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SelectConEtiquetaFlotante from "@/shared/components/selectConEtiquetaFlotante";
import { Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import asistenciaService from "../service/asistenciaService";
import { Badge } from "@/components/ui/badge";

export function ModalJustificarFalta({ fecha_dia, id,cargarDatos }) {
   const initForm = {
      observacion: "",
      fecha: fecha_dia,
      usuario_id: id,
   };
   const [open, setOpen] = useState(false);
   const [isLoading, setLoading] = useState(false);
   const [form, setForm] = useState({ ...initForm });

   const handleChange = (e) => {
      setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
   };
   const handleClose = () => {
      setForm({ ...initForm });
      setOpen(false);
   };
   const handleClick = async () => {
      try {
         setLoading(true);
         console.log(form);
         await asistenciaService.registrarFalta(form);
         await cargarDatos()
         toast.success("Falta Justificada registrada");
         handleClose();
      } catch (error) {
         toast.error("El registro a fallado");
      } finally {
         setLoading(false);
      }
   };
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Badge
               className="bg-red-50 text-red-700 border-red-200 cursor-pointer"
               variant="outline"
            >
               <span className="text-xs">SIN REGISTRO</span>
            </Badge>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle>Falta Justificada</AlertDialogTitle>
            </AlertDialogHeader>
            <article className="space-y-4">
               <Textarea
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  placeholder="Ingrese el motivo de la falta"
                  className="p-2 min-h-24"
               />
            </article>
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
}
