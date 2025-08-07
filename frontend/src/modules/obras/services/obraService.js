import api from "@/shared/service/api";

const obraService = {
    crear: (data) => api.post("/obras", data),
    listarObras: () => api.get("/obras/"),
    obtnerObraConId: (id) => api.get(`/obras/obtener-obra?obra_id=${id}`),
};
export default obraService;