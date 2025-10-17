
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

export function ConfirmationModal({ equipos=0, editingSolicitud, handleSubmit }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
    setOpen(false);
  };
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
            Deseas confirmar la solicitud de {equipos} equipo(s)?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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
