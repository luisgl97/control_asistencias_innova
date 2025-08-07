import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Edit, HousePlus, ListChecks, Trash } from "lucide-react";
import ModalEliminarObra from "../components/ModalEliminarObra";
import TablaObras from "../components/TablaObras";
import ListaTareasDiario from "../components/ListaTareasDiario";

const ListarObras = () => {
    const [obras, setObras] = useState([
        {
            id: 1,
            nombre: "Obra 1",
            direccion: "Calle 123",

        },
        {
            id: 2,
            nombre: "Obra 2",
            direccion: "Calle 456",

        }
    ])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredObras, setFilteredObras] = useState([
        {
            id: 1,
            nombre: "Obra 1",
            direccion: "Calle 123",

        },
        {
            id: 2,
            nombre: "Obra 2",
            direccion: "Calle 456dwadawdwdadwawaddwadwa wddwa",

        }
    ])
    const navigate = useNavigate()

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 mt-2">
            <Card className="shadow-none outline-none border-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Listado de Obras
                            </CardTitle>
                            <CardDescription>
                                Administra las obras del sistema ( 4
                                obras registrados
                                )
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

                {/* Tabla de obras */}
                <TablaObras
                    searchTerm={searchTerm}
                    filteredObras={filteredObras}
                    obras={obras}
                />

            </Card>
        </div>
    )
}

export default ListarObras