import usuarioService from "@/modules/usuarios/services/usuarioService"
import { CookingPot, Save, XCircle } from 'lucide-react'
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import InformeGeneralTareaRegistrar from "../components/InformeGeneralTareaRegistrar"
import TareaRegistroDetallado from "../components/TareaRegistroDetallado"
import TrabajadoresRegistrarTarea from "../components/TrabajadoresRegistrarTarea"
import obraService from "../services/obraService"
import validarTarea from "../utils/validarTarea"


const RegistrarTarea = () => {
  // ?? Para obtener el id de la obra
  const [searchParams] = useSearchParams();
  const id_registro_diario = searchParams.get("id_registro_diario");
  const dia = searchParams.get("dia");

  // ?? Navegacion
  const navigate = useNavigate();

  // ?? Duplicado
  const location = useLocation();
  const datosRecibidos = location.state;

  // ?? DATA STATE
  const [trabajadores, setTrabajadores] = useState([])
  const [obras, setObras] = useState([])
  const [obrasRegistradas, setObrasRegistradas] = useState([])

  const [obraObtenida, setObraObtenida] = useState({})

  // ?? loading
  const [loading, setLoading] = useState(false);
  const [isLoadingBtnSave, setIsLoadingBtnSave] = useState(false); // ** Desactiva el boton de guardar

  // ?? friltro
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([])
  const [textFiltroTrabajador, setTextFiltroTrabajador] = useState("")

  const [fecha, setFecha] = useState(new Date())
  const [obraSeleccionada, setObraSeleccionada] = useState(null)
  const [tareas, setTareas] = useState([
    { id: 1, descripcion: "", trabajadores: [] }
  ])

  useEffect(() => {
    if (datosRecibidos) {
      setTareas([datosRecibidos])
    }
  }, [datosRecibidos])

  useEffect(() => {
    const obtenerRegistroDiarioPorId = async () => {
      try {
        setIsLoadingBtnSave(true);
        const { data, status } = await obraService.obtenerRegistroDiarioPorId({ obra_id: id_registro_diario, fecha: dia });
        if (status === 200) {
          setObraObtenida(data.datos);
          setTareas([
            { id: data.datos.obra.id, descripcion: data.datos.tarea_descripcion, trabajadores: data.datos.trabajadores },
          ]);
          setFecha(data.datos.dia);
          setObraSeleccionada(data.datos.obra.id);
        }
      } catch (error) {

      } finally {
        setIsLoadingBtnSave(false);
      }
    }
    obtenerRegistroDiarioPorId()
  }, [searchParams])

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      // setFecha()
      setIsLoadingBtnSave(true);
      setLoading(true)
      try {
        // ** obtener obras
        const { status: statusO, data: dataO } = await obraService.listarObras()
        // ** obtener trabajadores
        if (statusO === 200) {
          setObras(dataO.datos.filter(obra => obra.estado))
        }
        const { status: statusT, data: dataT } = await usuarioService.getUsuariosAllTrabajadores()

        // Filtrar trabajadores activos
      
        const trabajadoresActivos = dataT.datos.filter(trabajador => trabajador.estado == true);
       
        if (statusT === 200) {
          setTrabajadores(trabajadoresActivos)
          setTrabajadoresFiltrados(trabajadoresActivos)
        }
      } catch (error) {
        toast.error("Error al obtener los datos iniciales")
      }
      finally {
        setLoading(false)
        setIsLoadingBtnSave(false);
      }
    }
    obtenerDatosIniciales()
  }, [])

  useEffect(() => {
    const obtenerObrasRegistradas = async () => {
      try {
        setIsLoadingBtnSave(true);
        const { data, status } = await obraService.listarRegistrosDiarios({ fecha });
        if (status === 200) {
          setObrasRegistradas(data.datos.map(item => item.obra.id));
        }
      } catch (error) {
        toast.error("Error al obtener obras registradas");
      } finally {
        setIsLoadingBtnSave(false);
      }
    }
    obtenerObrasRegistradas()
  }, [fecha])

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
      fecha: obraObtenida.dia ? obraObtenida.dia : fecha,
      obra_id: id_registro_diario ? Number(id_registro_diario) : obraSeleccionada,
      descripcion_tarea: tareas[0].descripcion.trim() !== "" ? tareas[0].descripcion : "",
      lista_usuarios_ids: tareas.flatMap(t => t.trabajadores.map(t => t.id)),
    }

    try {
      setIsLoadingBtnSave(true)
      const resultadoValidacion = validarTarea(tareas[0], registro.obra_id);
      if (!resultadoValidacion.valido) {
        toast.error(resultadoValidacion.mensaje);
        return;
      }

      if (id_registro_diario && dia) {

        const { data, status } = await obraService.actualizarTarea(registro)
        if (status === 200) {
          toast.success(data.mensaje)
          setTareas([])
          navigate("/registro-diario")
        }
      } else {
        const { data, status } = await obraService.registrarTarea(registro)
        // Aquí iría la lógica para guardar en la base de datos
        if (status === 201) {
          toast.success(data.mensaje)
          setTareas([])
          navigate("/registro-diario")
        }
      }
    } catch (error) {
      toast.error("Hubo un error, por favor revisa los datos")
    } finally {
      setIsLoadingBtnSave(false)
    }
  }


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
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Registrar Nueva Tarea</h1>
          <p className="text-sm md:text-lg text-slate-600">Asigna tareas y trabajadores a los proyectos </p>
        </div>

        {/* Asignación de Tareas y Trabajadores */}
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className="flex flex-col gap-4 w-full md:w-8/12">
            {/* Información General */}
            <InformeGeneralTareaRegistrar
              obras={obras}
              obraSeleccionada={obraSeleccionada}
              setObraSeleccionada={setObraSeleccionada}
              fecha={fecha}
              setFecha={setFecha}
              obrasRegistradas={obrasRegistradas}
              obraObtenida={obraObtenida}
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

          <div className="flex flex-col  gap-4 w-full md:w-4/12 h-full">
            {/* Trabajadores Disponibles */}
            <TrabajadoresRegistrarTarea
              trabajadores={trabajadores}
              trabajadoresFiltrados={trabajadoresFiltrados}
              textFiltroTrabajador={textFiltroTrabajador}
              handlerFiltro={handlerFiltro}
              tareas={tareas}
              asignarTrabajador={asignarTrabajador}
              loading={loading}
            />

            {/* Botón Guardar */}
            <div className="flex w-full justify-end gap-4 md:justify-center px-3 md:px-0">
              <button
                onClick={() => navigate("/registro-diario")}
                className=" cursor-pointer hover:bg-red-400 hover:text-white text-red-400 border-2 px-8 py-3 text-lg font-semibold shadow-lg rounded-lg flex items-center"
              >
                <XCircle className="md:h-5 md:w-5 mr-2" />
                <span className="hidden md:block">
                  Cancelar
                </span>
              </button>
              <button
                onClick={guardarRegistro}
                disabled={isLoadingBtnSave}
                className={`
                  ${isLoadingBtnSave ? "bg-gray-200 text-gray-500" : "bg-blue-500 hover:bg-blue-700"}
                  cursor-pointer text-white px-8 py-3 text-lg font-semibold shadow-lg rounded-lg flex items-center
                `}
              >
                <Save className="md:h-5 md:w-5 mr-2" />
                {
                  id_registro_diario && dia ? (
                    <span className="hidden md:block">
                      Actualizar
                    </span>
                  ) : (
                    <span className="hidden md:block">
                      Guardar
                    </span>
                  )
                }
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default RegistrarTarea
