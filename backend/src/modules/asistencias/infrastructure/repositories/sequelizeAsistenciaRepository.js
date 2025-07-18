const { Asistencia } = require("../models/asistenciaModel");

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

    console.log('idUsuario', idUsuario);

    return await Asistencia.findAll({
      where: { usuario_id: idUsuario },
      }) ;
  }

  async obtenerAsistenciasDelDia(fecha){
    return await Asistencia.findAll({
      where: { fecha: fecha },
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

    // Si no existe, crea el nuevo registro de ingreso
    const nuevaAsistencia = await Asistencia.create({
      usuario_id: dataIngreso.usuario_id,
      fecha: dataIngreso.fecha,
      hora_ingreso: dataIngreso.hora_ingreso,
      ubicacion_ingreso: dataIngreso.ubicacion_ingreso,
      observacion_ingreso: dataIngreso.observacion_ingreso || null,
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
    // Actualizar los campos de salida y horas extras
    await asistencia.update({
      hora_salida: horaSalida,
      ubicacion_salida: dataSalida.ubicacion_salida,
      observacion_salida: dataSalida.observacion_salida || null,
      horas_extras: horasExtras,
    });

    return {
      success: true,
      message: "Salida registrada correctamente",
      asistencia,
    };
  }
}

module.exports = SequelizeAsistenciaRepository;
