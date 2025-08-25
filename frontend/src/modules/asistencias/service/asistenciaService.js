import api from "@/shared/service/api";

const asistenciaService = {
   verificaAsistencia: (data) =>
      api.post("/asistencias/verificar-asistencia-del-dia", data),
   detalle: (data) => api.post("/asistencias/detalle", data),
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
   registrarInicioRefrigerio: (data) =>
      api.post("/asistencias/registrar-inicio-refrigerio", data),
   registrarFinRefrigerio: (data) =>
      api.post("/asistencias/registrar-fin-refrigerio", data),
   getAutorizadores: () => api.get("/usuarios/autorizan-permiso"),
   registrarTardanzaJustificada: (data) =>
      api.post("/permisos/autorizar-tardanza-justificada", data),
   getUbicacion: (data) => api.post("/localizacion/direccion", data),
};

export default asistenciaService;
