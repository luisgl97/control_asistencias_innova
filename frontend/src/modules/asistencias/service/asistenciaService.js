import api from "@/shared/service/api";

const asistenciaService = {
   verificaAsistencia: (data) =>
      api.post("/asistencias/verificar-asistencia-del-dia", data),
   registrarIngreso: (data) => api.post("/asistencias/registrar-ingreso", data),
   registrarSalida: (data) => api.post("/asistencias/registrar-salida", data),
   generarReporte: (data) => api.post("/asistencias/reporte", data),
   asistenciasDelDia: (data) => api.post("/asistencias/del-dia", data),
   registrarFalta: (data) =>
      api.post("/permisos/autorizar-falta-justificada", data),
   registrarSalidaAnticipada: (data) =>
      api.post("/permisos/registrar-salida-anticipada", data),
   habilitarHorasExtras: (data) =>
      api.post("/asistencias/autorizar-horas-extras", data),
   mapaTrabajadores: (data) => api.post("/asistencias/mapa-ubicaciones", data),
   asistenciaPorUsuario: (data) => api.post("/asistencias/usuario", data),
   // permisos/registrar-salida-anticipada
};

export default asistenciaService;
