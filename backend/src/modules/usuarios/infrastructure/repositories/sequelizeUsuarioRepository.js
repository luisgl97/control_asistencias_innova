const { Usuario } = require("../models/usuarioModel");

class SequelizeUsuarioRepository {
  getModel() {
    return require("../models/usuarioModel").Usuario; // Retorna el modelo de usuario
  }

  async crear(usuarioData) {
    return await Usuario.create(usuarioData);
  }

  async obtenerUsuarios() {
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    return usuarios;
  }

  async obtenerPorId(id) {
    return await Usuario.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
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
}

module.exports = SequelizeUsuarioRepository;
