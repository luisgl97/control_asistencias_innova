"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, UserPlus, UserMinus, Calendar, Building2, ClipboardList, Users, Save, User } from 'lucide-react'
import React, { useState } from "react"

// Datos de ejemplo
const obras = [
  { id: 1, nombre: "PROYECTO PALMERA DEL SUR" },
  { id: 2, nombre: "EDIFICIO TORRE AZUL" },
  { id: 3, nombre: "COMPLEJO RESIDENCIAL NORTE" },
  { id: 4, nombre: "CENTRO COMERCIAL PLAZA" },
]

const trabajadoresDisponibles = [
  { id: 1, nombre: "Pepito Perez", dni: "75756507", especialidad: "Albañil" },
  { id: 2, nombre: "Luisa Lopez", dni: "75756407", especialidad: "Electricista" },
  { id: 3, nombre: "Maria Gomez", dni: "75756327", especialidad: "Plomero" },
  { id: 4, nombre: "Andres Gomez", dni: "21328539", especialidad: "Soldador" },
  { id: 5, nombre: "Carlos Rodriguez", dni: "12345678", especialidad: "Carpintero" },
  { id: 6, nombre: "Ana Martinez", dni: "87654321", especialidad: "Electricista" },
  { id: 7, nombre: "Pedro Sanchez", dni: "11223344", especialidad: "Albañil" },
  { id: 8, nombre: "Laura Fernandez", dni: "44332211", especialidad: "Arquitecta" },
  { id: 9, nombre: "Miguel Torres", dni: "55667788", especialidad: "Ingeniero" },
  { id: 10, nombre: "Sofia Ruiz", dni: "88776655", especialidad: "Supervisora" },
]

const RegistrarTarea = () => {
  const [fecha, setFecha] = useState("")
  const [obraSeleccionada, setObraSeleccionada] = useState("")
  const [tareas, setTareas] = useState([
    { id: 1, descripcion: "", trabajadores: [] }
  ])

  const agregarTarea = () => {
    const nuevaTarea = {
      id: Date.now(),
      descripcion: "",
      trabajadores: []
    }
    setTareas([...tareas, nuevaTarea])
  }

  const eliminarTarea = (tareaId) => {
    if (tareas.length > 1) {
      setTareas(tareas.filter(tarea => tarea.id !== tareaId))
    }
  }

  const actualizarDescripcionTarea = (tareaId, descripcion) => {
    setTareas(tareas.map(tarea =>
      tarea.id === tareaId ? { ...tarea, descripcion } : tarea
    ))
  }

  const asignarTrabajador = (tareaId, trabajador) => {
    setTareas(tareas.map(tarea => {
      if (tarea.id === tareaId) {
        const yaAsignado = tarea.trabajadores.some(t => t.id === trabajador.id)
        if (!yaAsignado) {
          return { ...tarea, trabajadores: [...tarea.trabajadores, trabajador] }
        }
      }
      return tarea
    }))
  }

  const removerTrabajador = (tareaId, trabajadorId) => {
    setTareas(tareas.map(tarea =>
      tarea.id === tareaId
        ? { ...tarea, trabajadores: tarea.trabajadores.filter(t => t.id !== trabajadorId) }
        : tarea
    ))
  }

  const trabajadoresAsignados = tareas.flatMap(tarea => tarea.trabajadores.map(t => t.id))
  const trabajadoresLibres = trabajadoresDisponibles.filter(t => !trabajadoresAsignados.includes(t.id))

  const guardarRegistro = () => {
    const registro = {
      fecha,
      obra: obras.find(o => o.id.toString() === obraSeleccionada),
      tareas: tareas.filter(t => t.descripcion.trim() !== "")
    }
    console.log("Registro guardado:", registro)
    // Aquí iría la lógica para guardar en la base de datos
    alert("Registro de tareas guardado exitosamente!")
  }

  const esFormularioValido = fecha && obraSeleccionada && tareas.some(t => t.descripcion.trim() !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Registrar Nueva Tarea</h1>
          <p className="text-slate-600">Asigna tareas y trabajadores a los proyectos de construcción</p>
        </div>



        {/* Asignación de Tareas y Trabajadores */}
        <div className="flex gap-4 items-start">

          {/* Información General */}
          <Card className="flex flex-col gap-4 w-3/12 shadow-lg  border-2 border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-slate-700">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Información General</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-slate-700 font-medium">Fecha de la Tarea</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2 w-full">
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
          </Card>

          {/* Tareas */}
            <div className="hadow-lg w-5/12 border-2 border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5" />
                    <span>Tareas Asignadas</span>
                  </CardTitle>
                  <Button
                    onClick={agregarTarea}
                    variant="ghost"
                    size="sm"
                    className="text-green-600 border-1 cursor-pointer border-green-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Tarea
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {tareas.map((tarea, index) => (
                  <div key={tarea.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Tarea {index + 1}</h3>
                      </div>
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
                        <Label className="text-slate-700 font-medium">Descripción de la Tarea</Label>
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
                              <div key={trabajador.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800">{trabajador.nombre}</p>
                                    <p className="text-sm text-slate-500">{trabajador.especialidad} • DNI: {trabajador.dni}</p>
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
          </div>

          {/* Trabajadores Disponibles */}
          <div className="shadow-lg w-4/12 border-0 flex flex-col  rounded-xl">
            <Card className="shadow-lg border-2  backdrop-blur-sm">
              <CardHeader className="text-slate-700">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Trabajadores Disponibles</span>
                </CardTitle>
                <p className="text-purple-100 text-sm mt-1">
                  {trabajadoresLibres.length} de {trabajadoresDisponibles.length} disponibles
                </p>
              </CardHeader>
              <CardContent className="p-4">
              <Input
                type="search"
                placeholder="Buscar trabajador"
                className="px-4 py-2 border-0 rounded-lg w-full"
                // value={filtro}
                // onChange={(e) => setFiltro(e.target.value)}
              />

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {trabajadoresLibres.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Todos los trabajadores están asignados</p>
                    </div>
                  ) : (
                    trabajadoresLibres.map((trabajador) => (
                      <div key={trabajador.id} className="border border-slate-200 rounded-lg p-3 hover:border-purple-300 transition-colors bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">{trabajador.nombre}</p>
                              <p className="text-sm text-slate-500 truncate">{trabajador.especialidad}</p>
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
                                Tarea {index + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <Button
            onClick={guardarRegistro}
            disabled={!esFormularioValido}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Registro de Tareas
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegistrarTarea
