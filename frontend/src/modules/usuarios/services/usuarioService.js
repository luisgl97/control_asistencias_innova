import api from "@/shared/service/api";

const usuarioService = {
   crear: (data) => api.post("/usuarios", data),
   editar: (data, id) => api.put(`/usuarios/${id}`, data),
   eliminar: (id) => api.patch(`/usuarios/desactivar/${id}`),
   getUsuarios: () => api.get("/usuarios"),
   getUsuario: (id) => api.get(`/usuarios/${id}`),
};

export default usuarioService;
