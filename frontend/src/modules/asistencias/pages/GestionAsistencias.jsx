import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AsistenciaSemanal from "../components/AsistenciaSemanal";
import AsistenciaPordia from "../components/AsistenciaPordia";
import MapaTrabajadores from "../components/MapaTrabajadores";
import { useState } from "react";
import Reportes from "../components/Reportes";
import { useAuth } from "@/context/AuthContext";

export default function GestionAsistencias() {
   const [isLoading, setIsLoading] = useState(false);
   const { user, loading, logout } = useAuth();

   return (
      <div className="flex w-full justify-center my-8">
         <Tabs
            defaultValue="dia"
            className="w-full max-w-7xl flex items-start space-y-2"
         >
            <TabsList className="grid grid-cols-2 md:grid-none md:flex  w-full md:w-auto h-auto space-x-2 bg-white">
               <TabsTrigger
                  className="w-full bg-neutral-200/80  data-[state=active]:bg-innova-blue data-[state=active]:text-white"
                  disabled={isLoading}
                  value="dia"
               >
                  Asistencia Diaria
               </TabsTrigger>
               {user.rol !== "LIDER TRABAJADOR" && (
                  <>
                     <TabsTrigger
                        className="w-full bg-neutral-200/80 data-[state=active]:bg-innova-blue data-[state=active]:text-white"
                        disabled={isLoading}
                        value="semanal"
                     >
                        Asistencia Semanal
                     </TabsTrigger>
                     <TabsTrigger
                        className="w-full bg-neutral-200/80  data-[state=active]:bg-innova-blue data-[state=active]:text-white"
                        disabled={isLoading}
                        value="mapa"
                     >
                        Mapa de trabajadores
                     </TabsTrigger>
                     <TabsTrigger
                        className="w-full bg-neutral-200/80  data-[state=active]:bg-innova-blue data-[state=active]:text-white"
                        value="reportes"
                     >
                        Reporte PDF
                     </TabsTrigger>
                  </>
               )}
            </TabsList>
            <TabsContent value="dia" className="w-full p-2">
               <AsistenciaPordia />
            </TabsContent>
            {user.rol !== "LIDER TRABAJADOR" && (
               <>
                  <TabsContent value="semanal" className="w-full p-2">
                     <AsistenciaSemanal />
                  </TabsContent>
                  <TabsContent value="mapa" className="w-full p-2">
                     <MapaTrabajadores />
                  </TabsContent>
                  <TabsContent value="reportes" className="w-full p-2">
                     <Reportes />
                  </TabsContent>
               </>
            )}
         </Tabs>
      </div>
   );
}
