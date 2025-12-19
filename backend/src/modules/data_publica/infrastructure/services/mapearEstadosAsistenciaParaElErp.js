const {
  CONST_HORA_FIN_SAB,
  CONST_HORA_FIN_LV,
  CONST_HORA_INICIO,
} = require("../../../../constants/horarios");
const db = require("../../../../models");
const {
  calcularDiferenciaHorasMinutosSegundos,
} = require("../../../../utils/calcularDiferenciaHorasMinutosSegundos");

// Usar moment para manejo de fechas (lima Peru)
const moment = require("moment");
require("moment/locale/es"); // importa el idioma español
require("moment-timezone");
moment.locale("es"); // establece el idioma a español

function mapearEstadosAsistenciaParaElErp(listaAsistencias) {
  const listaAsistenciasMapeado = Promise.all(
    listaAsistencias.map(async (asistencia) => {
      let estado;

      switch (asistencia.estado) {
        case "ASISTIO":
        case "PRESENTE":
          estado = "presente";
          break;
        case "FALTA":
          estado = "falto";
          break;
        case "TARDANZA":
        case "ASISTIO TARDE":
          estado = "tardanza";
          break;
        case "SALIDA ANTICIPADA":
          estado = "presente";
          break;
        case "FALTA JUSTIFICADA":
          estado = "falta-justificada";
          break;
        default:
          estado = "";
          break;
      }

      // Obtener las obras asignadas de la fecha
      const obras = await db.registros_diarios.findAll({
        where: {
          fecha: asistencia.fecha,
          usuario_id: asistencia.usuario_id,
        },
        include: [
          {
            model: db.obras,
            as: "obra",
          },
        ],
      });

      const { ubicacion_ingreso, ubicacion_salida } = asistencia;

      let ubicacionIngreso = ubicacion_ingreso;

      try {
        if (
          typeof ubicacionIngreso === "string" &&
          ubicacionIngreso.trim() !== ""
        ) {
          ubicacionIngreso = JSON.parse(ubicacionIngreso);
        }
      } catch (e) {
        console.error("Error al parsear ubicacion_ingreso:", e);
        ubicacionIngreso = {};
      }

      let ubicacionSalida = ubicacion_salida;

      try {
        if (
          typeof ubicacionSalida === "string" &&
          ubicacionSalida.trim() !== ""
        ) {
          ubicacionSalida = JSON.parse(ubicacionSalida);
        }
      } catch (e) {
        console.error("Error al parsear ubicacion_salida:", e);
        ubicacionSalida = {};
      }

      const obra_id_registrada_manhana = ubicacionIngreso?.obra_id;
      const obra_id_registrada_tarde = ubicacionSalida?.obra_id;

      const obrasAplanadas = obras.map((obra) => obra.get()).flat();

      const descripcion_obra_registrada_manhana = obrasAplanadas.find(
        (obra) => obra.obra_id == obra_id_registrada_manhana
      )?.descripcion_tarea;

      const descripcion_obra_registrada_tarde = obrasAplanadas.find(
        (obra) => obra.obra_id == obra_id_registrada_tarde
      )?.descripcion_tarea;

      const jornada_manhana = {
        nombre_obra: ubicacionIngreso?.obra_nombre || "",
        direccion_obra: ubicacionIngreso?.obra_direccion || "",
        descripcion_obra: descripcion_obra_registrada_manhana || "",
      };

      const jornada_tarde = {
        nombre_obra: ubicacionSalida?.obra_nombre || "",
        direccion_obra: ubicacionSalida?.obra_direccion || "",
        descripcion_obra: descripcion_obra_registrada_tarde || "",
      };

      let horas_trabajadas = calcularDiferenciaHorasMinutosSegundos(
        asistencia.hora_ingreso,
        asistencia.hora_salida
      );

     // console.log("Horas trabajadas calculadas:", horas_trabajadas);

      // Detectar que dia del calendario es asistencia.fecha (usando moment)
      const dia = moment(asistencia.fecha).day(); // 6 = sábado

      // 🔹 Total trabajado en minutos (incluye segundos)
      const minutosTrabajados =
        horas_trabajadas.horas * 60 +
        horas_trabajadas.minutos +
        horas_trabajadas.segundos / 60;

      // 🔹 Tope máximo en minutos según el día
      let minutosMaximos;

      if (dia == 6) {
        // Sábado → 5h 30m
        minutosMaximos = CONST_HORA_FIN_SAB - CONST_HORA_INICIO;
      } else {
        // Lunes a viernes → 9h 30m
        minutosMaximos = CONST_HORA_FIN_LV - CONST_HORA_INICIO;
      }

      // 🔹 Si se pasa del tope, capar
      if (minutosTrabajados > minutosMaximos) {
        const horas = Math.floor(minutosMaximos / 60);
        const minutos = minutosMaximos % 60;

        horas_trabajadas.horas = horas;
        horas_trabajadas.minutos = minutos;
        horas_trabajadas.segundos = 0;
      }

      return {
        trabajador: {
          dni: asistencia.usuario.dni,
        },
        asistencia: {
          fecha: asistencia.fecha,
          hora_ingreso: asistencia.hora_ingreso,
          hora_salida: asistencia.hora_salida,
          tiempo_trabajado: horas_trabajadas,
          estado: estado,
          horas_extras: asistencia.horas_extras,
          jornada_manhana: jornada_manhana?.nombre_obra
            ? jornada_manhana
            : null,
          jornada_tarde: jornada_tarde?.nombre_obra ? jornada_tarde : null,
        },
      };
    })
  );

  return listaAsistenciasMapeado;
}

module.exports = { mapearEstadosAsistenciaParaElErp };
