class Usuario {
    constructor({
        dni,
        nombres,
        apellidos,
        email,
        password,
        rol,
        cargo,
        filial_id,
    }) {
        this.dni = dni;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.cargo = cargo;
        this.filial_id = filial_id;
    }

    static validarCamposObligatorios(modo = "crear") {
        if (modo === "crear") {
            if (
                !this.dni ||
                !this.nombres ||
                !this.apellidos ||
                !this.email ||
                !this.password ||
                !this.rol ||
                !this.cargo ||
                !this.filial_id
            ) {
                return "Faltan campos obligatorios: dni, nombres, apellidos, email, password, rol, cargo y filial_id.";
            }

            if (!this.filial_id) {
                return "La filial es obligatoria al registrar un usuario.";
            }
        }

        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = [
                "dni",
                "nombres",
                "apellidos",
                "email",
                "password",
                "rol",
                "cargo",
                "filial_id",
            ].some(
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

    static crear(props) {
        const camposRequeridos = [
            "dni",
            "nombres",
            "apellidos",
            "email",
            "password",
            "rol",
            "cargo",
            // "filial_id",
        ];
        for (const campo of camposRequeridos) {
            if (!props[campo]) {
                return {
                    success: false,
                    message: `El campo ${campo} es requerido`,
                    usuario: null
                }
                // [false, `El campo ${campo} es requerido`, null];
            }
        }
        return {
            success: true,
            message: "Todos los campos correctos",
            usuario: new Usuario(props),
        };
    }

    static editar(props) {
        const camposValidos = {
            dni: Number(props.dni),
            nombres: String(props.nombres),
            apellidos: String(props.apellidos),
            email: String(props.email),
            // password: props.password,
            rol: String(props.rol),
            cargo: String(props.cargo),
            filial_id: String(props.filial_id),
        }
        return {
            success: true,
            message: "No hay campos requeridos",
            usuario: new Usuario(props),
        };
    }
}


module.exports = Usuario;
