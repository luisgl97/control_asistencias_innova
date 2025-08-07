import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Users, Calendar, Building2, ClipboardList, Edit3, User } from 'lucide-react'
import React, { useEffect, useState } from "react"
import TareaDescipcion from "./TareaDescipcion"
import obraService from "../services/obraService"

const tareas = [
    {
        obra: {
            id: 1,
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

    useEffect(() => {
        const obtenerTarea = async () => {
            const respuesta = await obraService.listarRegistrosDiarios({ fecha: "2025-08-7" });
            console.log(respuesta)
        }
        obtenerTarea();
    }, [])

    return (
        <div className="px-6 bg-gradient-to-br">

            <div className="space-y-4">
                {tareas.map((tarea, index) => (
                    <div key={index} className="bg-[#1b274a] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-lg">
                        <CardHeader className=" text-white p-3">
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
                            <CardContent className=" bg-white p-4 border-x-2 border-b-2 border-gray-500  rounded-b-lg ">
                                <div className="">
                                    {tarea.tareas.map((tarea, index) => (
                                        <TareaDescipcion index={index} tarea={tarea} />
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TablaTareasObras
