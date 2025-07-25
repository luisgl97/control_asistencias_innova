import api from "@/shared/service/api";

const usuarioService = {
   crear: (data) => api.post("/usuarios", data),
   getUsuarios: () => api.get("/usuarios"),
};

export default usuarioService;
