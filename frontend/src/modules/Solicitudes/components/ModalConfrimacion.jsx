import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export function ConfirmationModal({
  equipos = 0,
  editingSolicitud,
  handleSubmit,
  mensaje_edit
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
    const[mensaje,setMensaje]=useState(mensaje_edit||"");

  const handleClick = async () => {
    setLoading(true);
    await handleSubmit(mensaje);
    setLoading(false);
    setOpen(false);
    setMensaje("")
  };

  const handleClose=()=>{
    setMensaje("")
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-700 hover:bg-green-600">
          {editingSolicitud ? "Guardar cambios" : "Registrar"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Solicitud</AlertDialogTitle>
          <AlertDialogDescription>
            Confirmar la solicitud de {equipos} equipo(s)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-w-full ">
          <Textarea
            value={mensaje}
            placeholder="Ingrese un mensaje (Opcional)"
            className="w-full resize-none overflow-auto break-all"
            onChange={(e)=>setMensaje(e.target.value)
            }
          />
        </div>

        <AlertDialogFooter className="flex gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleClick}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
