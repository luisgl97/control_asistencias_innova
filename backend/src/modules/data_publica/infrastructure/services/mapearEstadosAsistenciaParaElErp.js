const db = require("../../../../models");

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
          estado = "permiso";
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
          ubicacionIngreso = JSON.parse(
            ubicacionIngreso
          );
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
          ubicacionSalida = JSON.parse(
            ubicacionSalida
          );
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

      const obrasMapeadas = obras.map((obra) => {
        return {
          nombre: obra.obra.nombre,
          direccion: obra.obra.direccion,
        };
      });
      return {
        trabajador: {
          dni: asistencia.usuario.dni,
        },
        asistencia: {
          fecha: asistencia.fecha,
          estado: estado,
          horas_extras: asistencia.horas_extras,
          jornada_manhana: jornada_manhana?.nombre_obra ? jornada_manhana : null,
          jornada_tarde: jornada_tarde?.nombre_obra ? jornada_tarde : null,
        },
      };
    })
  );

  return listaAsistenciasMapeado;
}

module.exports = { mapearEstadosAsistenciaParaElErp };
