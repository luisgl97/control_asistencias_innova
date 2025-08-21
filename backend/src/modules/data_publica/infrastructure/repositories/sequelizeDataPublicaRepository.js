const db = require("../../../../models");
const { mapearEstadosAsistenciaParaElErp } = require("../services/mapearEstadosAsistenciaParaElErp");

class SequelizeDataPublicaRepository {
  async obtenerAsistenciasPorFecha(fecha, lista_dni_trabajadores) {
    

    const usuarios = await db.usuarios.findAll({
      where: {
        dni: lista_dni_trabajadores,
      },
      attributes: ["id"],
    });

    const usuarioIds = usuarios.map((usuario) => usuario.id);

    const asistencias = await db.asistencias.findAll({
      where: {
        fecha,
        usuario_id: usuarioIds,
      },
      include: [{ model: db.usuarios, as: "usuario" }],
    });

    
    const asistenciasAplanadas = asistencias.map((asistencia) => ({
      ...asistencia.dataValues,
      usuario: asistencia.usuario.dataValues,
    }));
    
    const asistenciasParaElERP = mapearEstadosAsistenciaParaElErp(asistenciasAplanadas)

    return asistenciasParaElERP;
  }
}

module.exports = SequelizeDataPublicaRepository;
