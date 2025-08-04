import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Coffee, LogIn, LogOut } from "lucide-react";

const HorariosTrabajo = ({ className, esSabado = false }) => {
   return (
      <Card className={` ${className} gap-0`}>
         <CardHeader className="pb-3">
            <h2 className="text-base font-medium text-innova-blue">
               Horarios de Trabajo
            </h2>
         </CardHeader>
         <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-1">
                  <LogIn className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-gray-600">Entrada</span>
               </div>
               <div className="text-right">
                  <div className="font-semibold">07:30 AM</div>
                  <div className="text-xs text-orange-600">
                     Tolerancia hasta 7:45
                  </div>
               </div>
            </div>
            {!esSabado && (
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                     <Coffee className="h-3 w-3 text-blue-500" />
                     <span className="text-sm text-gray-600">Refrigerio</span>
                  </div>
                  <div className="text-right">
                     <div className="font-semibold">12:00 PM -</div>
                     <div className="text-blue-600 text-sm">1:00 PM</div>
                  </div>
               </div>
            )}

            <div className="flex justify-between items-center">
               <div className="flex items-center gap-1">
                  <LogOut className="h-3 w-3 text-red-500" />

                  <span className="text-sm text-gray-600">Salida</span>
               </div>
               <div className="font-semibold">
                  {esSabado ? "01:00 PM" : "05:00 PM"}
               </div>
            </div>
         </CardContent>
      </Card>
   );
};
export default HorariosTrabajo;
