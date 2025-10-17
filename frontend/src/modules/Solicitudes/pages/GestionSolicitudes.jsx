import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import HistorialSolicitudes from "../components/HistorialSolicitudes";
import NuevaSolicitud from "../components/NuevaSolicitud";
import solicitudesService from "../service/solicitudesService";

// --- Componente principal ------------------------------------------
export default function GestionSolicitudes() {
  const [tab, setTab] = useState("historial");
  const [tituloForm, setTituloForm] = useState("Registrar solicitud");

  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  const [selectedEquipos, setSelectedEquipos] = useState([]);
  const [editingSolicitud, setEditingSolicitud] = useState(null);
    const [tipoEquipo, setTipoEquipo] = useState(0);
  

  // --- Cargar historial al inicio
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoadingSolicitudes(true);
    const response = await solicitudesService.obtenerSolicitudes();
    setSolicitudes(response.data.solicitudes);
    setLoadingSolicitudes(false);
  };

  // --- Verificar si puede registrar nueva solicitud
  const puedeRegistrar =
    solicitudes[0]?.estado === "entregado" || solicitudes.length === 0;

  // --- Cargar equipos
  const fetchEquipos = async () => {
    setLoadingEquipos(true);
    const response = await solicitudesService.obtenerEquipos();
    setEquipos(response.data.equipos);
    setLoadingEquipos(false);
  };

  // --- Al cambiar de pestaña
  const handleTabChange = (value) => {
    if (value === "form") {
      if (!puedeRegistrar && !editingSolicitud) {
        toast.warning(
          "No puedes registrar una nueva solicitud hasta que la anterior sea atendida."
        );
        return;
      }
      setTituloForm("Registrar solicitud");
      setSelectedEquipos([]);
      setTipoEquipo(0)
      setEditingSolicitud(null);
      fetchEquipos();
    } else {
      setEditingSolicitud(null);
      setTituloForm("Registrar solicitud");
      setSelectedEquipos([]);
      setTipoEquipo(0)
    }
    setTab(value);
  };

  // --- Editar solicitud existente
  const handleEditar = (solicitud) => {
    setEditingSolicitud(solicitud);
    setSelectedEquipos(solicitud.equipos.map((e) => e.id));
    setTituloForm("Editar solicitud");
    fetchEquipos();
    setTab("form");
  };

  // --- Manejo del formulario
  const toggleEquipo = (id) => {
    setSelectedEquipos((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (mensaje="") => {
    if (selectedEquipos.length === 0) {
      toast.error("Selecciona al menos un equipo de protección.");
      return;
    }
    try {
      const payload = {
        equipos: selectedEquipos,
        observacion:mensaje||"",
      };
      if (editingSolicitud) {
        payload.solicitud_id = editingSolicitud.id;
        await solicitudesService.actualizarSolicitud(payload);
        toast.success("Cambios guardados correctamente.");
      } else {
        await solicitudesService.crearSolicitud(payload);
        toast.success("Solicitud registrada exitosamente.");
      }
      limpiardatos();
    } catch (error) {
      toast.error("Error en el servidor");
      console.error(error);
    }
  };
  const limpiardatos = () => {
    fetchSolicitudes();
    setTab("historial");
    setEditingSolicitud(null);
    setTituloForm("Registrar solicitud");
    setSelectedEquipos([]);
    setTipoEquipo(0)
  };

  return (
    // <Card className="w-full max-w-3xl mx-auto mt-8 shadow-lg rounded-2xl ">
    <Card className="mx-4 md:w-full max-w-3xl md:mx-auto mt-8 shadow-lg rounded-2xl " >

      <CardHeader>
        <CardTitle>Solicitud de equipos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger
              value="form"
              disabled={!puedeRegistrar && !editingSolicitud}
            >
              {tituloForm}
            </TabsTrigger>
          </TabsList>

          {/* --- TAB HISTORIAL --- */}
          <HistorialSolicitudes
            handleEditar={handleEditar}
            loadingSolicitudes={loadingSolicitudes}
            solicitudes={solicitudes}
          />

          {/* --- TAB FORMULARIO --- */}
          {(equipos && equipos.length > 0) && (
            <NuevaSolicitud
              editingSolicitud={editingSolicitud}
              handleSubmit={handleSubmit}
              loadingEquipos={loadingEquipos}
              equipos={equipos}
              selectedEquipos={selectedEquipos}
              toggleEquipo={toggleEquipo}
              setTipoEquipo={setTipoEquipo}
              tipoEquipo={tipoEquipo}
            />
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
