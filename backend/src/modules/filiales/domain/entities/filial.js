class Filial {
    constructor({
        ruc,
        razon_social
    }) {
        this.ruc = ruc;
        this.razon_social = razon_social;
    }

    static validarCamposObligatorios(datos, modo = "crear") {

        const { ruc, razon_social } = datos;

        if (modo === "crear") {
            if (!ruc || !razon_social) {
                return "Faltan campos obligatorios: ruc y razon_social.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["ruc", "razon_social"].some(
                (campo) =>
                    datos[campo] !== undefined &&
                    datos[campo] !== null &&
                    datos[campo] !== ""
            );

            if (!tieneAlMenosUnCampoValido) {
                return "Debe proporcionar al menos un campo válido para actualizar.";
            }
        }

        return null;
    }

}

module.exports = Filial; 