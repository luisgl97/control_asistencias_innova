import React, { Suspense, lazy } from "react";
import {
   BrowserRouter,
   HashRouter,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
// import AuthGuard from "./auth.guard";
// import RoleGuard from "./rol.guard";
import LoaderInnova from "@/shared/components/LoaderInnova";
import AuthGuard from "./auth.guard";
import MarcarAsistencia from "@/modules/asistencias/pages/MarcarAsistencia";
import HeaderAsistencias from "@/shared/components/HeaderAsistencias";

// Lazy load components
const Login = lazy(() => import("@/modules/auth/pages/Login"));

export default function AppRoutes() {
   const Router =
      process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

   return (
      <Router>
         {/* Suspense para mostrar fallback mientras carga */}
         <Suspense fallback={<LoaderInnova />}>
            <Routes>
               {/* Ruta pública */}
               <Route path="/login" element={<Login />} />
               <Route path="/" element={<AuthGuard />}>
                  <Route element={<HeaderAsistencias />}>
                     <Route index element={<MarcarAsistencia />} />
                  </Route>
               </Route>

               {/* Catch-all */}
               <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
