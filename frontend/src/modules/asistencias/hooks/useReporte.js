import { useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import usuarioService from "../../usuarios/services/usuarioService"
import asistenciaService from "../service/asistenciaService"
import { generarPDFMasivoConQR} from "../libs/generarPDFMasivoConQR"
import { generarPDFMasivoInformativo } from "../libs/generarPDFMasivoInformativo"
import api from "../../../shared/service/api"

export default function useReportes(usuarioLogueado) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [pdfSeleccionado, setPDFSeleccionado] = useState(null);

  const obtenerAsistencias = async (anio, mes) => {
    const fechaInicio = `${anio}-${mes}-01`;
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const fechaFin = `${anio}-${mes.padStart(2, "0")}-${ultimoDia}`;

    const dataPOST = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }

    const resT = await usuarioService.getUsuariosConMinimoUnaAsistenciaDelMes(dataPOST);
    const trabajadores = resT.data.datos.filter(
      (t) => t.rol !== "GERENTE" && t.rol !== "ADMINISTRADOR"
    );

    const asistentesConDatos = await Promise.all(
      trabajadores.map(async (trabajador) => {
        const res = await asistenciaService.asistenciaPorUsuario({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          usuario_id: trabajador.id,
        });

        return {
          usuario: trabajador,
          asistencias: Array.isArray(res.data.datos.asistencias)
            ? res.data.datos.asistencias
            : [],
        };
      })
    );
    return asistentesConDatos;
  };

  const generarReporte = async (anio, mes) => {
    if (!anio || !mes) return toast.error("Por favor selecciona un año y un mes");

    try {
      setIsLoading(true);
      setResultados([]);
      setPDFSeleccionado(null);

      const data = await obtenerAsistencias(anio, mes);
      const resultadosFinales = await generarPDFMasivoInformativo(data, mes, anio);

      // Luego de generarlos, verificamos cuáles ya han sido emitidos:
      const verificados = await Promise.all(resultadosFinales.map(async (r) => {
        try {
          const res = await api.get("/reportes/verificar-reporte", {
            params: {
              usuario_id: r.usuario_id,
              mes: `${anio}-${mes}`
            }
          });

          if (res.data.existe) {
            return { ...r, hash: res.data.hash, yaEmitido: true, url: res.data.url };
          }
          
          return r;
        } catch (error) {
          console.warn("Error verificando reporte emitido:", error);
          return r;
        }
      }));

      setResultados(verificados);

      if (resultadosFinales.length === 0) {
        toast.warning("No se generaron PDFs porque ningún trabajador tiene asistencias válidas.");
        return;
      }

      toast.success("¡Reportes generados con éxito!");
    } catch (error) {
      console.error(error);
      toast.error("¡Hubo un error generando los reportes!");
    } finally {
      setIsLoading(false);
    }
  };

  const emitirMasivo = async (anio, mes) => {
    try {
      setIsLoading(true);
      toast.loading("Generando y registrando reportes oficiales...");

      const dataParaGenerar = resultados.map(r => ({
        usuario: {
          id: r.usuario_id,
          nombres: r.trabajador.split(" ")[0],
          apellidos: r.trabajador.split(" ").slice(1).join(" "),
          tipo_documento: r.tipo_documento || "-",
          dni: r.dni || "-",
          cargo: r.cargo || "-",
          filial: r.filial || { razon_social: "-", ruc: "-" },
        },
        asistencias: r.asistencias || []
      }));

      const resultadosOficiales = await generarPDFMasivoConQR(dataParaGenerar, mes, anio, usuarioLogueado?.id);

      setResultados((prev) =>
        prev.map((item) => {
          const oficial = resultadosOficiales.find((r) => r.usuario_id === item.usuario_id);
          return oficial
            ? {
                ...item,
                hash: oficial.hash,
                yaEmitido: true,
                url: oficial.url
              }
            : item;
        })
      );

      toast.success("Todos los reportes fueron emitidos oficialmente.");
    } catch (error) {
      console.error("❌ Error al emitir masivo:", error);
      toast.error("Error al emitir reportes oficiales.");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };



  const emitirIndividual = async (r, anio, mes) => {
    try {
      setIsLoading(true);
      toast.loading("Generando y registrando reporte oficial...");

      const trabajador = {
        usuario: {
          id: r.usuario_id,
          nombres: r.trabajador.split(" ")[0],
          apellidos: r.trabajador.split(" ").slice(1).join(" "),
          tipo_documento: r.tipo_documento || "-",
          dni: r.dni || "-",
          cargo: r.cargo || "-",
          filial: r.filial || { razon_social: "-", ruc: "-"},
        },
        asistencias: r.asistencias || []
      }

      const resultado = (await generarPDFMasivoConQR([trabajador], mes, anio, usuarioLogueado?.id || 1))[0];

      if (!resultado || !resultado.hash) {
        throw new Error("No se pudo generar el reporte oficial correctamente")
      }

      toast.success("Reporte oficial emitido correctamente");

      setResultados((prev) =>
        prev.map((item) =>
          item.usuario_id === r.usuario_id
            ? { ...item, hash: resultado.hash, yaEmitido: true, url: resultado.url}
            : item
        )
      );
    } catch (error) {
      console.error("Error emitiendo reporte:", error);
      toast.error("Error al emitir el reporte oficial");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return {
    isLoading,
    resultados,
    pdfSeleccionado,
    setPDFSeleccionado,
    generarReporte,
    emitirIndividual,
    emitirMasivo
  };
}