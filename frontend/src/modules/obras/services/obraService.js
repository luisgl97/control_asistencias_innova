import api from "@/shared/service/api";
import RegistrarTarea from "../pages/RegistrarTarea";

const obraService = {
    crear: (data) => api.post("/obras", data),
    actualizar: (data) => api.put(`/obras/${data.id}`, data),
    listarObras: () => api.get("/obras"),
    eliminar: (id) => api.patch(`/obras/eliminar/${id}`),
    obtnerObraConId: (id) => api.get(`/obras/${id}`),
    registrarTarea: (data) => api.post(`/registros_diarios`, data),
    actualizarTarea: (data) => api.put(`/registros_diarios`, data),
    listarRegistrosDiarios: (fecha) => api.post(`/registros_diarios/por-fecha`, fecha),
    obtenerRegistroDiarioPorId: (filtro) => api.post(`/registros_diarios/por-obra`, filtro),
    eliminarRegistroDiario:(data)=>api.post('/registros_diarios/eliminar',data)

};
export default obraService;