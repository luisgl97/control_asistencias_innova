import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoaderInnova from "@/shared/components/LoaderInnova";

export default function AuthGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoaderInnova />;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}