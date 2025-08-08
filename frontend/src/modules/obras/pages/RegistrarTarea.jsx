import usuarioService from "@/modules/usuarios/services/usuarioService"
import { Save } from 'lucide-react'
import { useEffect, useState } from "react"
import InformeGeneralTareaRegistrar from "../components/InformeGeneralTareaRegistrar"
import TareaRegistroDetallado from "../components/TareaRegistroDetallado"
import TrabajadoresRegistrarTarea from "../components/TrabajadoresRegistrarTarea"
import obraService from "../services/obraService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


const RegistrarTarea = () => {
  // ?? Navegacion
  const navigate = useNavigate();

  // ?? DATA STATE
  const [trabajadores, setTrabajadores] = useState([])
  const [obras, setObras] = useState([])


  // ?? friltro
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([])
  const [textFiltroTrabajador, setTextFiltroTrabajador] = useState("")

  const [fecha, setFecha] = useState("")
  const [obraSeleccionada, setObraSeleccionada] = useState("")
  const [tareas, setTareas] = useState([
    { id: 1, descripcion: "", trabajadores: [] }
  ])


  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        // ** obtener obras
        const { status: statusO, data: dataO } = await obraService.listarObras()
        // ** obtener trabajadores
        if (statusO === 200) {
          setObras(dataO.datos)
        }
        const { status: statusT, data: dataT } = await usuarioService.getUsuariosAllTrabajadores()
        if (statusT === 200) {
          setTrabajadores(dataT.datos)
          setTrabajadoresFiltrados(dataT.datos)
        }
      } catch (error) {
        toast.error("Error al obtener los datos iniciales")
      }
    }
    obtenerDatosIniciales()
  }, [])

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


  const guardarRegistro = async () => {
    const registro = {
      fecha: fecha,
      obra_id: obraSeleccionada,
      descripcion_tarea: tareas[0].descripcion.trim() !== "" ? tareas[0].descripcion : "",
      lista_usuarios_ids: tareas.flatMap(t => t.trabajadores.map(t => t.id)),
    }

    try {
      const { data, status } = await obraService.RegistrarTarea(registro)
      // Aquí iría la lógica para guardar en la base de datos
      if (status === 201) {
        toast.success(data.mensaje)
        navigate("/registro-diario")
      }

    } catch (error) {
      toast.error(error.response.data.mensaje)
    }
  }

  const esFormularioValido = fecha && obraSeleccionada && tareas.some(t => t.descripcion.trim() !== "")

  const handlerFiltro = (e) => {
    setTextFiltroTrabajador(e.target.value)
  }

  const normalize = (s = "") =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  useEffect(() => {
    const q = normalize(textFiltroTrabajador);

    // si no hay texto, mostrar todos
    if (!q) {
      setTrabajadoresFiltrados(trabajadores);
      return;
    }

    const filtrados = trabajadores.filter((trabajador) => {
      const nombreCompleto = `${trabajador.nombres ?? ""} ${trabajador.apellidos ?? ""}`;
      const nombreNorm = normalize(nombreCompleto);
      const cargoNorm = normalize(trabajador.cargo ?? "");
      const dniStr = String(trabajador.dni ?? "");

      return (
        nombreNorm.includes(q) ||
        cargoNorm.includes(q) ||
        dniStr.includes(textFiltroTrabajador) // aquí uso el texto crudo para DNI
      );
    });

    setTrabajadoresFiltrados(filtrados);
  }, [textFiltroTrabajador, trabajadores]);

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Registrar Nueva Tarea</h1>
          <p className="text-slate-600">Asigna tareas y trabajadores a los proyectos </p>
        </div>

        {/* Asignación de Tareas y Trabajadores */}
        <div className="flex gap-4 h-full">
          <div className="flex flex-col gap-4 w-8/12">
            {/* Información General */}
            <InformeGeneralTareaRegistrar
              obras={obras}
              obraSeleccionada={obraSeleccionada}
              setObraSeleccionada={setObraSeleccionada}
              fecha={fecha}
              setFecha={setFecha}
            />


            {/* Tareas */}
            <TareaRegistroDetallado
              tareas={tareas}
              agregarTarea={agregarTarea}
              eliminarTarea={eliminarTarea}
              removerTrabajador={removerTrabajador}
              actualizarDescripcionTarea={actualizarDescripcionTarea}
            />


          </div>

          <div className="flex flex-col  gap-4 w-4/12 h-full">
            {/* Trabajadores Disponibles */}
            <TrabajadoresRegistrarTarea
              trabajadores={trabajadores}
              trabajadoresFiltrados={trabajadoresFiltrados}
              textFiltroTrabajador={textFiltroTrabajador}
              handlerFiltro={handlerFiltro}
              tareas={tareas}
              asignarTrabajador={asignarTrabajador}
            />

            {/* Botón Guardar */}
            <div className="flex w-full justify-center">
              <button
                onClick={guardarRegistro}
                // disabled={!esFormularioValido}
                className="bg-blue-600 cursor-pointer hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg rounded-lg flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Guardar Registro de Tareas
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default RegistrarTarea
