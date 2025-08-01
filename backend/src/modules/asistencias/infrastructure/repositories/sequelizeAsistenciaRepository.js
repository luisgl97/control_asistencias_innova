const { Op } = require("sequelize");
const { Asistencia } = require("../models/asistenciaModel");
const {
  Usuario,
} = require("../../../usuarios/infrastructure/models/usuarioModel");
const db = require("../../../../models");

const moment = require("moment");
const { CONST_HORA_INICIO, CONST_HORA_FIN_LV, CONST_HORA_FIN_SAB } = require("../../../../constants/horarios");
const { CONST_FERIADOS_PERU } = require("../../../../constants/feriadosPeru");
require("moment/locale/es"); // importa el idioma español
moment.locale("es"); // establece el idioma a español

const ESTADO_PRESENTE = "PRESENTE";
const ESTADO_FALTA_JUSTIFICADA = "FALTA JUSTIFICADA";
const ESTADO_TARDANZA = "TARDANZA";
const ESTADO_SALIDA_ANTICIPADA = "SALIDA ANTICIPADA";
const ESTADO_ASISTIO = "ASISTIO";
const ESTADO_ASISTIO_TARDE = "ASISTIO TARDE";

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

  async obtenerAsistenciaPorId(id) {
    const asistencia = await Asistencia.findByPk(id);
    return asistencia;
  }

  async obtenerAsistenciasPorUsuario(idUsuario, fecha_inicio, fecha_fin) {
    
    return await Asistencia.findAll({
      where: {
        usuario_id: idUsuario,
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin],
        },
      },
    });
  }

  async obtenerAsistenciasDelDia(fecha) {
    // Obtener fecha actual en Lima para comparar
    const hoy = moment().tz("America/Lima").format("YYYY-MM-DD");

    const usuarios = await Usuario.findAll({
      where: {
        rol: ["TRABAJADOR", "LIDER TRABAJADOR"],
        estado: true
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.asistencias,
          as: "asistencias",
          required: false, // LEFT JOIN
          where: { fecha },
        },
      ],
    });

    const listado = usuarios.map((usuario) => {
      const asistencia = usuario.asistencias[0];

      // ⚙️ Decidir estado según si hay o no asistencia
      let estadoFinal = asistencia?.estado;

      if (!asistencia) {
        estadoFinal = fecha < hoy ? "FALTA" : "SIN REGISTRO";
      }

      return {
        id: usuario.id,
        asistencia_id: asistencia?.id || null,
        trabajador: `${usuario.nombres} ${usuario.apellidos}`,
        dni: usuario.dni,
        fecha: fecha,
        hora_ingreso: asistencia?.hora_ingreso || "--",
        hora_salida: asistencia?.hora_salida || "--",
        hora_inicio_refrigerio: asistencia?.hora_inicio_refrigerio || "--",
        hora_fin_refrigerio: asistencia?.hora_fin_refrigerio || "--",
        estado: estadoFinal,
        horas_extras: asistencia?.horas_extras ?? "--",
        hizo_horas_extras: asistencia?.hizo_horas_extras ?? false,
      };
    });

    return listado;
  }

  async actualizarAsistencia(id, asistenciaData) {
    const asistencia = await Asistencia.findByPk(id); // Busca el asistencia por ID
    if (!asistencia) {
      // Si no se encuentra el asistencia, retorna null
      //console.log("❌ Asistencia no encontrado");
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

    // Calcular estado de ingreso según la hora
    const [hi, mi] = dataIngreso.hora_ingreso.split(":").map(Number);
    const minutosIngreso = hi * 60 + mi;
    const toleranciaMinutos = 466; // 7:46 AM (466 minutos = 7h × 60 + 46m.)

    const estado =
      minutosIngreso < toleranciaMinutos ? ESTADO_PRESENTE : ESTADO_TARDANZA;

    // Si no existe, crea el nuevo registro de ingreso
    const nuevaAsistencia = await Asistencia.create({
      usuario_id: dataIngreso.usuario_id,
      fecha: dataIngreso.fecha,
      hora_ingreso: dataIngreso.hora_ingreso,
      ubicacion_ingreso: dataIngreso.ubicacion_ingreso,
      estado: estado,
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

    // Evita registrar doble salida
    if (asistencia.hora_salida) {
      return {
        success: false,
        message: "La salida ya fue registrada",
      };
    }

    let horasExtras = 0;

      // Extraemos la hora de salida en formato string (ej. "17:45")
      const horaSalida = dataSalida?.hora_salida;

      // Dividimos el string por ":" para separar hora y minutos, luego los convertimos a números
      const [hs, ms] = horaSalida.split(":").map(Number);

      // Calculamos la cantidad total de minutos desde las 00:00 hasta la hora de salida
      const minutosSalida = hs * 60 + ms;

      // Usa el día de la fecha de la asistencia, no el 'hoy' del servidor
      const diaSemana = moment
        .tz(asistencia.fecha, "YYYY-MM-DD", "America/Lima")
        .day(); // 0=domingo, 6=sábado

      // Jornada definida por la empresa
      const HORA_INICIO = CONST_HORA_INICIO; // 07:30
      const HORA_FIN_LV = CONST_HORA_FIN_LV; // 17:00
      const HORA_FIN_SAB = CONST_HORA_FIN_SAB; // 13:00
      const horaLimite = diaSemana === 6 ? HORA_FIN_SAB : HORA_FIN_LV;
      const minutosMinimos = horaLimite - HORA_INICIO; // 9.5h (570) L–V, 5.5h (330) sáb

    if (asistencia.hizo_horas_extras) {
    

      // Verifica que la hora de ingreso exista antes de calcular
      if (asistencia.hora_ingreso) {
        // Divide la hora de ingreso en horas y minutos, y convierte a números
        const [hIn, mIn] = asistencia.hora_ingreso.split(":").map(Number);

        // Convierte la hora de ingreso a minutos totales desde las 00:00
        const minutosIngreso = hIn * 60 + mIn;

        // 👇 Clave: si ingresó antes de la hora de inicio, cuenta desde la hora de inicio
        const minutosInicioEfectivo = Math.max(minutosIngreso, HORA_INICIO);

        const minutosTrabajados = minutosSalida - minutosInicioEfectivo;

        // Solo se consideran horas extras si se cumplió el mínimo de jornada laboral
        if (minutosTrabajados >= minutosMinimos) {
          // Calcula cuántos minutos trabajó después de la hora de salida normal
          const diferencia = minutosTrabajados - minutosMinimos;

          // Si se pasó al menos 30 minutos del límite, se computan como horas extras
          if (diferencia >= 30) {
            // Cada bloque de 30 minutos se cuenta como 0.5 horas extras
            horasExtras = Math.floor(diferencia / 30) * 0.5;
          }
        }
      }
    }

    // Calcular estado_salida

    let estadoSalida = ESTADO_ASISTIO;

    if (minutosSalida >= horaLimite) {
      if (asistencia.estado === ESTADO_TARDANZA) {
        estadoSalida = ESTADO_ASISTIO_TARDE;
      } else if (asistencia.estado === ESTADO_PRESENTE) {
        estadoSalida = ESTADO_ASISTIO;
      }
    } else {
      /* estadoSalida = ESTADO_SALIDA_ANTICIPADA; */
      return {
        success: false,
        message: "Aún no es la hora de salida.",
        asistencia,
      };
    }

    // Actualizar los campos de salida y horas extras
    await asistencia.update({
      hora_salida: horaSalida,
      ubicacion_salida: dataSalida.ubicacion_salida,
      observacion_salida: dataSalida.observacion_salida || null,
      estado: estadoSalida,
      horas_extras: horasExtras,
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
        rol: ["TRABAJADOR", "LIDER TRABAJADOR"],
      },
    });

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

    const usuariosMap = new Map();

    // Inicializar estructura por usuario
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

    // Procesar cada asistencia según su estado
    asistencias.forEach((asistencia) => {
      if (!asistencia.usuario) return;

      const usuarioId = asistencia.usuario.id;
      const usuarioData = usuariosMap.get(usuarioId);
      if (!usuarioData) return;

      const fechaKey = moment(asistencia.fecha)
        .tz("America/Lima")
        .format("YYYY-MM-DD");

      const entrada = asistencia.hora_ingreso
        ? moment(asistencia.hora_ingreso, "HH:mm:ss").format("HH:mm")
        : "-";
      const salida = asistencia.hora_salida
        ? moment(asistencia.hora_salida, "HH:mm:ss").format("HH:mm")
        : "-";

      const label = `${entrada} - ${salida}`;

      switch (asistencia.estado) {
        case "PRESENTE":
          usuarioData.asistenciaPorDia[fechaKey] = `${label}`;
          usuarioData.observados += 1;
          break;
        case "ASISTIO":
          usuarioData.asistenciaPorDia[fechaKey] = `${label} ✅`;
          usuarioData.asistencias += 1;
          break;

        case "TARDANZA":
        case "ASISTIO TARDE":

          usuarioData.asistenciaPorDia[fechaKey] = `${label} 🕒 (Tarde)`;
          usuarioData.tardanzas += 1;
          break;

        case "SALIDA ANTICIPADA":
          usuarioData.asistenciaPorDia[
            fechaKey
          ] = `${label} ⚠️ (Salida anticipada)`;

          // Calcular estado de ingreso según la hora
          const [hi, mi] = asistencia.hora_ingreso.split(":").map(Number);
          const minutosIngreso = hi * 60 + mi;
          const toleranciaMinutos = 466; // 7:46 AM (466 minutos = 7h × 60 + 46m.)

          const estado =
            minutosIngreso < toleranciaMinutos
              ? ESTADO_PRESENTE
              : ESTADO_TARDANZA;

          if (estado == ESTADO_PRESENTE) {
            usuarioData.asistencias += 1;
          }
          if (estado == ESTADO_TARDANZA) {
            usuarioData.tardanzas += 1;
          }
          break;

        case "FALTA JUSTIFICADA":

          usuarioData.asistenciaPorDia[fechaKey] = "📄 Falta Justificada";
          usuarioData.faltas += 1;
          break;

        default:
          usuarioData.asistenciaPorDia[fechaKey] = "🚫 Sin registro";
          usuarioData.faltas += 1;
          break;
      }
    });

    // Generar solo días hábiles en el rango: lunes a sábado
    const diasDelRango = [];
    let fechaCursor = moment(fechaInicio).tz("America/Lima");
    const fechaFinMoment = moment(fechaFin).tz("America/Lima");

    // Iterar desde la fecha de inicio hasta la fecha de fin
    while (fechaCursor.isSameOrBefore(fechaFinMoment, "day")) {
      const diaNumero = fechaCursor.day(); // 0 = domingo, 6 = sábado
      const fechaFormateada = fechaCursor.format("YYYY-MM-DD")

      if (diaNumero !== 0 && !CONST_FERIADOS_PERU.includes(fechaFormateada)) {
        // Excluir domingos
        diasDelRango.push({
          diaSemana: fechaCursor
            .clone()
            .tz("America/Lima")
            .locale("es")
            .format("dddd")
            .toLowerCase(),
          fecha: fechaCursor.clone().tz("America/Lima").format("YYYY-MM-DD"),
          fechaBonita: fechaCursor
            .clone()
            .tz("America/Lima")
            .format("DD-MM-YYYY"),
        });
      }
      fechaCursor = fechaCursor.add(1, "day");
    }

    // Convertir el mapa a un array de objetos para el resultado final
    // Cada objeto contendrá el nombre del trabajador y sus asistencias por día
    // y los totales de asistencias, tardanzas, observados y faltas
    // Además, se agregan los días del rango con su estado correspondiente
    const resultado = Array.from(usuariosMap.values()).map((user) => {
      const fila = {
        trabajador: user.trabajador,
        asistencias: user.asistencias,
        tardanzas: user.tardanzas,
        observados: user.observados,
        faltas: user.faltas,
      };

      diasDelRango.forEach(({ diaSemana, fecha, fechaBonita }) => {
        // ✅ Fecha de hoy en Perú
        const hoy = moment().tz("America/Lima").format("YYYY-MM-DD");

        if (fecha > hoy) {
          fila[`${diaSemana} (${fechaBonita})`] = "Pendiente";
        } else {
          fila[`${diaSemana} (${fechaBonita})`] =
            user.asistenciaPorDia[fecha] || "Falta";
          if (!user.asistenciaPorDia[fecha]) {
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

    const faltaJustificada =
      asistencia && asistencia.estado === ESTADO_FALTA_JUSTIFICADA;

    if (!asistencia) {
      return {
        ingreso: {
          fecha: null,
          estado: false,
          hora: null,
        },
        salida: {
          fecha: null,
          estado: false,
          hora: null,
        },
        hora_inicio_refrigerio: null,
        hora_fin_refrigerio: null,
        asistencia_id: null,
        falta_justificada: faltaJustificada,
        mensaje: "No se ha registrado ingreso ni salida",
      };
    }

    if (asistencia.hora_ingreso && !asistencia.hora_salida) {
      return {
        ingreso: {
          fecha: asistencia.fecha,
          estado: true,
          hora: asistencia.hora_ingreso,
        },
        salida: {
          fecha: null,
          estado: false,
          hora: null,
        },
        hora_inicio_refrigerio: asistencia.hora_inicio_refrigerio,
        hora_fin_refrigerio: asistencia.hora_fin_refrigerio,
        asistencia_id: asistencia.id,
        falta_justificada: faltaJustificada,
        mensaje: "Ingreso registrado, falta registrar salida",
      };
    }

    if (asistencia.hora_salida) {
      return {
        ingreso: {
          fecha: asistencia.fecha,
          estado: true,
          hora: asistencia.hora_ingreso,
        },
        salida: {
          fecha: asistencia.fecha,
          estado: true,
          hora: asistencia.hora_salida,
        },
        hora_inicio_refrigerio: asistencia.hora_inicio_refrigerio,
        hora_fin_refrigerio: asistencia.hora_fin_refrigerio,
        asistencia_id: asistencia.id,
        falta_justificada: faltaJustificada,
        mensaje: "Ingreso y salida registrados",
      };
    }

    return {
      ingreso: {
        fecha: null,
        estado: false,
        hora: null,
      },
      salida: {
        fecha: null,
        estado: false,
        hora: null,
      },
      hora_inicio_refrigerio: asistencia.hora_inicio_refrigerio,
      hora_fin_refrigerio: asistencia.hora_fin_refrigerio,
      asistencia_id: asistencia.id,
      falta_justificada: faltaJustificada,
      mensaje: "No se ha registrado ingreso ni salida",
    };
  }

  async obtenerAsistenciaPorUsuarioYFecha(usuarioId, fecha) {
    return await Asistencia.findOne({
      where: {
        usuario_id: usuarioId,
        fecha: fecha,
      },
    });
  }

  // Autorizar horas extras
  async autorizarHorasExtras(asistenciaId) {
    const asistencia = await Asistencia.findByPk(asistenciaId);
    if (!asistencia) {
      return {
        success: false,
        message: "Asistencia no encontrada",
      };
    }

    if (!asistencia.hora_salida) {
      // Actualizar las horas extras
      asistencia.hizo_horas_extras = true;
      await asistencia.save();
      return {
        success: true,
        message: "Horas extras autorizadas correctamente",
      };
    }

    // Extraemos la hora de salida en formato string (ej. "17:45")
    const horaSalida = asistencia?.hora_salida;

    // Dividimos el string por ":" para separar hora y minutos, luego los convertimos a números
    const [hs, ms] = horaSalida.split(":").map(Number);

    // Calculamos la cantidad total de minutos desde las 00:00 hasta la hora de salida
    const minutosSalida = hs * 60 + ms;

    // Usa el día de la fecha de la asistencia, no el 'hoy' del servidor
    const diaSemana = moment
      .tz(asistencia.fecha, "YYYY-MM-DD", "America/Lima")
      .day(); // 0=domingo, 6=sábado

    // Jornada definida por la empresa
    const HORA_INICIO = CONST_HORA_INICIO // 07:30
    const HORA_FIN_LV = CONST_HORA_FIN_LV; // 17:00
    const HORA_FIN_SAB = CONST_HORA_FIN_SAB; // 13:00
    const horaLimite = diaSemana === 6 ? HORA_FIN_SAB : HORA_FIN_LV;
    const minutosMinimos = horaLimite - HORA_INICIO; // 9.5h (570) L–V, 5.5h (330) sáb

    let horasExtras = 0;

    // Verifica que la hora de ingreso exista antes de calcular
    if (asistencia.hora_ingreso) {
      // Divide la hora de ingreso en horas y minutos, y convierte a números
      const [hIn, mIn] = asistencia.hora_ingreso.split(":").map(Number);

      // Convierte la hora de ingreso a minutos totales desde las 00:00
      const minutosIngreso = hIn * 60 + mIn;

      // 👇 Clave: si ingresó antes de la hora de inicio, cuenta desde la hora de inicio
      const minutosInicioEfectivo = Math.max(minutosIngreso, HORA_INICIO);

      const minutosTrabajados = minutosSalida - minutosInicioEfectivo;

      // Solo se consideran horas extras si se cumplió el mínimo de jornada laboral
      if (minutosTrabajados >= minutosMinimos) {
        // Calcula cuántos minutos trabajó después de la hora de salida normal
        const diferencia = minutosTrabajados - minutosMinimos;

        // Si se pasó al menos 30 minutos del límite, se computan como horas extras
        if (diferencia >= 30) {
          // Cada bloque de 30 minutos se cuenta como 0.5 horas extras
          horasExtras = Math.floor(diferencia / 30) * 0.5;
        }
      }
    }

    // Actualizar las horas extras
    asistencia.horas_extras = horasExtras;
    asistencia.hizo_horas_extras = true; // Marcar que se autorizaron horas extras
    await asistencia.save();

    return {
      success: true,
      message: "Horas extras autorizadas correctamente",
      asistencia,
    };
  }

  // Obtener mapa de ubicaciones de ingreso y salida
  async obtenerMapaUbicaciones(fecha) {
    
    const asistencias = await Asistencia.findAll({
      where: {
        fecha: fecha,
      },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombres", "apellidos", "dni"],
        },
      ],
    })

    const ubicaciones = asistencias.length > 0 && asistencias.map((asistencia) => {
      return {
        usuario_id: asistencia.usuario.id,
        trabajador: `${asistencia.usuario.nombres} ${asistencia.usuario.apellidos}`,
        dni: asistencia.usuario.dni,
        ubicacion_ingreso: asistencia.ubicacion_ingreso,
        ubicacion_salida: asistencia.ubicacion_salida,
      };
    })

    return ubicaciones || [];
  }
}

module.exports = SequelizeAsistenciaRepository;
