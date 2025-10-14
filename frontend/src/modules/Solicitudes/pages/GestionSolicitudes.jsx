import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// --- Mock service -------------------------------------------------
const solicitudesService = {
  solicitudes: async ({ id_trabajador }) => {
    await new Promise((r) => setTimeout(r, 800)); // Simula delay
    return [
      {
        id: "1",
        fecha: "2025-10-01",
        estado: "solicitada",
        equipos: [
          { id: "e1", nombre: "Casco" },
          { id: "e2", nombre: "Guantes" },
        ],
      },
      {
        id: "2",
        fecha: "2025-09-15",
        estado: "entregada",
        equipos: [{ id: "e3", nombre: "Botas" }],
      },
    ];
  },
  equipos: async () => {
    await new Promise((r) => setTimeout(r, 500));
    return [
      { id: "e1", nombre: "Casco" },
      { id: "e2", nombre: "Guantes" },
      { id: "e3", nombre: "Botas" },
    ];
  },
};

// --- Componente principal ------------------------------------------
export default function GestionSolicitudes() {
  const id_trabajador = 1; // Simulado
  const [tab, setTab] = useState("historial");
  const [tituloForm, setTituloForm] = useState("Registrar solicitud");

  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  const [selectedEquipos, setSelectedEquipos] = useState([]);
  const [editingSolicitud, setEditingSolicitud] = useState(null);

  // --- Cargar historial al inicio
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoadingSolicitudes(true);
    const data = await solicitudesService.solicitudes({ id_trabajador });
    setSolicitudes(data);
    setLoadingSolicitudes(false);
  };

  // --- Verificar si puede registrar nueva solicitud
  const puedeRegistrar = solicitudes[0]?.estado === "entregada" || solicitudes.length === 0;

  // --- Cargar equipos
  const fetchEquipos = async () => {
    setLoadingEquipos(true);
    const data = await solicitudesService.equipos();
    setEquipos(data);
    setLoadingEquipos(false);
  };

  // --- Al cambiar de pestaña
  const handleTabChange = (value) => {
    if (value === "form") {
      if (!puedeRegistrar && !editingSolicitud) {
        toast.warning("No puedes registrar una nueva solicitud hasta que la anterior sea entregada.");
        return;
      }
      setTituloForm("Registrar solicitud");
      setSelectedEquipos([]);
      setEditingSolicitud(null);
      fetchEquipos();
    }
    else{
      setEditingSolicitud(null);
      setTituloForm("Registrar solicitud");
      setSelectedEquipos([]);
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

  const handleSubmit = async () => {
    if (selectedEquipos.length === 0) {
      toast.error("Selecciona al menos un equipo de protección.");
      return;
    }

    if (editingSolicitud) {
      toast.success("Cambios guardados correctamente.");
    } else {
      toast.success("Solicitud registrada exitosamente.");
    }

    // Simula guardar y recargar
    setTimeout(() => {
      fetchSolicitudes();
      setTab("historial");
      setEditingSolicitud(null);
      setTituloForm("Registrar solicitud");
      setSelectedEquipos([]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>Solicitudes de EPP</CardTitle>
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
          <TabsContent value="historial" className="mt-4">
            {loadingSolicitudes ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : (
              <div className="space-y-3">
                {solicitudes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay solicitudes registradas.
                  </p>
                )}
                {solicitudes.map((s) => (
                  <Card key={s.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          Fecha: {s.fecha} — Estado:{" "}
                          <span
                            className={`capitalize ${
                              s.estado === "entregada"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {s.estado}
                          </span>
                        </p>
                        <p className="text-sm">
                          Equipos:{" "}
                          {s.equipos.map((e) => e.nombre).join(", ")}
                        </p>
                      </div>
                      {s.estado === "solicitada" && (
                        <Button
                          variant="outline"
                          onClick={() => handleEditar(s)}
                        >
                          Editar solicitud
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => handleTabChange("form")}
                    disabled={!puedeRegistrar}
                  >
                    Registrar nueva solicitud
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* --- TAB FORMULARIO --- */}
          <TabsContent value="form" className="mt-4">
            {loadingEquipos ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : (
              <div>
                {equipos.length > 0 ? (
                  <div className="space-y-3">
                    {equipos.map((eq) => (
                      <div
                        key={eq.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={eq.id}
                          checked={selectedEquipos.includes(eq.id)}
                          onCheckedChange={() => toggleEquipo(eq.id)}
                        />
                        <label
                          htmlFor={eq.id}
                          className="text-sm font-medium leading-none"
                        >
                          {eq.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay equipos disponibles.
                  </p>
                )}
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSubmit}>
                    {editingSolicitud ? "Guardar cambios" : "Registrar"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
