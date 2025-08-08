const moment = require("moment");
require("moment/locale/es");
require("moment-timezone");

moment.locale("es"); // español

module.exports = async (asistencia_id, hora_inicio_refrigerio, asistenciaRepository) => {
 
  const hora = moment().tz("America/Lima").format("HH:mm:ss");   

    const dataActualizar = {
        hora_inicio_refrigerio: hora
    }

  const asistenciaActualizada = await asistenciaRepository.actualizarAsistencia(
    asistencia_id,
    dataActualizar,
  );

  if(!asistenciaActualizada){
    return {
      codigo: 400,
      respuesta: {
        mensaje: "No registró una asistencia",
        estado: false,
      },
    };
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tu hora de inicio de refrigerio se registró exitosamente",
      estado: true,
    },
  };
};
