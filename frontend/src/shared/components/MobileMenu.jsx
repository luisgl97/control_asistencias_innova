"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Menu, User, Users2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({ user, logout }) => {
   const navigate = useNavigate();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
   };

   return (
      <>
         {/* Mobile Menu Button - Fixed Position */}
         <Button
            variant="default"
            size="icon"
            onClick={toggleMobileMenu}
            className="fixed bottom-6 right-6 z-50 sm:hidden w-14 h-14 rounded-full shadow-lg bg-innova-blue hover:bg-innova-blue/90 transition-all duration-200"
         >
            {isMobileMenuOpen ? (
               <X className="w-6 h-6 text-white" />
            ) : (
               <Menu className="w-6 h-6 text-white" />
            )}
         </Button>

         {/* Mobile Menu Overlay */}
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-innova-blue/20 bg-opacity-50 z-40 sm:hidden"
               onClick={closeMobileMenu}
            />
         )}

         {/* Mobile Menu Sidebar */}
         <div
            className={`
          fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 sm:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
         >
            <div className="p-6 pt-20">
               {/* User Info */}
               <div className="border-b pb-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                     <div className="w-12 h-12 bg-innova-blue rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="text-lg font-medium text-gray-900">
                           {user
                              ? `${user.nombres} ${user.apellidos}`
                              : "Loading..."}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Badge variant="secondary" className="text-sm">
                        {user ? user.rol : "Loading"}
                     </Badge>
                     {user?.cargo && (
                        <Badge variant="outline" className="text-sm ml-2">
                           {user.cargo}
                        </Badge>
                     )}
                  </div>
               </div>

               {/* Menu Actions */}
               <div className="space-y-4">
                  <Button
                     variant="outline"
                     className="w-full justify-start bg-transparent"
                     onClick={() => {
                        // Aquí puedes agregar navegación a perfil
                        navigate("/usuarios");
                        closeMobileMenu();
                     }}
                  >
                     <Users2 className="w-4 h-4 mr-2" />
                     Trabajadores
                  </Button>
                  <Button
                     variant="outline"
                     className="w-full justify-start bg-transparent"
                     onClick={() => {
                        // Aquí puedes agregar navegación a perfil
                        navigate("/asistencias");
                        closeMobileMenu();
                     }}
                  >
                     <ClipboardList className="w-4 h-4 mr-2" />
                     Asistencias
                  </Button>

                  <Button
                     variant="destructive"
                     className="w-full justify-start"
                     onClick={() => {
                        logout();
                        closeMobileMenu();
                     }}
                  >
                     Cerrar Sesión
                  </Button>
               </div>
            </div>
         </div>
      </>
   );
};

export default MobileMenu;
