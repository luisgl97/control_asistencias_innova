import axios from "axios";

// Detectamos si estamos en desarrollo o producción
const API_URL =
   import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL;

// Verificar si la variable está bien cargada
console.log("🌐 API_URL usada:", API_URL);

if (!API_URL) {
   console.error(
      "⚠️ ERROR: No se encontró VITE_API_URL_PROD o VITE_API_URL en el entorno."
   );
}

// Crear instancia de Axios
const api = axios.create({
   baseURL: API_URL,
   timeout: 2400000,
   headers: { "Content-Type": "application/json" },
   withCredentials: true,
});

console.log("📦 Axios instancia creada con baseURL:", api.defaults.baseURL);

// Interceptor de solicitud
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      console.log("🌐 API_URL usada:", API_URL);
      console.log("🔐 Token actual:", token);
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("📤 Enviando solicitud con config:", config);
      return config;
   },
   (error) => {
      console.error("❌ Error en la solicitud (request):", error);
      return Promise.reject(error);
   }
);

// Interceptor de respuesta
api.interceptors.response.use(
   (response) => {
      console.log("✅ Respuesta recibida:", response);
      return response;
   },
   (error) => {
      console.error("❌ Error en la respuesta (response):", error);
      if (error.response?.status === 417) {
         console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         window.location.href = "/";
      }
      return Promise.reject(error);
   }
);

export default api;

