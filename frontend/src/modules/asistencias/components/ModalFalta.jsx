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

const initForm = {
   autorizado_por: "",
   observacion: "",
};
export function ModalFalta() {
   const [open, setOpen] = useState(false);
   const [isLoading, setLoading] = useState(false);
   const [form, setForm] = useState({ ...initForm });
   const opciones_autorizaciones = [
      { value: "1", label: "Genaro" },
      { value: "2", label: "Julio" },
      { value: "3", label: "Pilar" },
   ];
   const handleChange = (e) => {
      setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
   };
   const handleClose = () => {
      setForm({ ...initForm });
      setOpen(false);
   };
   const handleClick = async () => {
      const fecha = new Intl.DateTimeFormat("es-PE", {
         timeZone: "America/Lima",
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
      }).format(new Date());
      const [dia, mes, anio] = fecha.split("/");
      const fechaFormateada = `${anio}-${mes}-${dia}`;
      let data = {
         ...form,
         fecha: fechaFormateada,
      };
      try {
        setLoading(true)
        console.log(data);
        const res=await asistenciaService.registrarFalta(data);
        console.log(res);
        
        toast.success("Falta registrada")
      } catch (error) {
        toast.error("El registro a fallado")
      }finally{
        setLoading(false)
      }
   };
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button
               //    disabled={status.estadoIngreso || !ubicacion}
               className="bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 h-auto flex flex-col items-center gap-1 text-xs border border-gray-500"
               variant="outline"
            >
               <XCircle className="w-5 h-5" />
               <span className="text-sm">Falta Justificada</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle>Falta Justificada</AlertDialogTitle>
               <AlertDialogDescription>
                  Ingrese los datos correctamente
               </AlertDialogDescription>
            </AlertDialogHeader>
            <article className="space-y-4">
               <SelectConEtiquetaFlotante
                  value={form.autorizado_por}
                  onChange={(name, value) =>
                     setForm({ ...form, [name]: value })
                  }
                  name="autorizado_por"
                  label="Seleccione quien autorizo el permiso"
                  opciones={opciones_autorizaciones}
               />
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
