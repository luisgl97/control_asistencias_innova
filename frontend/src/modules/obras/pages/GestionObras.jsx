import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListaTareasDiario from "../components/ListaTareasDiario";

const GestionObras = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 mt-2">
            <Card className="shadow-none outline-none border-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Registro diario de Tareas en Obras
                            </CardTitle>
                        </div>
                        <Button
                            className="gap-2 bg-innova-blue hover:bg-innova-blue/90"
                            onClick={() => navigate("/registro-diario/registrar")}
                        >
                            <ListTodo className="h-4 w-4" />
                            Nueva Tarea
                        </Button>
                    </div>
                </CardHeader>
            
                <ListaTareasDiario />

            </Card>
        </div>
    )
}

export default GestionObras