const { Permiso } = require("../models/permisoModel");
const db = require("../../../../models"); // Importa la conexión a la base de datos

class SequelizePermisoRepository {
  getModel() {
    return require("../models/permisoModel").Permiso; // Retorna el modelo de permiso
  }

  async crear(permisoData) {
    return await Permiso.create(permisoData);
  }

  async obtenerPermisos() {
    const permisos = await Permiso.findAll({
      include: [
        {
          model: db.asistencias,
          as: "asistencia",
        },
        {
          model: db.usuarios,
          as: "autorizado_por_usuario",
          attributes: {
            exclude: ["password"], // Excluye el campo de contraseña
          },
        },
      ],
    });

    return permisos;
  }

  async obtenerPermisoPorAsistenciaId(asistenciaId) {
    return await Permiso.findOne({
      where: { asistencia_id: asistenciaId },
    });
  }

  async obtenerPermisosPorUsuarioId(usuarioId) {
    const permisos = await Permiso.findAll({
      include: [
        {
          model: db.asistencias,
          as: "asistencia",
          where: { usuario_id: usuarioId }, // El usuario del que quieres los permisos
        },
      ],
    });

    console.log("PERMISOSSSSSSS", permisos);
    return permisos;
  }
}

module.exports = SequelizePermisoRepository;
