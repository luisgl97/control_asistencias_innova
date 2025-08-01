import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RoleGuard({ roles }) {
   const { user } = useAuth();

   if (!user) return null; // o mostrar loader

   const isAuthorized = roles.includes(user.rol);

   if (isAuthorized) return <Outlet />;

   // Redirección personalizada por rol
   if (["ADMINISTRADOR", "GERENTE"].includes(user.rol)) {
      return <Navigate to="/asistencias" replace />;
   } else {
      return <Navigate to="/" replace />;
   }
}

export default RoleGuard;
