class Permiso {
  constructor({
    asistencia_id,
    autorizado_por,
    observacion,
  }) {
    this.asistencia_id = asistencia_id;
    this.autorizado_por = autorizado_por;
    this.observacion = observacion;
  }

  static validarCamposObligatorios(datos, modo = "crear") {
 
    if (modo == "crear") {
      const {
        asistencia_id,
        autorizado_por,
      } = datos;

        
      if (!autorizado_por || !asistencia_id) {

        return {
          success: false,
          message: "Los campos autorizado_por y asistencia_id son requeridos",
        };
      }
    }

    if (modo == "editar") {
        const tieneAlMenosUnCampoValido = [
        "asistencia_id",
        "autorizado_por",
        "observacion",
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

      return {
        success: true,
        message: "Campos validados correctamente",
      };
  }
}

module.exports = Permiso;
