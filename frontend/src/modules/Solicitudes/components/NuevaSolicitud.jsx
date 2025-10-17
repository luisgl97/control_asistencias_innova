import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TabsContent } from "@/components/ui/tabs";
import { opciones_tipo_equipo } from "@/modules/usuarios/utils/optionsUsuarioForm";
import SelectConEtiquetaFlotante from "@/shared/components/selectConEtiquetaFlotante";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ConfirmationModal } from "./ModalConfrimacion";

const NuevaSolicitud = ({
  loadingEquipos,
  equipos = [],
  handleSubmit,
  editingSolicitud,
  selectedEquipos,
  toggleEquipo,
  tipoEquipo,
  setTipoEquipo
}) => {

  const [currentEquipo, setCurrentEquipos] = useState(equipos);
  useEffect(() => {
    let data = [...equipos]
    if (tipoEquipo) {
      data = data.filter((e) => e.tipo == tipoEquipo)
    }
    setCurrentEquipos(data)

  }, [tipoEquipo])

  return (
    <TabsContent value="form" className="mt-4">
      {loadingEquipos ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : (
        <div>
          <section className="w-full mb-4">
            <SelectConEtiquetaFlotante
              value={tipoEquipo}
              onChange={(name, value) => setTipoEquipo(value)}
              name="tipo"
              label="Tipo de Equipo"
              opciones={opciones_tipo_equipo}
            />
          </section>
          {equipos.length > 0 ? (
            <div className="space-y-3">
              {currentEquipo.map((eq) => (
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
            <ConfirmationModal editingSolicitud={editingSolicitud} equipos={selectedEquipos.length} handleSubmit={handleSubmit} mensaje_edit={editingSolicitud?.observacion} />
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default NuevaSolicitud;
