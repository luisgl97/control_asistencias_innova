class Usuario { 
    constructor({
        dni, 
        nombres, 
        email, 
        password, 
        rol,
        cargo, 
        filial_id, 
    }) {
        this.dni = dni;
        this.nombres = nombres;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.cargo = cargo;
        this.filial_id = filial_id;
    }

    static validarCamposObligatorios(modo = "crear") {
        if (modo === "crear") {
            if (!this.dni || !this.nombres || !this.email || !this.password || !this.rol || !this.cargo || !this.filial_id) {
                return "Faltan campos obligatorios: dni, nombres, email, password, rol, cargo y filial_id.";
            }

            if (!this.filial_id) {
                return "El campo 'filial_id' es obligatorio al crear una pieza.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["dni", "nombres", "email", "password","rol", "cargo","filial_id"].some(
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

module.exports = Usuario; 