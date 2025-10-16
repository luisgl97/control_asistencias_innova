import api from "@/shared/service/api";


const solicitudesService={
       obtenerSolicitudes: () => api.get("/solicitudes/trabajador"),
       obtenerEquipos: () => api.get("/solicitudes/equipos"),
       crearSolicitud:(payload)=>api.post("/solicitudes",payload),
       actualizarSolicitud:(payload)=>api.put("/solicitudes",payload),
       obtenerTodasLasSolicitudes:() => api.get("/solicitudes"),
       actualizarEstadoSolicitud:(payload)=>api.put("/solicitudes/estado-solicitud",payload),
}
export default solicitudesService