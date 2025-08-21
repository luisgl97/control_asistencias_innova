import { Input } from "@/components/ui/input";
import { Calendar, Clipboard, Copy, Frown } from "lucide-react";
import { Calendar22 } from "./ui/Calendar22";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import obraService from "../services/obraService";
import TablaTareasObras from "./tabla/TablaTareasObras";
import { Button } from "@/components/ui/button";

const ListaTareasDiario = () => {
    const [fechaFiltro, setFechaFiltro] = useState(new Date());
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchListaTareasDiario = async () => {
        setLoading(true);
        const dataForm = {
            fecha: fechaFiltro,
        };
        try {
            const { data, status } = await obraService.listarRegistrosDiarios(
                dataForm
            );
            if (status === 200) {
                setTareas(data.datos);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListaTareasDiario();
    }, [fechaFiltro]);

    const copyToClipboard = async (tarea, index, tipo) => {
        let text;
        if (tipo == "uno") {
            text = [
                `Obra: ${tarea?.obra?.nombre ?? "—"}`,
                `Fecha: ${tarea?.fecha ?? tarea?.dia ?? "—"}`,
                `Descripción: ${tarea?.descripcion ?? tarea?.tarea_descripcion ?? "—"}`,
                `Trabajadores:
${tarea?.trabajadores
                    ?.map(
                        (trabajador) =>
                            `${trabajador?.nombres} ${trabajador?.apellidos} - ${trabajador?.cargo}`
                    )
                    .join(",\n") ?? "—"
                }`,
            ].join("\n");
        }
        if (tipo == "todo") {
            // Build an array of strings, one for each task
            const tasksToCopy = tarea.map((t) => {
                return [
                    `Obra: ${t?.obra?.nombre ?? "—"}`,
                    `Fecha: ${t?.fecha ?? t?.dia ?? "—"}`,
                    `Descripción: ${t?.descripcion ?? t?.tarea_descripcion ?? "—"}`,
                    `Trabajadores Asignados:
${t?.trabajadores
                        ?.map(
                            (trabajador) =>
                                `${trabajador?.nombres} ${trabajador?.apellidos} - ${trabajador?.cargo}`
                        )
                        .join(",\n") ?? "—"
                    }`,
                ].join("\n");
            });
            // Join all the task strings with a separator (e.g., a few newlines)
            text = tasksToCopy.join("\n\n---\n\n");
        }

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback: crea un textarea temporal
            const el = document.createElement("textarea");
            el.value = text;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }

        // Feedback visual (cambia el icono por 1.5s)
        // setCopiedIndex(index);
        // setTimeout(() => setCopiedIndex(null), 1500);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap w-full px-2 py-4 items-center justify-between md:flex-nowrap ">
                <div className="flex w-full md:w-auto md:flex-initial p-1">
                    <Label className="mr-4 text-lg font-semibold">
                        Fecha de la Tarea:
                    </Label>
                    <Calendar22
                        value={fechaFiltro}
                        onChange={setFechaFiltro}
                        blockPast={false}
                    />
                </div>
                <div className="flex w-full md:w-auto  mt-2 p-1 md:mt-0  gap-x-3">
                    {tareas.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white bg-gray-800 hover:bg-gray-600 hover:text-white/80 cursor-pointer w-auto px-2 md:px-3 flex"
                            onClick={() => copyToClipboard(tareas, 1, "todo")}
                            aria-label="Copiar información"
                            title="Copiar información"
                        >
                            <span >Copiar Información</span>
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="flex items-center justify-center md:justify-end w-full md:w-auto md:flex-initial md:ml-auto md:mt-0">
                        <span className="text-md  font-semibold ">
                            Total de Registros: {tareas.length}
                        </span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 py-4 text-sm px-20">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
            ) : tareas.length > 0 ? (
                <TablaTareasObras tareas={tareas} copyToClipboard={copyToClipboard} fetchListaTareasDiario={fetchListaTareasDiario}/>
            ) : (
                <div className="flex flex-col items-center text-gray-600 py-16">
                    <Frown className="w-12 h-12" />
                    <p className="text-lg font-semibold text-gray-700">
                        No se encontraron tareas para esta fecha
                    </p>
                </div>
            )}
        </div>
    );
};

export default ListaTareasDiario;
