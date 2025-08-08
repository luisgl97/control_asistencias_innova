import { ClipboardList, User, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const TareaDescipcion = ({ tarea, index }) => {

    return (
        <div key={index} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-slate-50/50">
            <div className="flex items-start justify-end">
                {/* <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                        {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Tarea {index + 1}</h3>
                </div> */}
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Numero de trabajadores: {tarea.trabajadores.length}
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                        <ClipboardList className="h-4 w-4" />
                        <span>Descripción</span>
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700">
                        {tarea.tarea_descripcion}
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Trabajadores Asignados</span>
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-slate-600">
                                <span>Nombre</span>
                                <span>DNI</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {tarea.trabajadores.map((trab, j) => (
                                <div key={j} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                                <User className="h-3 w-3 text-slate-500" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{trab.nombres}{" "}{trab.apellidos}</span>
                                        </div>
                                        <span className="text-slate-600 font-mono text-sm">{trab.dni}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TareaDescipcion