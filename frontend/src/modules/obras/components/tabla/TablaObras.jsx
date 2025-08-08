import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModalEliminarObra from "../modal/ModalEliminarObra";

const TablaObras = ({ searchTerm, filteredObras, fetchObras }) => {

    const navigate = useNavigate()


    return (
        <div className="md:px-20 px-3">
            <div className="rounded-md border ">
                <Table className={"rounded-md overflow-hidden shadow-xl"}>
                    <TableHeader className="bg-innova-blue">
                        <TableRow>
                            <TableHead className={"text-white"}>
                                Obra
                            </TableHead>
                            <TableHead className={"text-white"}>nombre</TableHead>
                            <TableHead className={"text-white"}>direccion</TableHead>
                            <TableHead className={"text-white"}>
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredObras.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    {searchTerm
                                        ? "No se encontraron obras que coincidan con la búsqueda"
                                        : "No hay obras registradas"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredObras.map((obra, index) => (

                                <TableRow key={obra.id} className={"hover:bg-innova-blue/10"}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {obra.nombre}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">
                                                {obra.direccion}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={"flex gap-3 "}>
                                        <Button
                                            variant="outline"
                                            size={"icon"}
                                            className="size-7"
                                            onClick={() =>
                                                navigate(
                                                    `/obras/registrar?id=${obra.id}`
                                                )
                                            }
                                        >
                                            <Edit className="size-3.5 text-innova-orange" />
                                        </Button>
                                        {/* <Button
                                                    variant="outline"
                                                    size={"icon"}
                                            className="size-7"
                                            onClick={() =>
                                                navigate(
                                                    `/registro-diario/registrar?id_registro_diario=${obra.id}`
                                                    )
                                                    }
                                                    >
                                                    <ListChecks className="size-3.5 text-green-500" />
                                                    </Button> */}
                                        <ModalEliminarObra
                                            id={obra.id}
                                            nombres={`${obra.nombre}`}
                                            cargarDatos={fetchObras}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TablaObras