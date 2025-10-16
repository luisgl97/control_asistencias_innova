import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import React from "react";

const NuevaSolicitud = ({
  loadingEquipos,
  equipos = [],
  handleSubmit,
  editingSolicitud,
  selectedEquipos,
  toggleEquipo
}) => {
  return (
    <TabsContent value="form" className="mt-4">
      {loadingEquipos ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : (
        <div>
          {equipos.length > 0 ? (
            <div className="space-y-3">
              {equipos.map((eq) => (
                <div key={eq.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={eq.id}
                    checked={selectedEquipos.includes(eq.id)}
                    onCheckedChange={() => toggleEquipo(eq.id)}
                  />
                  <label
                    htmlFor={eq.id}
                    className="text-sm font-medium leading-none"
                  >
                    {eq.nombre}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay equipos disponibles.
            </p>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} className="bg-green-700">
              {editingSolicitud ? "Guardar cambios" : "Registrar"}
            </Button>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default NuevaSolicitud;
