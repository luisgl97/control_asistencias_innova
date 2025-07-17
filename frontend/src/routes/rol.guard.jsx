import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RoleGuard({ roles }) {
   const { user } = useAuth();
   const isAuthorized = roles.includes(user.rol);   
   return isAuthorized ? <Outlet /> : <Navigate to="/" replace/>;
}
export default RoleGuard;
