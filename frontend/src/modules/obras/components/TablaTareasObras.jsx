import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Users, Calendar, Building2, ClipboardList, Edit3, User } from 'lucide-react'
import React, { useState } from "react"

const tareas = [
    {
        obra: {
            nombre: "PROYECTO PALMERA DEL SUR",
        },
        dia: "07-08-2025",
        nro_tarea: 2,
        nro_trabajadores_asignados: 6,
        tareas: [
            {
                descripcion: "Se colocarán 6 andamios",
                trabajadores: [
                    { nombre: "Pepito Perez", dni: "75756507" },
                    { nombre: "Luisa Lopez", dni: "75756407" },
                    { nombre: "Maria Gomez", dni: "75756327" },
                ],
            },
            {
                descripcion: "Se montará 1 ascensor",
                trabajadores: [
                    { nombre: "Pepito Perez", dni: "75756507" },
                    { nombre: "Luisa Lopez", dni: "75756407" },
                    { nombre: "Andres Gomez", dni: "21328539" },
                ],
            },
        ],
    },
    {
        obra: {
            nombre: "EDIFICIO TORRE AZUL",
        },
        dia: "08-08-2025",
        nro_tarea: 3,
        nro_trabajadores_asignados: 8,
        tareas: [
            {
                descripcion: "Instalación de sistema eléctrico",
                trabajadores: [
                    { nombre: "Carlos Rodriguez", dni: "12345678" },
                    { nombre: "Ana Martinez", dni: "87654321" },
                ],
            },
            {
                descripcion: "Colocación de ventanas",
                trabajadores: [
                    { nombre: "Pedro Sanchez", dni: "11223344" },
                    { nombre: "Laura Fernandez", dni: "44332211" },
                ],
            },
            {
                descripcion: "Acabados interiores",
                trabajadores: [
                    { nombre: "Miguel Torres", dni: "55667788" },
                    { nombre: "Sofia Ruiz", dni: "88776655" },
                    { nombre: "Diego Morales", dni: "99887766" },
                    { nombre: "Carmen Vega", dni: "66778899" },
                ],
            },
        ],
    },
]

const TablaTareasObras = () => {
    const [expandedIndex, setExpandedIndex] = useState(null)

    const toggleExpand = (index) => {
        setExpandedIndex(prev => (prev === index ? null : index))
    }

    return (
        <div className="px-6 bg-gradient-to-br">

            <div className="space-y-4">
                {tareas.map((tarea, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-[#1b274a] text-white p-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{tarea.obra.nombre}</CardTitle>
                                        <div className="flex items-center space-x-4 mt-2 text-blue-100">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">{tarea.dia}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <ClipboardList className="h-4 w-4" />
                                                <span className="text-sm">{tarea.nro_tarea} tareas</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="h-4 w-4" />
                                                <span className="text-sm">{tarea.nro_trabajadores_asignados} trabajadores</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => toggleExpand(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:bg-white/20 transition-all duration-200"
                                    >
                                        {expandedIndex === index ? (
                                            <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 transition-transform duration-200" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {expandedIndex === index && (
                            <CardContent className="p-6 bg-white">
                                <div className="space-y-6">
                                    {tarea.tareas.map((t, i) => (
                                        <div key={i} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-slate-50/50">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-800">Tarea {i + 1}</h3>
                                                </div>
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                    {t.trabajadores.length} trabajadores
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                                                        <ClipboardList className="h-4 w-4" />
                                                        <span>Descripción</span>
                                                    </h4>
                                                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700">
                                                        {t.descripcion}
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
                                                            {t.trabajadores.map((trab, j) => (
                                                                <div key={j} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                                                    <div className="grid grid-cols-2 gap-4 items-center">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                                                                <User className="h-3 w-3 text-slate-500" />
                                                                            </div>
                                                                            <span className="text-slate-700 font-medium">{trab.nombre}</span>
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
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TablaTareasObras
