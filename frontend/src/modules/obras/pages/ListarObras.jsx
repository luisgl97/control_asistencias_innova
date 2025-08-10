import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { HousePlus, Search, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import obraService from "../services/obraService";
import { Input } from "@/components/ui/input";
import TablaObras from "../components/tabla/TablaObras";

const ListarObras = () => {
    const [obras, setObras] = useState([])
    const [totalObras, setTotalObras] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredObras, setFilteredObras] = useState([])

    const fetchObras = async () => {
        setLoading(true);
        try {
            const { data, status } = await obraService.listarObras();
            if (status === 200) {
                setTotalObras(data.datos.filter(obra => obra.estado !== false).length);
                setObras(data.datos.filter(obra => obra.estado !== false));
                setFilteredObras(data.datos);
            } else {
                toast.error(data.mensaje);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObras();
    }, []);

    useEffect(() => {
        const filtered = obras.filter(
            (obra) =>
                obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obra.direccion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredObras(filtered);
    }, [searchTerm, obras]);

    const navigate = useNavigate()

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 mt-2">
            <Card className="shadow-none outline-none border-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl md:text-2xl font-bold">
                                Listado de Obras
                            </CardTitle>
                            <CardDescription className={"text-xs md:text-sm flex flex-col md:flex-row "}>
                                Administra las obras del sistema 
                                <span>( {totalObras} obras registradas )</span>
                            </CardDescription>
                        </div>
                        <Button
                            className="gap-2 bg-innova-blue hover:bg-innova-blue/90"
                            onClick={() => navigate("/obras/registrar")}
                        >
                            <HousePlus className="h-4 w-4" />
                            Nueva Obra
                        </Button>
                    </div>
                </CardHeader>

                {
                    loading ? (
                        <div className="grid gap-4 py-4 text-sm px-4 md:px-20">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 mb-6 px-3 ">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Buscar obras..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {filteredObras.length} de {obras.length} obras
                                </div>
                            </div>
                            <TablaObras
                                searchTerm={searchTerm}
                                filteredObras={filteredObras}
                                fetchObras={fetchObras}
                            />
                        </div>
                    )
                }

            </Card>
        </div>
    )
}

export default ListarObras