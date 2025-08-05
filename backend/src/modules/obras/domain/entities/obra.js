class Obra {
  constructor({ nombre, direccion, latitud, longitud }) {
    this.nombre = nombre;
    this.direccion = direccion;
    this.latitud = latitud;
    this.longitud = longitud;
  }

  static validarCamposObligatorios(datos, modo = "crear") {
    const { nombre, direccion, latitud, longitud } = datos;

    if (modo === "crear") {
      if (!nombre || !direccion || !latitud || !longitud) {
        return {
          success: false,
          message:
            "Faltan campos obligatorios: nombre, direccion, latitud y/o longitud",
        };
      }
    }

    if (modo === "editar") {
      const tieneAlMenosUnCampoValido = [
        "nombre",
        "direccion",
        "latitud",
        "longitud",
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

module.exports = Obra;
