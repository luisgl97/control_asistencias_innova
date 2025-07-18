const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../../domain/entities/usuario");

module.exports = async (datosDeUsuario, usuarioRepository) => {
    const {
        success,
        message
    } = await Usuario.login(datosDeUsuario);
    console.log(success, message, datosDeUsuario);
    if (!success) {
        return {
            codigo: 400,
            respuesta: {
                mensaje: message,
                estado: false,
            },
        };
    }

    const { email, password } = datosDeUsuario;

    const usuario = await usuarioRepository.obtenerPorEmail(email);
    if (!usuario) {
        return {
            codigo: 401,
            respuesta: {
                mensaje: "Credenciales inválidas",
                estado: false,
            },
        };
    }
    if(!usuario.estado){
        return {
            codigo: 401,
            respuesta: {
                mensaje: "El usuario no esta activo",
                estado: false,
            },
        };
    }
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
        return {
            codigo: 401,
            respuesta: { mensaje: "Credenciales inválidas", estado: false },
        };
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "13h" } // El token expirará en 13 horas
    );

    return {
        codigo: 200,
        respuesta: {
            token,
            usuario: {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol,
                cargo: usuario.cargo,
            },
        },
    }; // Retornamos el token y los datos del usuario
};
