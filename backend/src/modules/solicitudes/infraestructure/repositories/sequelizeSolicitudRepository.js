const { SolicitudEquipo } = require("../models/solicitudEquipoModel");
const { Solicitud } = require("../models/solicitudModel");
const db = require("../../../../models");
const { Equipo } = require("../models/equipoModel");

class SequelizeSolicitudRepository {
  async crearSolicitud(payload, transaction = null) {
    const solicitud = await Solicitud.create(payload, { transaction });
    return solicitud;
  }
  async crearSolicitudEquipo(payload, transaction = null) {
    const solicitud_equipo = await SolicitudEquipo.create(payload, {
      transaction,
    });
    return solicitud_equipo;
  }
  async obtenerSolicitudesPorTrabajador(trabajador_id, transaction = null) {
    console.log();

    const solicitudes = await Solicitud.findAll({
      where: {
        usuario_id: trabajador_id,
      },
      include: [
        {
          model: db.equipos,
          as: "equipos",
        },
      ],
    });

    return solicitudes;
  }
  async actualizarSolicitudEquipos(solicitud_id, equipos, transaction = null) {
    await SolicitudEquipo.destroy({ where: { solicitud_id }, transaction });
    for (const e of equipos) {
      const payload = {
        solicitud_id,
        equipo_id: e,
      };
      await SolicitudEquipo.create(payload, { transaction });
    }
  }
  async obtenerEquipos() {
    const equipos = await Equipo.findAll();
    return equipos;
  }
  async obtenerTodasLasSolicitudes() {
    const solicitudes = await Solicitud.findAll({
      include: [
        {
          model: db.equipos,
          as: "equipos",
        },
        {
          model: db.usuarios,
          as: "usuario_solicitante", // usuario_id (obligatorio)
        },
        {
          model: db.usuarios,
          as: "usuario_atendio", // atendido_por (puede ser null)
          required: false, // Para permitir resultados aunque este usuario sea null
        },
      ],
    });
    return solicitudes;
  }

  async actualizarEstadoSolicitud(solicitud_id,usuario_id) {
    await Solicitud.update(
      {
        estado: "entregado",
        fecha_entrega: new Date().toISOString().split("T")[0],
        atendido_por:usuario_id
      },
      { where: { id: solicitud_id } }
    );
  }
}

module.exports = SequelizeSolicitudRepository;
