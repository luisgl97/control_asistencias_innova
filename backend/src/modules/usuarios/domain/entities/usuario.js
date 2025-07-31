class Usuario {
  constructor({
    tipo_documento,
    dni,
    nombres,
    apellidos,
    email,
    password,
    rol,
    cargo,
    estado,
    filial_id,
  }) {
    this.tipo_documento = tipo_documento;
    this.dni = dni;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.cargo = cargo;
    this.estado = estado;
    this.filial_id = filial_id;
  }

  static validarCamposObligatorios(datos, modo = "crear") {

    if(modo === "crear") {
     const { dni, nombres, apellidos, email, password, rol } = datos;

    if (!dni || !nombres || !apellidos || !email || !password || !rol ) {
      return {
        success: false,
        message:
          "Los campos dni, nombres, apellidos, email, password y rol son requeridos",
      };
    }

    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPassword.test(password)) {
      return {
        success: false,
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      };
    }

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (!regexNombre.test(nombres) && !regexNombre.test(apellidos)) {
      return {
        success: false,
        message: "Nombres y apellidos solo debe contener letras",
      };
    }

    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      return { success: false, message: "Formato de correo inválido" };
    }

    const rolesPermitidos = ["GERENTE", "ADMINISTRADOR", "TRABAJADOR", "LIDER TRABAJADOR"];

    if (!rolesPermitidos.includes(rol)) {
      return { success: false, message: "Rol no permitido" };
    }

    return {
      success: true,
      message: "Todos los campos correctos",
      //usuario: new Usuario(datos),
    };
    }
    
    if (modo === "editar") {

      const tieneAlMenosUnCampoValido = [
        "tipo_documento",
        "dni",
        "nombres",
        "apellidos",
        "email",
        "rol",
        "cargo",
        "estado",
        "filial_id",
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
        //usuario: new Usuario(datos),
      };
    }
   
  }

  static login(datos) {
    
    const { email, password } = datos;
    
     if (!email || !password) {
          return {
            success: false,
            message: "Ingresar correo y/o contraseña",
          };
        }
      
        const regexEmail = /\S+@\S+\.\S+/;
        if (!regexEmail.test(email)) {
          return {
            success: false,
            message: "Formato de correo inválido",
          };
        }

    return {
      success: true,
      message: "Login exitoso",
     // usuario: new Usuario(datos),
    };
  }
}

module.exports = Usuario;
