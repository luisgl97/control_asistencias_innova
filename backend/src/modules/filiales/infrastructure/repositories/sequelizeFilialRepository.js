const { Filial } = require("../models/filialModel");

class SequelizeFilialRepository {
 
  getModel() {
    return require("../models/filialModel").Filial; // Retorna el modelo de filial
  }

  async obtenerFiliales() {
    const filiales = await Filial.findAll();
    return filiales;
  }

}

module.exports = SequelizeFilialRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
