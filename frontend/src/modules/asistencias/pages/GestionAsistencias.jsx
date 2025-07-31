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

export default function GestionAsistencias() {
   return (
      <div className="flex w-full justify-center my-8">
         <Tabs defaultValue="dia" className="w-full max-w-7xl flex items-start space-y-2">
            <TabsList className="grid grid-cols-2  w-full h-auto bg-white">
               <TabsTrigger className="w-full bg-neutral-200/40" value="dia" >Asistencia Diaria</TabsTrigger>
               <TabsTrigger className="w-full bg-neutral-200/40" value="semanal">Asistencia Semanal</TabsTrigger>
               <TabsTrigger className="w-full bg-neutral-200/40" value="mapa">Mapa de trabajadores</TabsTrigger>
            </TabsList>
            <TabsContent value="dia" className="w-full p-2">
               <AsistenciaPordia />
            </TabsContent>
            <TabsContent value="semanal" className="w-full p-2">
               <AsistenciaSemanal />
            </TabsContent>
            <TabsContent value="mapa" className="w-full p-2">
               <MapaTrabajadores/>
            </TabsContent>
         </Tabs>
      </div>
   );
}
