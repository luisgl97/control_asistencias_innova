import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardList, Plus, Trash2, User, UserMinus, Users } from 'lucide-react'
const TareaRegistroDetallado = ({
    tareas,
    agregarTarea,
    eliminarTarea,
    removerTrabajador,
    actualizarDescripcionTarea

}) => {
    return (
        <div className="hadow-lg w-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <Card className="shadow-lg border-0  bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-slate-700 ">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                            <ClipboardList className="h-5 w-5" />
                            {/* <span>Tareas Asignadas</span> */}
                            <span>Detalle de Funciones</span>
                        </CardTitle>
                        {/* <Button
                            onClick={agregarTarea}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 border-1 cursor-pointer border-green-600"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar Tarea
                        </Button> */}
                    </div>
                </CardHeader>
                <CardContent className=" space-y-6">
                    {tareas.map((tarea, index) => (
                        <div key={tarea.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                            <div className="flex items-start justify-between ">
                                {/* <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Tarea {index + 1}</h3>
                                </div> */}
                                {tareas.length > 1 && (
                                    <Button
                                        onClick={() => eliminarTarea(tarea.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    {/* <Label className="text-slate-700 font-medium">Descripción de la Tarea</Label> */}
                                    <Label className="text-slate-700 font-medium">Descripción detallada</Label>
                                    <Textarea
                                        value={tarea.descripcion}
                                        onChange={(e) => actualizarDescripcionTarea(tarea.id, e.target.value)}
                                        placeholder="Describe la tarea a realizar..."
                                        className="mt-2 border-slate-300 focus:border-green-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label className="text-slate-700 font-medium flex items-center space-x-2 mb-3">
                                        <Users className="h-4 w-4" />
                                        <span>Trabajadores Asignados ({tarea.trabajadores.length})</span>
                                    </Label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {tarea.trabajadores.length === 0 ? (
                                            <div className="text-center py-8 text-slate-500">
                                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>No hay trabajadores asignados</p>
                                                <p className="text-sm">Selecciona trabajadores de la lista</p>
                                            </div>
                                        ) : (
                                            tarea.trabajadores.map((trabajador) => (
                                                <div key={trabajador.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                            <User className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{trabajador.nombres} {trabajador.apellidos}</p>
                                                            <p className="text-sm text-slate-500">{trabajador.cargo} • DNI: {trabajador.dni}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => removerTrabajador(tarea.id, trabajador.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <UserMinus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>)
}

export default TareaRegistroDetallado