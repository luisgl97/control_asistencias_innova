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
import {
   AlarmClockPlus,
   Loader2,
   Notebook,
   NotebookPen,
   XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import asistenciaService from "../service/asistenciaService";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModalJustificarPermiso({
   fecha_dia,
   id,
   cargarDatos,
   tipo,
   asistencia_id = null,
}) {
   const { user } = useAuth();

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
      const payLoad = { ...form };
      if (tipo === "TARDANZA" && asistencia_id) {
         payLoad.asistencia_id = asistencia_id;
         console.log(payLoad);
      }
      console.log(payLoad);
      
      try {
         setLoading(true);
         if (tipo === "FALTA") {
            await asistenciaService.registrarFalta(payLoad);
            toast.success("Falta Justificada registrada");
         } else if (tipo === "TARDANZA") {
            const res=await asistenciaService.registrarTardanzaJustificada(payLoad);
            console.log(res);
            toast.success("Tardanza Justificada registrada");
         } else {
            toast.warning("El tipo de permiso no existe");
            return;
         }
         await cargarDatos();
         handleClose();
      } catch (error) {
         toast.error("El registro a fallado");
      } finally {
         setLoading(false);
      }
   };
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <Tooltip>
            <TooltipTrigger asChild>
               <AlertDialogTrigger asChild>
                  <Button
                     className=" text-gray-500 border-gray-300 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200   cursor-pointer text-xs px-1.5 py-0.5"
                     variant="outline"
                     disabled={user.rol === "LIDER TRABAJADOR"}
                     size={"icon"}
                  >
                     {tipo === "TARDANZA" && <AlarmClockPlus />}
                     {tipo === "FALTA" && <NotebookPen />}
                  </Button>
               </AlertDialogTrigger>
            </TooltipTrigger>
            {tipo === "FALTA" && (
               <TooltipContent>Justificar Falta</TooltipContent>
            )}
            {tipo === "TARDANZA" && (
               <TooltipContent>Justificar Tardanza</TooltipContent>
            )}
         </Tooltip>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               {tipo === "FALTA" && (
                  <AlertDialogTitle>Falta Justificada</AlertDialogTitle>
               )}
               {tipo === "TARDANZA" && (
                  <AlertDialogTitle>Tardanza Justificada</AlertDialogTitle>
               )}
            </AlertDialogHeader>
            <article className="space-y-4">
               <Textarea
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  placeholder={`Ingrese el motivo de la ${
                     tipo === "FALTA" ? "falta" : "tardanza"
                  }`}
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
