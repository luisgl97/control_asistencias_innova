import api from "@/shared/service/api";

const asistenciaService = {
   verificaAsistencia: (data) =>
      api.post("/asistencias/verificar-asistencia-del-dia", data),
   registrarIngreso: (data) => api.post("/asistencias/registrar-ingreso", data),
   registrarSalida: (data) => api.post("/asistencias/registrar-salida", data),
   generarReporte: (data) => api.post("/asistencias/reporte", data),
   registrarFalta:(data)=>api.post("/permisos/registrar-falta-justificada",data)

};

export default asistenciaService;
