import axios from "axios";

// Esta configuración de Axios permite realizar solicitudes HTTP a la API de tu backend.
// Utiliza variables de entorno para definir la URL base y manejar el token de autenticación.

// Detectamos si estamos en desarrollo o producción
const API_URL =
   import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL;

// Verificar si la variable está bien cargada
if (!API_URL) {
   console.error(
      "⚠️ ERROR: No se encontró REACT_APP_API_URL_PROD o REACT_APP_API_URL en el entorno."
   );
}

// Crear una instancia de Axios con la configuración base
// Establecemos un timeout largo para evitar problemas de conexión en operaciones pesadas
const api = axios.create({
   baseURL: API_URL,
   timeout: 2400000,
   headers: { "Content-Type": "application/json" },
   withCredentials: true
});

// Agregar token automáticamente a cada solicitud
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Manejo de errores 401 (sesión expirada)
api.interceptors.response.use(
   (response) => response,
   (error) => {
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
