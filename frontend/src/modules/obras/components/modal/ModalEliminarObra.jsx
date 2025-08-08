import { Loader2, Trash2 } from "lucide-react";
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
import obraService from "../../services/obraService";

const ModalEliminarObra = ({ id, nombres, cargarDatos }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = async () => {
        try {
            setLoading(true);
            const { data, status } = await obraService.eliminar(id);
            if (status == 200 && data.estado) {
                await cargarDatos();
                toast.success(data.mensaje);
                handleClose();
            }
        } catch (error) {
            toast.error("Hubo un error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size={"icon"} className="size-7">
                    <Trash2 className="size-3.5 text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="text-start">
                    <AlertDialogTitle> Eliminar Obra</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                    ¿Esta seguro que quiere eliminar la obra,
                    <span className="font-semibold">"{nombres}"</span>?
                </div>

                <article className="flex-1 flex justify-end gap-4">
                    <Button
                        variant="outline cursor-pointer"
                        disabled={isLoading}
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-innova-blue cursor-pointer"
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
export default ModalEliminarObra;
