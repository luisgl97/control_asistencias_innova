import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { opciones_cambio_estado } from "@/modules/usuarios/utils/optionsUsuarioForm";
import SelectConEtiquetaFlotante from "@/shared/components/selectConEtiquetaFlotante";
import { BoxesIcon, CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import solicitudesService from "../service/solicitudesService";

const SolicitudCard = ({ solicitud, fetchSolicitudes }) => {
  const [form, setForm] = useState(solicitud);
  const deshabilitar = solicitud.estado == form.estado;

  const handleclick = async () => {
    try {
      const payload = {
        solicitud_id: form.id,
      };
      console.log(payload);
      await solicitudesService.actualizarEstadoSolicitud(payload);
      await fetchSolicitudes();
      toast.success("Solicitud actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado");
      console.error(error);
    }
  };
  return (
    <Card key={solicitud.id} className="p-4  gap-2">
      <CardHeader>
        <CardTitle>
          {solicitud.usuario_solicitante.nombres}{" "}
          {solicitud.usuario_solicitante.nombres}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <article className="flex justify-between space-x-8">
          <section className="flex flex-wrap space-y-2 justify-between w-full">
            <div className="flex space-x-2">
              <CalendarIcon className="size-5 text-neutral-700" />
              <span className="text-sm text-neutral-600 font-light">
                {new Date(`${solicitud.fecha}T00:00:00`).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <Badge
              className={`${
                solicitud.estado === "entregado"
                  ? "bg-amber-500"
                  : "bg-green-600"
              }`}
            >
              {solicitud.estado === "entregado" ? "Entregado" : "Solicitado"}
            </Badge>
          </section>
        </article>
        <article className="">
          <div className="flex space-x-2">
            <BoxesIcon className="size-5 text-neutral-700" />
            <span className="text-sm text-neutral-600 font-light">Equipos</span>
          </div>
          <section className="flex flex-wrap gap-2 mt-2.5 ">
            {solicitud.equipos.map((e, i) => (
              <Badge
                key={i}
                className="bg-neutral-100 shadow font-light text-neutral-700"
                // className={`${e.tipo==="herramienta"?"bg-neutral-100 text-neutral-700":"text-white bg-amber-400"} shadow font-light `}
              >
                {e.nombre}
              </Badge>
            ))}
          </section>
        </article>
      </CardContent>
      <CardFooter className="justify-between grid-cols-2 gap-4 mt-6">
        {solicitud.estado === "solicitado" && (
          <>
            <SelectConEtiquetaFlotante
              value={form.estado}
              onChange={(name, value) => setForm({ ...form, estado: value })}
              name="estado"
              label="Estado Solicitud"
              opciones={opciones_cambio_estado}
            />
            <Button
              className="bg-green-600"
              disabled={deshabilitar}
              onClick={() => handleclick()}
            >
              Guardar
            </Button>
          </>
        )}
        {solicitud.estado === "entregado" && solicitud?.usuario_atendio && (
          <div className="text-sm">
            <span className="text-neutral-700">Entregado por:</span>
            <span className="text-neutral-600">
              {" "}
              {solicitud.usuario_atendio.nombres}{" "}
              {solicitud.usuario_atendio.apellidos}
            </span>
            <div className="flex gap-2">
              <CalendarIcon className="size-4" />
              {new Date(
                `${solicitud.fecha_entrega}T00:00:00`
              ).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SolicitudCard;
