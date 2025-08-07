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
    return await Obra.findByPk(id);
  }

  async actualizarObra(id, obraData) {
    const obra = await Obra.findByPk(id);

    await obra.update(obraData);
    return obra;
  }


}

module.exports = SequelizeObraRepository;
