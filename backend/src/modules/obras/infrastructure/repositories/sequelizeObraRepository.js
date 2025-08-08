const db = require("../../../../models");
const { Obra } = require("../models/obraModel");

class SequelizeObraRepository {
  getModel() {
    return require("../models/obraModel").Obra; // Retorna el modelo de obra
  }

  async crear(obraData) {
    return await Obra.create(obraData);
  }

  async obtenerObras() {
    const obras = await Obra.findAll();
    return obras;
  }

  async obtenerPorId(id) {
    return await Obra.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }

  async actualizarObra(id, obraData) {
    const obra = await Obra.findByPk(id);

    await obra.update(obraData);
    return obra;
  }

  async eliminarObra(id) {
    const obra = await this.obtenerPorId(id);
    if (!obra) return null;
    return await obra.update({ estado: false });
  }


}

module.exports = SequelizeObraRepository;
