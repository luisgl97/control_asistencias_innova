import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Clock, User } from "lucide-react";
import { Outlet } from "react-router-dom";

const HeaderAsistencias = () => {
   const { user, loading } = useAuth();

   return (
      <>
         <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  {/* Logo y título */}
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-innova-blue rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                     </div>
                     <div className="hidden sm:block">
                        <h1 className="text-lg font-semibold text-gray-900">
                           Marcate
                        </h1>
                        <p className="text-sm text-gray-500">
                           Sistema de asistencias
                        </p>
                     </div>
                     <div className="sm:hidden">
                        <h1 className="text-base font-semibold text-gray-900">
                           Asistencias
                        </h1>
                     </div>
                  </div>

                  {/* Info del usuario */}
                  <div className="flex items-center space-x-3">
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">
                           {user ? user.nombres : "Loading"}
                           {user ? user.apellidos : "..."}
                        </p>
                        <div className="flex items-center space-x-2">
                           <Badge variant="secondary" className="text-xs">
                              {user ? user.rol : "Loading"}
                           </Badge>
                           {user.cargo && (
                              <Badge variant="outline" className="text-xs">
                                 {user.cargo}
                              </Badge>
                           )}
                        </div>
                     </div>
                     <div className="sm:hidden">
                        {user ? user.nombres : "Loading"}
                     </div>
                     <div className="w-8 h-8 bg-innova-blue rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                     </div>
                  </div>
               </div>
            </div>
         </header>
         <Outlet />
      </>
   );
};
export default HeaderAsistencias;
