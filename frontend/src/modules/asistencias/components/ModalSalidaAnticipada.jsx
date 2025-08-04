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
import { AlertCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import asistenciaService from "../service/asistenciaService";
import { fecha_hora_asistencia } from "../libs/fecha_hora_asistencia";
import { obtenerCoordenadas } from "../libs/obtenerCoordenadas";

const initForm = {
   autorizado_por: "",
   observacion: "",
};
export function ModalSalidaAnticipada({
   estado_ingreso,
   estado_salida,
   ubicacion,
   id,
   fetchVerificarAsistencia,
   estado_fin_refrigerio,
}) {
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
      setLoading(true);

      const { hora_a } = fecha_hora_asistencia();
      let posicion;
      try {
         posicion = await obtenerCoordenadas();
      } catch (error) {
         toast.error("No se pudo obtener la ubicación");
         setLoading(false);
         return;
      }
      const ubicacion_salida = {
         lat: posicion.lat,
         lng: posicion.lng,
         direccion: ubicacion.display_name,
      };
      let data = {
         ...form,
         asistencia_id: id,
         hora_salida: hora_a,
         ubicacion_salida,
      };
      try {
         setLoading(true);
         await asistenciaService.registrarSalidaAnticipada(data);
         fetchVerificarAsistencia();
         toast.success("Salida anticipada registrada");

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
            <Button
               className="bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 h-auto flex items-center justify-center gap-1 text-xs border border-gray-500"
               variant="outline"
               disabled={!estado_ingreso || estado_salida || !ubicacion}
            >
               <AlertCircle className="w-5 h-5" />
               <span className="text-sm">Salida Anticipada</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader className="text-start">
               <AlertDialogTitle>Salida Anticipada</AlertDialogTitle>
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
