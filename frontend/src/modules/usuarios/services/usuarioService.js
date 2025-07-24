import api from "@/shared/service/api";

const usuarioService = {
   crear: (data) => api.post("/usuarios", data),
};

export default usuarioService;
