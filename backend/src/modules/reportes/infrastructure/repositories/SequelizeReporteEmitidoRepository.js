const db = require("../../../../models/");
const { ReporteEmitido } = require("../models/ReporteEmitidoModel");

class SequelizeReporteEmitidoRepository {
  getModel() {
    return require("../models/ReporteEmitidoModel").ReporteEmitido;
  }

  async guardar(reporte) {
    try {
        return await ReporteEmitido.create(reporte);
    } catch (error) {
        console.error("Error al guardar el reporte emitido: ", error);
        throw error;
    }
  }

  async obtenerPorUsuarioYMes(usuario_id, mes) {
    try {
        return await ReporteEmitido.findOne({
        where: { usuario_id, mes }
     });
    } catch (err) {
        console.error("Error en obtenerPorUsuarioYMes: ", err);
        throw err;
    }
  }
}

module.exports = SequelizeReporteEmitidoRepository;