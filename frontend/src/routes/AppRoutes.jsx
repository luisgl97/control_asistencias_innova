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
               <Route path="/" element={<Login />} />
               {/* Rutas protegidas */}
               {/* <Route path="/" element={<AuthGuard />}>
                  <Route element={<DashboardLayout />}>
                     <Route index element={<DashboardHome />} />

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="gestion-obras"
                           element={<GestionObras />}
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["Gerencia"]} />}>
                        <Route
                           path="crear-trabajador"
                           element={<CrearTrabajador />}
                        />
                     </Route>
                  </Route>
               </Route> */}

               {/* Catch-all */}
               <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
