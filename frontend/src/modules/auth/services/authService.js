import api from "@/shared/service/api";

export async function loginService(email, password) {
   try {
      const response = await api.post("/auth/login", {
         email,
         password,
      });
      console.log(response);
      

      return response.data;
   } catch (error) {
      console.log(error);
      
      console.error(
         "❌ Error en loginService:",
         error.response?.data || error.message
      );
      return {
         error: true,
         mensaje: error.response?.data?.mensaje || "Error desconocido",
      };
   }
}
