class RegistrosDiarios {
  constructor({ obra_id, usuario_id, asignado_por, fecha, descripcion_tarea }) {
    this.obra_id = obra_id;
    this.usuario_id = usuario_id;
    this.asignado_por = asignado_por;
    this.fecha = fecha;
    this.descripcion_tarea = descripcion_tarea;
  }

  static validarCamposObligatorios(datos, modo = "crear") {
    const { obra_id, usuario_id, asignado_por, fecha } = datos;

    if (modo === "crear") {
      if (!obra_id || !usuario_id || !asignado_por || !fecha) {
        return {
          success: false,
          message:
            "Faltan campos obligatorios: obra, usuario, asignado por y/o fecha",
        };
      }
    }

    if (modo === "editar") {
      const tieneAlMenosUnCampoValido = [
        "obra_id",
        "usuario_id",
        "asignado_por",
        "fecha",
      ].some(
        (campo) =>
          datos[campo] !== undefined &&
          datos[campo] !== null &&
          datos[campo] !== ""
      );

      if (!tieneAlMenosUnCampoValido) {
         return {
          success: false,
          message:
            "Debe proporcionar al menos un campo válido para actualizar.",
        };
      }
    }

     return {
        success: true,
        message: "Campos validados correctamente",
      };
  }
}

module.exports = RegistrosDiarios;
