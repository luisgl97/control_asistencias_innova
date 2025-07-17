const Usuario = require("../../domain/entities/usuario");

module.exports = async (id, usuarioData, usuarioRepository) => {
    const usuarioExistente = await usuarioRepository.obtenerPorId(id);

    // ?Verificar si el usuario existe
    if (!usuarioExistente) {
        return {
            codigo: 404,
            respuesta: {
                mensaje: "Usuario no encontrado",
                usuario: null,
                estado: false,
            },
        };
    }

    // ?Verificar si los campos son correctos
    const {
        success,
        message: errorCampos,
        usuario,
    } = Usuario.editar(usuarioData);

    if (!success) {
        return {
            codigo: 400, respuesta: {
                mensaje: errorCampos,
                estado: false
            }
        };
    }

    //? Verificar si el correo ya está en uso
    const usuarioExistentePorEmail = await usuarioRepository.obtenerPorEmail(
        usuarioData.email
    );

    //? Verificar si el nuevo email ya ha sido registrado en otro usuario
    if (usuarioExistentePorEmail && id != usuarioExistentePorEmail.id) {
        return {
            codigo: 400,
            respuesta: {
                mensaje: "El correo ya está registrado",
                estado: false
            },
        };
    }


    // ?Verificar si el Dni ya está en uso
    const usuarioExistentePorDni = await usuarioRepository.obtenerPorDni(
        usuarioData.dni
    )

    //? Verificar si el nuevo Dni ya ha sido registrado en otro usuario
    if (usuarioExistentePorDni && id != usuarioExistentePorDni.id) {
        return {
            codigo: 400,
            respuesta: {
                mensaje: "El Dni ya esta registrado",
                estado: false
            },
        };
    }


    const usuarioActualizado = await usuarioRepository.actualizarUsuario(
        id,
        usuarioData
    );

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Usuario actualizado correctamente",
            usuario: usuarioActualizado,
            estado: true
        },
    };
};
