import api from "@/shared/service/api";

const usuarioService = {
   crear: (data) => api.post("/usuarios", data),
   editar: (data, id) => api.put(`/usuarios/${id}`, data),
   eliminar: (id) => api.patch(`/usuarios/desactivar/${id}`),
   getUsuarios: () => api.get("/usuarios"),
   getUsuariosAll: () => api.get("/usuarios/todos"),
   getUsuariosAllTrabajadores: () => api.get("/usuarios/trabajadores"),
   getUsuario: (id) => api.get(`/usuarios/${id}`),
   activarUsuario: (id) => api.patch(`/usuarios/activar/${id}`),
   getUsuariosConMinimoUnaAsistenciaDelMes: (data) => api.post("/usuarios/con-minimo-asistencia-del-mes", data)
};


export default usuarioService;
