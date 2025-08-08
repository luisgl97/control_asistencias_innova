import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, UserPlus, Users } from 'lucide-react'

const TrabajadoresRegistrarTarea = ({ trabajadores, trabajadoresFiltrados, textFiltroTrabajador, handlerFiltro, tareas, asignarTrabajador }) => {
    return (
        <div className=" shadow-lg w-full border-0 flex flex-col  rounded-xl">
            <div className="shadow-lg border-2  backdrop-blur-sm py-6 rounded-xl">
                <CardHeader className="text-slate-700 py-2">
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Trabajadores </span>
                    </CardTitle>

                </CardHeader>
                <input
                    type="search"
                    placeholder="Buscar trabajador"
                    className=" border-2 mx-7 rounded-lg p-2 "
                    value={textFiltroTrabajador}
                    onChange={handlerFiltro}
                />
                <CardContent className="p-5">
                    <p className="text-gray-600 text-md mt-1 ml-4">
                        {trabajadores.length} trabajadores
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                        {trabajadoresFiltrados.map((trabajador) => (
                            <div key={trabajador.id} className="border-2 border-slate-200 rounded-lg p-3 hover:border-purple-300 transition-colors bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="font-medium text-slate-800 truncate">{trabajador.nombres} {trabajador.apellidos}</p>
                                            <p className="text-sm text-slate-500 truncate">{trabajador.cargo}</p>
                                            <p className="text-xs text-slate-400">DNI: {trabajador.dni}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-slate-600 mb-2">Asignar a tarea:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {tareas.map((tarea, index) => (
                                            <Button
                                                key={tarea.id}
                                                onClick={() => asignarTrabajador(tarea.id, trabajador)}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7 px-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                                                disabled={!tarea.descripcion.trim()}
                                            >
                                                <UserPlus className="h-3 w-3 mr-1" />
                                                asignar
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </CardContent>
            </div>
        </div>)
}

export default TrabajadoresRegistrarTarea