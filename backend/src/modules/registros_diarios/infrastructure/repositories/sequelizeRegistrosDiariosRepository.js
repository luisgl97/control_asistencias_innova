const db = require("../../../../models");
const { RegistrosDiarios } = require("../models/registrosRegistrosDiariosModel");
const { Obra } = require("../../../obras/infrastructure/models/obraModel")

class SequelizeRegistrosDiariosRepository {
  getModel() {
    return require("../models/registrosRegistrosDiariosModel").RegistrosDiarios;
  }

  async crear(registrosDiariosData) {
    return await RegistrosDiarios.create(registrosDiariosData);
  }

   async obtenerRegistrosDiarios() {
    const registrosDiarios = await RegistrosDiarios.findAll();
    return registrosDiarios;
  }

   async obtenerRegistroDiarioPorId(id) {
    const registrosDiarios = await RegistrosDiarios.findByPk(id);
    return registrosDiarios;
  }

  async obtenerRegistrosDiariosPorFecha(fecha) {
    const registrosDiarios = await RegistrosDiarios.findAll({
      where: {
        fecha
      },
      include: [
        {
          model: db.obras,
          as: "obra"
        },
        {
          model: db.usuarios,
          as: "usuario",
          attributes: {
            exclude: ["password"]
          }
        }
      ]
    });
    return registrosDiarios;
  }

   async obtenerRegistrosDiarioPorObraYFecha(obra_id, fecha) {
    
    const registrosDiarios = await RegistrosDiarios.findAll({
      where: {
        fecha,
        obra_id
      },
      include: [
        {
          model: db.obras,
          as: "obra"
        },
        {
          model: db.usuarios,
          as: "usuario",
          attributes: {
            exclude: ["password"]
          }
        }
      ]
    });
    return registrosDiarios;
  }


  async insertarRegistrosDiarios(listaRegistrosDiarios){
    return await RegistrosDiarios.bulkCreate(listaRegistrosDiarios)
  }

  async obtenerObrasAsignadasAlTrabajadorPorDia(usuario_id, fecha) {
    const obrasAsignadasAlTrabajadorPorDia = await RegistrosDiarios.findAll({
      where: {
        usuario_id,
        fecha
      },
      include: [
        {
          model: db.obras,
          as: "obra"
        }
      ]
    });
    return obrasAsignadasAlTrabajadorPorDia;
  }

  async obtenerPorId(id) {
    return await RegistrosDiarios.findByPk(id);
  }

  async actualizarRegistrosDiarios(id, registrosDiariosData) {
    const registrosDiarios = await RegistrosDiarios.findByPk(id);

    await registrosDiarios.update(registrosDiariosData);
    return registrosDiarios;
  }

  async eliminarRegistroDiario({ obra_id, usuario_id, fecha }) {
   
   return RegistrosDiarios.destroy({ where: { obra_id, usuario_id, fecha } });
  }

  async crearRegistroDiario({ obra_id, usuario_id, fecha, descripcion_tarea, asignado_por }) {
  
  return RegistrosDiarios.create({
    obra_id,
    usuario_id,
    fecha, // si es DATEONLY, asegúrate 'YYYY-MM-DD'
    descripcion_tarea,
    asignado_por,
  });
}

  async actualizarRegistroDiario({ obra_id, usuario_id, fecha, descripcion_tarea, asignado_por }) {

  return RegistrosDiarios.update(
    { descripcion_tarea, asignado_por },
    { where: { obra_id, usuario_id, fecha } }
  );
}


}

module.exports = SequelizeRegistrosDiariosRepository;
