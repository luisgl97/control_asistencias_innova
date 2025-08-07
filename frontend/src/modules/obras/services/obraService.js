import api from "@/shared/service/api";
import RegistrarTarea from "../pages/RegistrarTarea";

const obraService = {
    crear: (data) => api.post("/obras", data),
    listarObras: () => api.get("/obras"),
    obtnerObraConId: (id) => api.get(`/obras/${id}`),
    RegistrarTarea: (data) => api.post(`/registros_diarios`, data),
    listarRegistrosDiarios: (fecha) => api.post(`/registros_diarios/por-fecha`, fecha),
};
export default obraService;