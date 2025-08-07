const db = require("../../../../models");
const { Usuario } = require("../models/usuarioModel");
const {
  Asistencia,
} = require("../../../asistencias/infrastructure/models/asistenciaModel");
const { Op, Sequelize } = require("sequelize");

class SequelizeUsuarioRepository {
  getModel() {
    return require("../models/usuarioModel").Usuario; // Retorna el modelo de usuario
  }

  async crear(usuarioData) {
    return await Usuario.create(usuarioData);
  }

  async obtenerUsuarios() {
    const usuarios = await Usuario.findAll({
      where: {
        estado: true, // Solo usuarios activos
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.filiales,
          as: "filial",
        },
      ],
    });
    return usuarios;
  }

  async obtenerUsuariosTodos() {
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.filiales,
          as: "filial",
        },
      ],
    });
    return usuarios;
  }

  async obtenerPorId(id) {
    return await Usuario.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.filiales,
          as: "filial",
        },
      ],
    });
  }

  async obtenerPorDni(dni) {
    return await Usuario.findOne({ where: { dni } });
  }
  async obtenerPorEmail(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async actualizarUsuario(id, usuarioData) {
    const usuario = await Usuario.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });
    delete usuarioData.password; // Si no quieres permitir su actualización
    await usuario.update(usuarioData);
    return usuario;
  }

  async eliminarUsuario(id) {
    const usuario = await this.obtenerPorId(id);
    if (!usuario) return null;
    return await usuario.update({ estado: false });
  }

  async activarUsuario(id) {
    const usuario = await this.obtenerPorId(id);
    if (!usuario) return null;
    await usuario.update({ estado: true });
    return usuario;
  }

  async listarUsuariosPorCargo(cargo) {
    const usuarios = await Usuario.findAll({
      where: { cargo },
      attributes: {
        exclude: ["password"],
      },
    });
    return usuarios;
  }

  async listarUsuariosTrabajadores() {
    const usuarios = await Usuario.findAll({
      where: { rol: ["TRABAJADOR", "LIDER TRABAJADOR"] },
      attributes: ["id", "dni", "nombres", "apellidos", "cargo"],
    });
    return usuarios;
  }

  async obtenerUsuariosAutorizanPermiso() {
    const usuarios = await Usuario.findAll({
      where: {
        estado: true, // Solo usuarios activos
        rol: ["GERENTE", "ADMINISTRADOR"],
      },
      attributes: {
        exclude: ["password"],
      },
    });
    return usuarios;
  }

  async obtenerUsuariosConMinimoUnaAsistenciaDelMes(fecha_inicio, fecha_fin) {
  const usuarios = await Asistencia.findAll({
    where: {
      fecha: {
        [Op.between]: [fecha_inicio, fecha_fin],
      },
    },
    attributes: [
      "usuario_id",
      [
        Sequelize.fn("COUNT", Sequelize.col("asistencias.id")),
        "total_asistencias",
      ],
    ],
    group: ["usuario_id", "usuario.id", "usuario.nombres", "usuario.apellidos", "usuario.dni"], // Necesario para evitar errores con MySQL strict
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nombres", "apellidos", "dni"],
      },
    ],
    having: Sequelize.literal("COUNT(`asistencias`.`id`) >= 1"),
  });

  const usuariosConMinimoUnaAsistencia = usuarios.map(usuario => (({
    id: usuario?.usuario?.id,
    nombres: usuario?.usuario?.nombres,
    apellidos: usuario?.usuario?.apellidos,
    dni: usuario?.usuario?.dni,
  })))
  return usuariosConMinimoUnaAsistencia;
}
}

module.exports = SequelizeUsuarioRepository;
