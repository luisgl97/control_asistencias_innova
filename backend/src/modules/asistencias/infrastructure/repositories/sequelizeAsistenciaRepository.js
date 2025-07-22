const { Op } = require("sequelize");
const { Asistencia } = require("../models/asistenciaModel");
const {
  Usuario,
} = require("../../../usuarios/infrastructure/models/usuarioModel");

/*  const { DateTime } = require("luxon"); */

const moment = require("moment");
require("moment/locale/es"); // importa el idioma español
moment.locale("es"); // establece el idioma a español

class SequelizeAsistenciaRepository {
  getModel() {
    return require("../models/asistenciaModel").Asistencia; // Retorna el modelo de asistencia
  }

  async crear(asistenciaData) {
    return await Asistencia.create(asistenciaData);
  }

  async obtenerAsistencias() {
    const asistencias = await Asistencia.findAll();
    return asistencias;
  }

  async obtenerAsistenciasPorUsuario(idUsuario) {
    console.log("idUsuario", idUsuario);

    return await Asistencia.findAll({
      where: { usuario_id: idUsuario },
    });
  }

  async obtenerAsistenciasDelDia(fecha) {
    return await Asistencia.findAll({
      where: { fecha: fecha },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombres", "apellidos"],
        },
      ],
    });
  }

  async actualizarAsistencia(id, asistenciaData) {
    const asistencia = await Asistencia.findByPk(id); // Busca el asistencia por ID
    if (!asistencia) {
      // Si no se encuentra el asistencia, retorna null
      console.log("❌ Asistencia no encontrado");
      return null;
    }

    await asistencia.update(asistenciaData); // Actualiza el asistencia con los nuevos datos
    return asistencia; // Retorna el asistencia actualizado
  }

  // Registra el ingreso del usuario si aún no existe un registro para hoy
  async registrarIngreso(dataIngreso) {
    // Verifica si ya existe una asistencia para la fecha proporcionada
    const yaRegistrado = await Asistencia.findOne({
      where: {
        usuario_id: dataIngreso.usuario_id,
        fecha: dataIngreso.fecha,
      },
    });

    if (yaRegistrado) {
      return {
        success: false,
        message: "Ya existe una asistencia registrada para hoy",
        asistencia: yaRegistrado,
      };
    }

    // Calcular estado_ingreso
    const [hi, mi] = dataIngreso.hora_ingreso.split(":").map(Number);
    const minutosIngreso = hi * 60 + mi;
    /* const estadoIngreso = minutosIngreso <= 450 ? "A_TIEMPO" : "TARDE"; // 450 = 7:30 AM */

    // Si no existe, crea el nuevo registro de ingreso
    const nuevaAsistencia = await Asistencia.create({
      usuario_id: dataIngreso.usuario_id,
      fecha: dataIngreso.fecha,
      hora_ingreso: dataIngreso.hora_ingreso,
      ubicacion_ingreso: dataIngreso.ubicacion_ingreso,
      observacion_ingreso: dataIngreso.observacion_ingreso || null,

      /*       estado_ingreso: estadoIngreso, // ✅ */
    });

    return {
      success: true,
      message: "Ingreso registrado correctamente",
      asistencia: nuevaAsistencia,
    };
  }

  // Registra la salida del usuario y calcula las horas extras si aplica
  async registrarSalida(dataSalida) {
    // Buscar la asistencia de hoy del usuario
    const asistencia = await Asistencia.findOne({
      where: {
        usuario_id: dataSalida.usuario_id,
        fecha: dataSalida.fecha,
      },
    });

    if (!asistencia) {
      return {
        success: false,
        message: "No se encontró asistencia de ingreso para hoy",
      };
    }

    console.log("asistencia", asistencia);

    // Evita registrar doble salida
    if (asistencia.hora_salida) {
      return {
        success: false,
        message: "La salida ya fue registrada",
      };
    }

    // Extraemos la hora de salida en formato string (ej. "17:45")
    const horaSalida = dataSalida.hora_salida;

    // Dividimos el string por ":" para separar hora y minutos, luego los convertimos a números
    const [hs, ms] = horaSalida.split(":").map(Number);

    // Calculamos la cantidad total de minutos desde las 00:00 hasta la hora de salida
    const minutosSalida = hs * 60 + ms;

    // Obtenemos el día actual de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
    const diaSemana = new Date().getDay();

    // Definir horario regular según el día
    const horaLimite = diaSemana === 6 ? 13 * 60 : 17 * 60; // 13:00 sábados, 17:00 otros días

    // Calcular diferencia de tiempo en minutos
    const diferencia = minutosSalida - horaLimite;
    let horasExtras = 0;

    // Si se pasa más de 30 minutos del horario regular, se calcula como horas extras
    if (diferencia >= 30) {
      horasExtras = Math.floor(diferencia / 30) * 0.5; // Cada 30 min = 0.5 hora extra
    }

    // Calcular estado_salida
    /* const estadoSalida = minutosSalida >= horaLimite ? "A_TIEMPO" : "ANTICIPADO"; */

    // Actualizar los campos de salida y horas extras
    await asistencia.update({
      hora_salida: horaSalida,
      ubicacion_salida: dataSalida.ubicacion_salida,
      observacion_salida: dataSalida.observacion_salida || null,
      horas_extras: horasExtras,
      /*   estado_salida: estadoSalida, // ✅ */
    });

    return {
      success: true,
      message: "Salida registrada correctamente",
      asistencia,
    };
  }

  // Obtiene el reporte de asistencias por fecha
  async obtenerReporteAsistencias(fechaInicio, fechaFin) {
    const usuarios = await Usuario.findAll({
      where: {
        rol: "TRABAJADOR", // Filtrar solo usuarios con rol de trabajador
      },
    }); // traer todos los usuarios

    console.log("usuarios", usuarios);

    const asistencias = await Asistencia.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: [
        {
          model: Usuario,
          as: "usuario",
        },
      ],
      order: [["fecha", "ASC"]],
    });

    console.log("asistencias", asistencias);

    const usuariosMap = new Map();

    // Inicializar todos los usuarios en el mapa, incluso si no tienen asistencias
    usuarios.forEach((usuario) => {
      usuariosMap.set(usuario.id, {
        trabajador: `${usuario.nombres} ${usuario.apellidos}`,
        asistenciaPorDia: {},
        asistencias: 0,
        tardanzas: 0,
        faltas: 0,
        observados: 0,
      });
    });

    // Procesar asistencias registradas
    asistencias.forEach((asistencia) => {
      if (!asistencia.usuario) return; // Ignorar si no hay usuario relacionado

      const usuarioId = asistencia.usuario.id;
      const usuarioData = usuariosMap.get(usuarioId);

      if (!usuarioData) return; // Por si acaso no está en el mapa

      const diaSemana = moment(asistencia.fecha)
        .locale("es")
        .format("dddd")
        .toLowerCase();
      const entrada = asistencia.hora_ingreso
        ? moment(asistencia.hora_ingreso, "HH:mm:ss").format("HH:mm")
        : null;
      const salida = asistencia.hora_salida
        ? moment(asistencia.hora_salida, "HH:mm:ss").format("HH:mm")
        : null;

      if (!entrada && !salida) {
        usuarioData.asistenciaPorDia[diaSemana] = "Sin marcar";
        usuarioData.faltas += 1;
      } else if (entrada && !salida) {
        usuarioData.asistenciaPorDia[
          diaSemana
        ] = `${entrada} - No marcado (Observado)`;
        usuarioData.observados += 1;
      } else {
        let label = `${entrada} - ${salida}`;
        if (asistencia.estado_entrada === "Tarde") {
          label += " (Tarde)";
          usuarioData.tardanzas += 1;
        } else {
          usuarioData.asistencias += 1;
        }
        usuarioData.asistenciaPorDia[diaSemana] = label;
      }
    });

    const dias = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const resultado = Array.from(usuariosMap.values()).map((user) => {
      const fila = {
        trabajador: user.trabajador,
        asistencias: user.asistencias,
        tardanzas: user.tardanzas,
        observados: user.observados,
        faltas: user.faltas,
      };

      dias.forEach((dia, index) => {
        const fechaDia = moment(fechaInicio).add(index, "days");
        const hoy = moment();

        if (fechaDia.isAfter(hoy, "day")) {
          fila[dia] = "Pendiente";
        } else {
          fila[dia] = user.asistenciaPorDia[dia] || "Falta";
          if (!user.asistenciaPorDia[dia]) {
            fila.faltas += 1;
          }
        }
      });

      return fila;
    });

    return resultado;
  }
 
  // Verificar asistencia del usuario parar mostrar el boton de ingreso o salida en el frontend
  async verificarAsistenciaDelUsuarioDelDia(usuarioId, fecha) {
    const asistencia = await Asistencia.findOne({
      where: {
        usuario_id: usuarioId,
        fecha: fecha,
      },
    });

    if (!asistencia) {
      return {
        estadoIngreso: false,
        estadoSalida: false,
        mensaje: "No se ha registrado ingreso ni salida",
      };
    }

    if (asistencia.hora_ingreso && !asistencia.hora_salida) {
      return {
        estadoIngreso: true,
        estadoSalida: false,
        mensaje: "Ingreso registrado, falta registrar salida",
      };
    }

    if (asistencia.hora_salida) {
      return {
        estadoIngreso: true,
        estadoSalida: true,
        mensaje: "Ingreso y salida registrados",
      };
    }

    return {
      estadoIngreso: false,
      estadoSalida: false,
      mensaje: "No se ha registrado ingreso ni salida",
    };
  }
}

module.exports = SequelizeAsistenciaRepository;
