const { Usuario } = require("../models/usuarioModel");

class SequelizeUsuarioRepository {
 
  getModel() {
    return require("../models/usuarioModel").Usuario; // Retorna el modelo de usuario
  }

  async crear(usuarioData) {
    return await Usuario.create(usuarioData);
  }

  async obtenerUsuarios() {
    const usuarios = await Usuario.findAll();
    return usuarios;
  }

  async obtenerPorId(id) {
    return await Usuario.findByPk(id); // Llama al método del repositorio para obtener un usuario por ID
  }

  async obtenerPorEmail(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async actualizarUsuario(id, usuarioData) {
    const usuario = await Usuario.findByPk(id); // Busca el usuario por ID
    if (!usuario) {
      // Si no se encuentra el usuario, retorna null
      console.log("❌ Usuario no encontrado");
      return null;
    }

    await usuario.update(usuarioData); // Actualiza el usuario con los nuevos datos
    return usuario; // Retorna el usuario actualizado
  }

  async eliminarUsuario(id) {
    const usuario = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el usuario por ID
    if (!usuario) return null; // Si no se encuentra el usuario, retorna null
    return await usuario.destroy(); // Elimina el usuario y retorna el resultado
  }

}

module.exports = SequelizeUsuarioRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
