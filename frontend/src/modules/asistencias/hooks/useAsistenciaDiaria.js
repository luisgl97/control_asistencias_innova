import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import asistenciaService from "../service/asistenciaService";
import { normalizarTexto } from "../libs/mormalizarTextoBusqueda";

export default function useAsistenciaDiaria() {
  const { user } = useAuth();
  const [datosAsistencia, setDatosAsistencia] = useState([]);
  const [datosAsistenciaGuard, setDatosAsistenciaGuard] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());

  const [filial, setFilial] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    hoy.toISOString().split("T")[0]
  );
  const [nombreTrabajador, setNombreTrabajador] = useState("");

  const OBRAS_TODAS = "__ALL__";

  const [obra, setObra] = useState(OBRAS_TODAS);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const res = await asistenciaService.asistenciasDelDia({
        fecha: fechaSeleccionada,
      });

      setDatosAsistencia(res.data.datos);
      setDatosAsistenciaGuard(res.data.datos);
    } catch (err) {
      setError(
        "Error al cargar los datos de asistencia. Por favor, intenta nuevamente."
      );
      console.error("Error cargando datos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (fechaSeleccionada) cargarDatos();
  }, [fechaSeleccionada]);

  const opcionesObras = useMemo(() => {
    const set = new Set();

    (datosAsistenciaGuard ?? []).forEach((t) => {
      (t?.obras_asignadas ?? []).forEach((o) => {
        const obraNombre = String(o || "").trim();
        if (obraNombre) set.add(obraNombre);
      });
    });

    const obrasOrdenadas = Array.from(set).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );

    return [
      { value: OBRAS_TODAS, label: "Todas las obras" },
      ...obrasOrdenadas.map((o) => ({ value: o, label: o })),
    ];
  }, [datosAsistenciaGuard]);

  useEffect(() => {
    let copy = [...datosAsistenciaGuard];

    if (nombreTrabajador) {
      const busqueda = normalizarTexto(nombreTrabajador);

      copy = copy.filter((t) => {
        const textoTrabajador = normalizarTexto(t?.trabajador || "");
        const textoDocumento = normalizarTexto(
          `${t?.tipo_documento || ""} ${t?.dni || ""}`
        );
        const textoObras = normalizarTexto(
          (t?.obras_asignadas ?? []).join(" ")
        );

        return (
          textoTrabajador.includes(busqueda) ||
          textoDocumento.includes(busqueda) ||
          textoObras.includes(busqueda)
        );
      });
    }

    if (filial) {
      copy = copy.filter((t) => t.filial_id === Number(filial));
    }

    if (obra && obra !== OBRAS_TODAS) {
      const busqueda = normalizarTexto(obra);
      copy = copy.filter((t) =>
        (t?.obras_asignadas ?? []).some((o) =>
          normalizarTexto(String(o || "")).includes(busqueda)
        )
      );
    }

    setDatosAsistencia(copy);
  }, [nombreTrabajador, datosAsistenciaGuard, filial, obra]);

  return {
    user,
    datosAsistencia,
    cargando,
    error,

    filial,
    setFilial,

    fechaSeleccionada,
    setFechaSeleccionada,

    nombreTrabajador,
    setNombreTrabajador,

    obra,
    setObra,
    opcionesObras,
    OBRAS_TODAS,

    cargarDatos,
  };
}
