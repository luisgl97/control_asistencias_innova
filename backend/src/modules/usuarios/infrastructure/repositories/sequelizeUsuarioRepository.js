const db = require("../../../../models");
const { Usuario } = require("../models/usuarioModel");
const { Op } = require("sequelize");

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
        estado: true // Solo usuarios activos
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.filiales,
          as: "filial",
        }
      ]
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
        }
      ]
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
          as: "filial"
        }
      ]
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
      where: {
        [Op.or]: [
          { cargo: "MONTADOR" },
          { cargo: "ALMACEN" }
        ]
      },
      attributes: ["id", "dni", "nombres", "apellidos", "cargo"],
    });
    return usuarios;
  }

  async obtenerUsuariosAutorizanPermiso() {
    const usuarios = await Usuario.findAll({
      where: {
        estado: true, // Solo usuarios activos
        rol: ["GERENTE", "ADMINISTRADOR"]
      },
      attributes: {
        exclude: ["password"],
      },
    });
    return usuarios;
  }
}

module.exports = SequelizeUsuarioRepository;
