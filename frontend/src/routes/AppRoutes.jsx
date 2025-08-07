import { Suspense, lazy } from "react";
import {
   BrowserRouter,
   HashRouter,
   Navigate,
   Route,
   Routes,
} from "react-router-dom";
// import AuthGuard from "./auth.guard";
// import RoleGuard from "./rol.guard";
import GestionAsistencias from "@/modules/asistencias/pages/GestionAsistencias";
import MarcarAsistencia from "@/modules/asistencias/pages/MarcarAsistencia";
import GestionObras from "@/modules/obras/pages/GestionObras";
import ListarObras from "@/modules/obras/pages/ListarObras";
import RegistrarTarea from "@/modules/obras/pages/RegistrarTarea";
import RegistroObras from "@/modules/obras/pages/RegistroObras";
import GestionUsuarios from "@/modules/usuarios/pages/GestionUsuarios";
import RegistrarUsuario from "@/modules/usuarios/pages/RegistrarUsuario";
import HeaderAsistencias from "@/shared/components/HeaderAsistencias";
import LoaderInnova from "@/shared/components/LoaderInnova";
import AuthGuard from "./auth.guard";
import RoleGuard from "./rol.guard";

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
                     <Route element={<RoleGuard roles={["TRABAJADOR"]} />}>
                        <Route index element={<MarcarAsistencia />} />
                     </Route>
                     <Route
                        element={
                           <RoleGuard roles={["GERENTE", "ADMINISTRADOR"]} />
                        }
                     >
                        <Route
                           path="/asistencias"
                           element={<GestionAsistencias />}
                        />
                        <Route
                           path="/usuarios/registrar"
                           element={<RegistrarUsuario />}
                        />
                        <Route path="/usuarios" element={<GestionUsuarios />} />

                        <Route path="/obras" element={<ListarObras />} />
                        <Route path="/obras/registrar" element={<RegistroObras />} />
                        <Route path="/registro-diario" element={<GestionObras />} />
                        <Route path="/registro-diario/registrar" element={<RegistrarTarea />} />
                     </Route>
                  </Route>
               </Route>

               {/* Catch-all */}
               <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
