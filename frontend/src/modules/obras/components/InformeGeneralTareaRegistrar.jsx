import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Calendar } from 'lucide-react'

const InformeGeneralTareaRegistrar = ({ obras, obraSeleccionada, setObraSeleccionada, fecha, setFecha }) => {
    return (
        <Card className="flex flex-col gap-4 w-full shadow-lg  border-2 border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-slate-700">
                <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Información General</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex  gap-6 w-full">
                    <div className="space-y-2 w-4/12">
                        <Label htmlFor="fecha" className="text-slate-700 font-medium">Fecha de la Tarea</Label>
                        <Input
                            id="fecha"
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="border-slate-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2 w-8/12">
                        <Label htmlFor="obra" className="text-slate-700 font-medium">Seleccionar Obra</Label>
                        <Select value={obraSeleccionada} onValueChange={setObraSeleccionada} className="w-full">
                            <SelectTrigger className="border-slate-300 focus:border-blue-500 w-full">
                                <SelectValue placeholder="Selecciona una obra" />
                            </SelectTrigger>
                            <SelectContent>
                                {obras.map((obra) => (
                                    <SelectItem key={obra.id} value={obra.id.toString()} className="w-full">
                                        <div className="flex items-center space-x-2 w-full">
                                            <Building2 className="h-4 w-4" />
                                            <span className="flex-1">{obra.nombre}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>)
}

export default InformeGeneralTareaRegistrar