import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTabla } from "./SkeletonTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ModalHorasExtras from "./ModalHorasExtras";
import AsistenciaDetailDialog from "./AsistenciaDetalleModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModalJustificarPermiso } from "./ModalJustificarPermiso";
import SelectConEtiquetaFlotante from "@/shared/components/selectConEtiquetaFlotante";
import { opciones_filiales_asistencia } from "@/modules/usuarios/utils/optionsUsuarioForm";
import useAsistenciaDiaria from "../hooks/useAsistenciaDiaria";

const estilos = {
  ASISTIO: "bg-green-50 text-green-700 border-green-200",
  PRESENTE: "bg-green-50 text-green-700 border-green-200",
  "FALTA JUSTIFICADA": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const AsistenciaPordia = () => {
  const {
    user,
    datosAsistencia,
    cargando,
    error,

    filial,
    setFilial,

    fechaSeleccionada,
    setFechaSeleccionada,

    nombreTrabajador,
    setNombreTrabajador,

    obra,
    setObra,
    opcionesObras,

    cargarDatos,
  } = useAsistenciaDiaria();

  if (cargando) {
    return (
      <div className="w-full max-w-7xl ">
        <SkeletonTabla />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto ">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={cargarDatos}
              className="ml-4 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Card className="">
      <CardHeader>
        <section className="flex-0">
          <CardTitle className="text-lg md:text-2xl">
            Control de Asistencias Diarias
          </CardTitle>
        </section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <section className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectConEtiquetaFlotante
              value={filial}
              onChange={(name, value) => setFilial(value)}
              name="filial_id"
              label="Busca por filial"
              opciones={opciones_filiales_asistencia}
            />

            <div className="w-full md:w-auto">
              <SelectConEtiquetaFlotante
                value={obra}
                onChange={(name, value) => setObra(value)}
                name="obra"
                label="Filtrar por obra"
                opciones={opcionesObras}
              />
            </div>

            <div className="w-full md:w-auto">
              <Input
                placeholder="Buscar trabajador, documento u obra"
                value={nombreTrabajador}
                onChange={(e) => setNombreTrabajador(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <Calendar className="h-4 w-4" />
              <Label htmlFor="fecha" className="text-sm whitespace-nowrap">
                Fecha:
              </Label>
              <Input
                id="fecha"
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="w-full md:w-auto md:min-w-[200px]"
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </section>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Trabajador</TableHead>
                <TableHead className="text-left">Documento</TableHead>
                <TableHead className="text-left">Obras asignadas</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Hora ingreso</TableHead>
                <TableHead className="text-center">Hora salida</TableHead>
                <TableHead className="text-center">Horas extras</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {datosAsistencia.map((trabajador, indice) => (
                <TableRow key={indice}>
                  <TableCell className="font-medium">
                    {trabajador.trabajador}
                  </TableCell>

                  <TableCell className="font-medium">
                    <p className="text-xs">
                      {trabajador.tipo_documento}: {trabajador.dni}
                    </p>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-wrap gap-1">
                      {(trabajador.obras_asignadas ?? []).map((obra, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[11px]"
                        >
                          {obra}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`${estilos[trabajador.estado]} text-xs`}
                    >
                      {trabajador.estado}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {trabajador.hora_ingreso}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {trabajador.hora_salida}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {trabajador.horas_extras}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center space-x-2">
                    <AsistenciaDetailDialog
                      asistenciaId={trabajador.asistencia_id}
                    />

                    {(trabajador.estado === "SIN REGISTRO" ||
                      trabajador.estado === "FALTA") && (
                      <ModalJustificarPermiso
                        fecha_dia={trabajador.fecha}
                        id={trabajador.id}
                        cargarDatos={cargarDatos}
                        tipo={"FALTA"}
                      />
                    )}

                    {trabajador.estado === "TARDANZA" && (
                      <ModalJustificarPermiso
                        fecha_dia={trabajador.fecha}
                        id={trabajador.id}
                        cargarDatos={cargarDatos}
                        tipo={"TARDANZA"}
                        asistencia_id={trabajador.asistencia_id}
                      />
                    )}

                    {trabajador.asistencia_id &&
                      trabajador.estado !== "FALTA JUSTIFICADA" &&
                      user.rol !== "LIDER TRABAJADOR" && (
                        <ModalHorasExtras
                          cargarDatos={cargarDatos}
                          id={trabajador.asistencia_id}
                          nombres={trabajador.trabajador}
                          hizo_horas_extras={trabajador.hizo_horas_extras}
                        />
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AsistenciaPordia;
