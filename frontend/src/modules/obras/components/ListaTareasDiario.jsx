import { Input } from "@/components/ui/input";
import { Calendar, Frown } from "lucide-react";
import { Calendar22 } from "./ui/Calendar22";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import obraService from "../services/obraService";
import TablaTareasObras from "./tabla/TablaTareasObras";

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
            const { data, status } = await obraService.listarRegistrosDiarios(dataForm);
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

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap w-full px-6 py-4 items-center md:flex-nowrap">
                <div className="flex w-full md:w-auto md:flex-initial">
                    <Label className="mr-4 text-lg font-semibold">Fecha de la Tarea:</Label>
                    <Calendar22
                        value={fechaFiltro}
                        onChange={setFechaFiltro}
                        blockPast={false}
                    />
                </div>
                <div className="flex items-center justify-end w-full md:w-auto md:flex-initial md:ml-auto md:mt-0 mt-4">
                    <span className="text-sm font-semibold">
                        Total de Registros: {tareas.length}
                    </span>
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
                <TablaTareasObras tareas={tareas} />
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
