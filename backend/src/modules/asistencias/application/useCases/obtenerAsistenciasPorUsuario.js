const moment = require("moment");
const { CONST_FERIADOS_PERU } = require("../../../../constants/feriadosPeru");

module.exports = async (idUsuario, fecha_inicio, fecha_fin, asistenciaRepository, usuarioRepository) => {
   
    const usuario = await usuarioRepository.obtenerPorId(idUsuario);
    if (!usuario) {
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Usuario no encontrado",
                estado: false,
            },
        };
    }

    const asistenciasDelUsuario = await asistenciaRepository.obtenerAsistenciasPorUsuario(idUsuario, fecha_inicio, fecha_fin);

  let asistencias = 0;
  let tardanzas = 0;
  let observados = 0;
  let faltas = 0;

  const listado = asistenciasDelUsuario.map((asistencia) => {
    const estado = asistencia.estado;

    switch (estado) {
      case "ASISTIO":
      case "SALIDA ANTICIPADA":
      case "TARDANZA JUSTIFICADA":
        asistencias += 1;
        break;
      case "ASISTIO TARDE":
      case "TARDANZA":
        tardanzas += 1;
        break;
      case "PRESENTE":
        observados += 1;
        break;
      case "FALTA JUSTIFICADA":
        observados += 1;
        break;
      default:
        // Si tiene estado desconocido, también lo puedes contar como falta u observado
        faltas += 1;
        break;
    }

    return {
      id: asistencia.id || "",
      fecha: asistencia.fecha || "",
      hora_ingreso: asistencia.hora_ingreso || "",
      hora_salida: asistencia.hora_salida || "",
      hora_inicio_refrigerio: asistencia.hora_inicio_refrigerio || "",
      hora_fin_refrigerio: asistencia.hora_fin_refrigerio || "",
      ubicacion_ingreso: asistencia.ubicacion_ingreso?.direccion || "",
      ubicacion_salida: asistencia.ubicacion_salida?.direccion || "",
      horas_extras: asistencia.horas_extras,
      estado: asistencia.estado,
    };
  });

  const resumen = {
    asistencias,
    tardanzas,
    observados,
    faltas,
  };

  // 2. Crear un mapa por fecha para acceder rápido
  const mapaAsistencias = new Map();
  listado.forEach((a) => {
    mapaAsistencias.set(a.fecha, a);
  });

  // 3. Generar todas las fechas lunes a sábado
  const fechas = [];
  let cursor = moment(fecha_inicio);
  const fin = moment(fecha_fin);

  while (cursor.isSameOrBefore(fin, "day")) {
    const dia = cursor.day(); // 0 = domingo, 6 = sábado
  const fechaStr = cursor.format("YYYY-MM-DD");

  const esHabil = dia >= 1 && dia <= 6; // Lunes a sábado
  const esFeriado = CONST_FERIADOS_PERU.includes(fechaStr);

  if (esHabil && !esFeriado) {
    fechas.push(fechaStr);
  }
    cursor = cursor.add(1, "day");
  }

  // 4. Armar la lista completa con o sin asistencia
  const listadoAsistenciaDelUsuario = fechas.map((fecha) => {
    const asistencia = mapaAsistencias.get(fecha);
    if (asistencia) {
      return {
        fecha,
        hora_ingreso: asistencia.hora_ingreso,
        hora_salida: asistencia.hora_salida,
        hora_inicio_refrigerio: asistencia.hora_inicio_refrigerio,
        hora_fin_refrigerio: asistencia.hora_fin_refrigerio,
        estado: asistencia.estado,
        ubicacion_ingreso: asistencia.ubicacion_ingreso?.direccion || null,
        ubicacion_salida: asistencia.ubicacion_salida?.direccion || null,
        horas_extras: asistencia.horas_extras,
      };
    } else {
      return {
        fecha,
        estado: "SIN REGISTRO",
        hora_ingreso: null,
        hora_salida: null,
        hora_inicio_refrigerio: null,
        hora_fin_refrigerio: null,
        ubicacion_ingreso: null,
        ubicacion_salida: null,
        horas_extras: 0,
      };
    }
  });


    const respuesta = {
        usuario: {
            id: usuario.id,
            tipo_documento: usuario.tipo_documento,
            dni: usuario.dni,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.rol,
            cargo: usuario.cargo,
            filial_ruc: usuario.filial.ruc,
            filial_razon_social: usuario.filial.razon_social
        },
        asistencias: listadoAsistenciaDelUsuario,
        resumen
    }

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistenciasDelUsuario.length==0 ? "Sin asistencias" :"Listado de asistencias del usuario",
            estado: true,
            datos: respuesta,
        },
    };
};
