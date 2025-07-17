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

    static async login(props) {
        const camposRequeridos = [
            "email",
            "password",
        ];
        for (const campo of camposRequeridos) {
            if (!props[campo]) {
                return {
                    success: false,
                    message: `El campo ${campo} es requerido`,
                    usuario: null
                }
            }
        }
        return {
            success: true,
            message: "Login exitoso",
            usuario: new Usuario(props),
        }
    }
}


module.exports = Usuario;
