class Asistencia {
  constructor({
    usuario_id,
    fecha,
    hora_ingreso,
    hora_salida,
    ubicacion_ingreso,
    ubicacion_salida,
    horas_extras,
    observaciones_ingreso,
    observaciones_salida,
  }) {
    this.usuario_id = usuario_id;
    this.fecha = fecha;
    this.hora_ingreso = hora_ingreso;
    this.hora_salida = hora_salida;
    this.ubicacion_ingreso = ubicacion_ingreso;
    this.ubicacion_salida = ubicacion_salida;
    this.horas_extras = horas_extras;
    this.observaciones_ingreso = observaciones_ingreso;
    this.observaciones_salida = observaciones_salida;
  }

  static validarCamposObligatorios(datos, modo = "crear") {
    if (modo == "crear") {
      const {
        usuario_id,
        fecha,
      } = datos;

      if (!usuario_id) {
        return {
          success: false,
          message: "El usuario es requerido",
        };
      }

      if (!fecha) {
        return {
          success: false,
          message: "La fecha es requerida",
        };
      }
    }

    if (modo == "editar") {
        const tieneAlMenosUnCampoValido = [
        "usuario_id",
        "fecha",
        "hora_ingreso",
        "hora_salida",
        "ubicacion_ingreso",
        "ubicacion_salida",
        "horas_extras",
        "observaciones_ingreso",
        "observaciones_salida",
      ].some(
        (campo) =>
          datos[campo] !== undefined &&
          datos[campo] !== null &&
          datos[campo] !== ""
      );

      if (!tieneAlMenosUnCampoValido) {
        return {
          success: false,
          message: "Debe proporcionar al menos un campo válido para actualizar.",
        };
      }

      return {
        success: true,
        message: "No hay campos requeridos",
      };
    
    }
  }

  static validarRegistroIngreso(datos){
    const { usuario_id, fecha, hora_ingreso } = datos;
    
    // Concatenerar los campos requeridos
    if (!usuario_id || !fecha || !hora_ingreso) {
      return {
        success: false,
        message: "Los campos usuario_id, fecha y hora_ingreso son requeridos",
      };
    }

    return {
      success: true,
      message: "Validación de registro de ingreso exitosa",
    };
  }

   static validarRegistroSalida(datos) {
    const { usuario_id, fecha, hora_salida } = datos;

    // Concatenerar los campos requeridos
    if (!usuario_id || !fecha || !hora_salida) {
      return {
        success: false,
        message: "Los campos usuario_id, fecha y hora_salida son requeridos",
      };
    }
    
    return {
      success: true,
      message: "Validación de registro de salida exitosa",
    };
  }
}

module.exports = Asistencia;
