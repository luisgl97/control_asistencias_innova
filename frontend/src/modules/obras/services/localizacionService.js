import api from "@/shared/service/api";

const localizacionService = {
    obtenerLatitudLongitud: (direccion) => api.post("/localizacion", { direccion }),
};

export default localizacionService;