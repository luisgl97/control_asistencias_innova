import React, { useEffect, useState } from "react";
import solicitudesService from "../service/solicitudesService";
import SolicitudCard from "../components/SolicitudCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectConEtiquetaFlotante from "@/shared/components/selectConEtiquetaFlotante";
import { opciones_estado_solicitud } from "@/modules/usuarios/utils/optionsUsuarioForm";
import { Input } from "@/components/ui/input";
import InputConEtiquetaFlotante from "@/shared/components/InputConEtiquetaFlotante";

const BandejaSolicitudes = () => {
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [estadoSolicitud, setEstadoSolicitud] = useState("solicitado");
  const [busqueda, setBusqueda] = useState("");
  const fetchSolicitudes = async () => {
    try {
      const response = await solicitudesService.obtenerTodasLasSolicitudes();
      setSolicitudes(response.data.solicitudes);
      setSolicitudesFiltradas(response.data.solicitudes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    if (solicitudes.length > 0) {
      let data = [...solicitudes];
      if (estadoSolicitud) {
        data = data.filter((s) => s.estado === estadoSolicitud);
      }
      if (busqueda) {
        data=data.filter((s) => {
          return (
            s.usuario_solicitante.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            s.usuario_solicitante.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
            s.usuario_solicitante.dni.includes(busqueda)
          );
        });
      }
      setSolicitudesFiltradas(data);
    }
  }, [estadoSolicitud, solicitudes, busqueda]);

  return (
    <article className="space-y-8 w-full px-2 md:px-0 max-w-7xl mx-auto my-16">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectConEtiquetaFlotante
          value={estadoSolicitud}
          onChange={(name, value) => setEstadoSolicitud(value)}
          name="filial_id"
          label="Busca por estado de solicitud"
          opciones={opciones_estado_solicitud}
        />
        <div>
          <InputConEtiquetaFlotante
            label={"Busca por trabajador"}
            value={busqueda}
            handleChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[72vh] overflow-y-auto">
        {solicitudesFiltradas.map((s, i) => (
          <SolicitudCard
            key={s.id}
            solicitud={s}
            fetchSolicitudes={fetchSolicitudes}
          />
        ))}
      </section>
    </article>
  );
};

export default BandejaSolicitudes;
