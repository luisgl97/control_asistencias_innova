const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importamos la librería jsonwebtoken para generar el token
//const { validarCaptcha } = require('../../../../shared/middlewares/captchaMiddleware'); // Importamos la función de validación del captcha
const Usuario = require("../../domain/entities/usuario"); // Importamos la entidad Usuario

module.exports = async (datoslogin, usuarioRepository ) => {
    const error = Usuario.validarLogin(datoslogin); // Validamos los campos obligatorios
    if (error) return { codigo: 401, respuesta: { mensaje: error } }; // Retornamos el error si hay alguno

    const { email, password } = datoslogin; // Desestructuramos los datos de login

   /*  let captchaValido = false;
    captchaValido = await validarCaptcha(recaptchaToken); // Validamos el captcha
    if (!captchaValido) {
        return { codigo: 403, respuesta: { mensaje: "Captcha inválido" } }; // Retornamos el error si el captcha no es válido
    } */

    const usuario = await usuarioRepository.obtenerPorEmail(email); // Buscamos el usuario por email
    if (!usuario) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si el usuario no existe
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password); // Comparamos la contraseña ingresada con la almacenada en la base de datos
    if (!passwordCorrecta) {
        return { codigo: 401, respuesta: { mensaje: "Credenciales inválidas" } }; // Retornamos el error si la contraseña no es correcta
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET, // Usamos la variable de entorno para la clave secreta del token
        { expiresIn: '8h' } // El token expirará en 8 horas
    )

    return { codigo: 200, respuesta: { token, usuario: { id: usuario.id, nombres: usuario.nombres, apellidos: usuario.apellidos, email: usuario.email, rol: usuario.rol, cargo: usuario.cargo } } }; // Retornamos el token y los datos del usuario

}