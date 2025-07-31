const moment = require("moment");

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
        faltas += 1;
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
    if (dia >= 1 && dia <= 6) {
      fechas.push(cursor.format("YYYY-MM-DD"));
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
        ubicacion_ingreso: null,
        ubicacion_salida: null,
        horas_extras: 0,
      };
    }
  });


    const respuesta = {
        usuario: {
            id: usuario.id,
            dni: usuario.dni,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.rol,
            cargo: usuario.cargo,
        },
        asistencias: listadoAsistenciaDelUsuario,
        resumen
    }
    console.log("*****************************")
    console.log("Informacion del usuario:");
    console.log("Nombres y apellidos:", usuario.nombres, usuario.apellidos);
    console.log("Rol:", usuario.rol);

    console.table(listadoAsistenciaDelUsuario)
    console.log("Resumen de asistencias:");
    console.log("Total de asistencias:", resumen.asistencias);
    console.log("Total de tardanzas:", resumen.tardanzas);
    console.log("Total de observados:", resumen.observados);
    console.log("Total de faltas:", resumen.faltas);

    return {
        codigo: 200,
        respuesta: {
            mensaje: asistenciasDelUsuario.length==0 ? "Sin asistencias" :"Listado de asistencias del usuario",
            estado: true,
            datos: respuesta,
        },
    };
};
