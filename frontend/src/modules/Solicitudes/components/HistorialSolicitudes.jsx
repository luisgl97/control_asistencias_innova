import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { BoxesIcon, CalendarIcon, Loader2 } from "lucide-react";
import React from "react";

const HistorialSolicitudes = ({
  solicitudes = [],
  handleEditar,
  loadingSolicitudes,
}) => {
  return (
    <TabsContent value="historial" className="mt-4">
      {loadingSolicitudes ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay solicitudes registradas.
            </p>
          )}
          {solicitudes.map((s) => (
            <Card key={s.id} className="p-4  gap-2">
              <article className="flex justify-between space-x-8">
                <section className="flex flex-wrap space-y-2 justify-between w-full">
                  <div className="flex space-x-2">
                    <CalendarIcon className="size-5 text-neutral-700" />
                    <span className="text-sm text-neutral-600 font-light">
                      {new Date(s.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Badge
                    className={`${
                      s.estado === "entregado" ? "bg-amber-500" : "bg-green-600"
                    }`}
                  >
                    {s.estado === "entregado" ? "Atendido" : "Solicitado"}
                  </Badge>
                </section>
                {s.estado === "solicitado" && (
                  <section>
                    <Button variant="outline" onClick={() => handleEditar(s)}>
                      Editar solicitud
                    </Button>
                  </section>
                )}
              </article>
              <article className="">
                <div className="flex space-x-2">
                  <BoxesIcon className="size-5 text-neutral-700" />
                  <span className="text-sm text-neutral-600 font-light">
                    Equipos
                  </span>
                </div>
                <section className="flex flex-wrap gap-2 mt-2.5 ">
                  {s.equipos.map((e) => (
                    <Badge key={e.id} className="bg-neutral-100 shadow font-light text-neutral-700">
                      {e.nombre}
                    </Badge>
                  ))}
                </section>
              </article>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default HistorialSolicitudes;
