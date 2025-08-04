"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Clock } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import {
   Menubar,
   MenubarContent,
   MenubarItem,
   MenubarMenu,
   MenubarSeparator,
   MenubarShortcut,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

const isPathActive = (currentPath, itemPath) => {
   const itemUrl = new URL(itemPath, window.location.origin);
   const itemPathname = itemUrl.pathname;

   return (
      currentPath === itemPathname || currentPath.startsWith(itemPathname + "/")
   );
};

const HeaderAsistencias = () => {
   const location = useLocation();

   const { user, loading, logout } = useAuth();
   const navigate = useNavigate();
   return (
      <>
         <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  {/* Logo y título */}
                  <article className="flex gap-8 items-center">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-innova-blue rounded-full flex items-center justify-center">
                           <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                           <h1 className="text-lg font-bold text-gray-900">
                              Márcate
                           </h1>
                           <p className="text-sm text-gray-500">
                              Sistema de asistencias
                           </p>
                        </div>
                        <div className="sm:hidden">
                           <h1 className="text-base font-bold text-gray-900">
                              Márcate
                           </h1>
                        </div>
                     </div>
                     {(user.rol === "GERENTE" ||
                        user.rol === "ADMINISTRADOR") && (
                        <section className="hidden md:flex gap-4 ">
                           <Button
                              variant="ghost "
                              className={`font-semibold text-base ${
                                 isPathActive(location.pathname, "/asistencias")
                                    ? "text-neutral-800"
                                    : "text-neutral-500"
                              }  hover:text-neutral-800`}
                              onClick={() => {
                                 navigate("/asistencias");
                              }}
                           >
                              Asistencias
                           </Button>
                           <Button
                              variant="ghost "
                              className={`font-semibold text-base ${
                                 isPathActive(location.pathname, "/usuarios")
                                    ? "text-neutral-800"
                                    : "text-neutral-500"
                              }  hover:text-neutral-800`}
                              onClick={() => {
                                 navigate("/usuarios");
                              }}
                           >
                              Trabajadores
                           </Button>
                        </section>
                     )}
                     {user.rol === "LIDER TRABAJADOR" && (
                        <>
                           <section className="hidden md:flex gap-4 ">
                              <Button
                                 variant="ghost "
                                 className={`font-semibold text-base ${
                                    isPathActive(location.pathname, "/")
                                       ? "text-neutral-800"
                                       : "text-neutral-500"
                                 }  hover:text-neutral-800`}
                                 onClick={() => {
                                    navigate("/");
                                 }}
                              >
                                 Mi asistencia
                              </Button>
                           </section>
                           <section className="hidden md:flex gap-4 ">
                              <Button
                                 variant="ghost "
                                 className={`font-semibold text-base ${
                                    isPathActive(
                                       location.pathname,
                                       "/asistencias"
                                    )
                                       ? "text-neutral-800"
                                       : "text-neutral-500"
                                 }  hover:text-neutral-800`}
                                 onClick={() => {
                                    navigate("/asistencias");
                                 }}
                              >
                                 Asistencias
                              </Button>
                           </section>
                        </>
                     )}
                  </article>

                  {/* Desktop - Info del usuario */}
                  <div className="flex items-center space-x-3">
                     <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                           {user ? user.nombres : "Loading"}{" "}
                           {user ? user.apellidos : "..."}
                        </p>
                        <div className="flex items-center space-x-2">
                           <Badge
                              variant="secondary"
                              className={`${
                                 user.rol == "GERENTE"
                                    ? "text-xs"
                                    : "text-xs hidden sm:flex"
                              }`}
                           >
                              {user ? user.rol : "Loading"}
                           </Badge>
                           {user?.cargo && (
                              <Badge variant="outline" className="text-xs">
                                 {user.cargo}
                              </Badge>
                           )}
                        </div>
                     </div>
                     <UserMenu nombre={user?.nombres} logout={logout} />
                  </div>
               </div>
            </div>
         </header>

         {/* Mobile Menu Component */}
         {(user.rol === "GERENTE" ||
            user.rol === "ADMINISTRADOR" ||
            user.rol === "LIDER TRABAJADOR") && (
            <MobileMenu user={user} logout={logout} />
         )}

         <Outlet />
      </>
   );
};

export default HeaderAsistencias;
