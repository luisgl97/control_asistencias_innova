import { Suspense, lazy } from "react";
import {
   BrowserRouter,
   HashRouter,
   Navigate,
   Route,
   Routes,
} from "react-router-dom";

import LoaderInnova from "@/shared/components/LoaderInnova";
import AuthGuard from "./auth.guard";
import RoleGuard from "./rol.guard";
import HeaderAsistencias from "@/shared/components/HeaderAsistencias";

// Lazy load de todas las páginas
const Login = lazy(() => import("@/modules/auth/pages/Login"));
const GestionAsistencias = lazy(() =>
   import("@/modules/asistencias/pages/GestionAsistencias")
);
const MarcarAsistencia = lazy(() =>
   import("@/modules/asistencias/pages/MarcarAsistencia")
);
const GestionObras = lazy(() => import("@/modules/obras/pages/GestionObras"));
const ListarObras = lazy(() => import("@/modules/obras/pages/ListarObras"));
const RegistrarTarea = lazy(() =>
   import("@/modules/obras/pages/RegistrarTarea")
);
const RegistroObras = lazy(() => import("@/modules/obras/pages/RegistroObras"));
const GestionUsuarios = lazy(() =>
   import("@/modules/usuarios/pages/GestionUsuarios")
);
const RegistrarUsuario = lazy(() =>
   import("@/modules/usuarios/pages/RegistrarUsuario")
);

export default function AppRoutes() {
   const Router =
      process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

   return (
      <Router>
         {/* Suspense para mostrar fallback mientras carga cualquier ruta */}
         <Suspense fallback={<LoaderInnova />}>
            <Routes>
               {/* Ruta pública */}
               <Route path="/login" element={<Login />} />

               {/* Rutas protegidas */}
               <Route path="/" element={<AuthGuard />}>
                  <Route element={<HeaderAsistencias />}>
                     <Route
                        element={
                           <RoleGuard
                              roles={["TRABAJADOR", "LIDER TRABAJADOR"]}
                           />
                        }
                     >
                        <Route index element={<MarcarAsistencia />} />
                     </Route>

                     <Route
                        element={
                           <RoleGuard
                              roles={[
                                 "GERENTE",
                                 "ADMINISTRADOR",
                                 "LIDER TRABAJADOR",
                              ]}
                           />
                        }
                     >
                        <Route
                           path="/asistencias"
                           element={<GestionAsistencias />}
                        />
                     </Route>

                     <Route
                        element={
                           <RoleGuard roles={["GERENTE", "ADMINISTRADOR"]} />
                        }
                     >
                        <Route
                           path="/usuarios/registrar"
                           element={<RegistrarUsuario />}
                        />
                        <Route path="/usuarios" element={<GestionUsuarios />} />

                        <Route path="/obras" element={<ListarObras />} />
                        <Route
                           path="/obras/registrar"
                           element={<RegistroObras />}
                        />
                        <Route
                           path="/registro-diario"
                           element={<GestionObras />}
                        />
                        <Route
                           path="/registro-diario/registrar"
                           element={<RegistrarTarea />}
                        />
                     </Route>
                  </Route>
               </Route>

               {/* Catch-all */}
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
