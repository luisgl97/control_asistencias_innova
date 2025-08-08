import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Calendar22 } from "./ui/Calendar22";
import ObraAutocomplete from "./ObraAutocomplete";

const InformeGeneralTareaRegistrar = ({
    obras,
    obraSeleccionada,
    setObraSeleccionada,
    fecha,
    setFecha,
    obrasRegistradas,
    obraObtenida,
}) => {
    return (
        <Card className="flex flex-col gap-4 w-full shadow-lg border-2 border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-slate-700">
                <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Información General</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    {/* Fecha */}
                    <div className="space-y-2 w-full md:w-4/12">
                        <Label htmlFor="fecha" className="text-slate-700 font-medium">
                            Fecha de la Tarea
                        </Label>

                        {obraObtenida.dia ? (
                            <Input
                                id="fecha"
                                type="date"
                                value={obraObtenida.dia}
                                disabled
                                className="border-slate-300 focus:border-blue-500"
                            />
                        ) : (
                            <Calendar22
                                value={fecha}
                                onChange={(d) => {
                                    const y = d.getFullYear();
                                    const m = String(d.getMonth() + 1).padStart(2, "0");
                                    const dd = String(d.getDate()).padStart(2, "0");
                                    setFecha(`${y}-${m}-${dd}`);
                                }}
                                blockPast={true}
                            />
                        )}
                    </div>

                    {/* Obra con escribir + sugerencias */}
                    <div className="space-y-2 w-full md:w-8/12">
                        <Label htmlFor="obra" className="text-slate-700 font-medium">
                            Seleccionar / Escribir Obra
                        </Label>

                        {obraObtenida.obra ? (
                            <Input
                                id="obra"
                                type="text"
                                value={obraObtenida.obra.nombre}
                                disabled
                                className="border-slate-300 focus:border-blue-500"
                            />
                        ) : (
                            <ObraAutocomplete
                                obras={obras}
                                obrasRegistradas={obrasRegistradas}
                                value={obraSeleccionada}
                                onChange={setObraSeleccionada}
                            />
                        )}

                        {/* TIP opcional: si usas "new:<texto>" arriba, puedes mostrarlo aquí */}
                        {String(obraSeleccionada).startsWith("new:") && (
                            <p className="text-xs text-slate-500">
                                Nueva obra: <strong>{String(obraSeleccionada).slice(4)}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InformeGeneralTareaRegistrar;
