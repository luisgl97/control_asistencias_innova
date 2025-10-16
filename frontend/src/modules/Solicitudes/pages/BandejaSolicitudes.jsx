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

const BandejaSolicitudes = () => {
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [estadoSolicitud, setEstadoSolicitud] = useState("solicitado");
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
      setSolicitudesFiltradas(data);
    }
  }, [estadoSolicitud, solicitudes]);

  return (
    <article className="space-y-8 w-full max-w-7xl mx-auto my-16">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectConEtiquetaFlotante
          value={estadoSolicitud}
          onChange={(name, value) => setEstadoSolicitud(value)}
          name="filial_id"
          label="Busca por estado solicitud"
          opciones={opciones_estado_solicitud}
        />
      </section>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {solicitudesFiltradas.map((s,i) => (
          <SolicitudCard key={s.id} solicitud={s} fetchSolicitudes={fetchSolicitudes}/>
        ))}
      </section>
    </article>
  );
};

export default BandejaSolicitudes;
