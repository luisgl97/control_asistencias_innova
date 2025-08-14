import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InputConEtiquetaFlotante from "@/shared/components/InputConEtiquetaFlotante";
import { Loader2, LocateFixed, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgregarObraForm = ({
    handleChange,
    form,
    errores,
    isLoading,
    buscarUbicacion,
    handleRadioChange,
    showRadio,
    handleSubmit,
    isLoadingBtnSave
}) => {
    const navigate = useNavigate()

    return (
        <Card className="md:mt-8 min-h-[10vh] w-full  border-2 border-gray-300 shadow-md">
            <CardHeader>
                <CardTitle>Registrar Obra</CardTitle>
                <CardDescription>
                    Completa los datos para registrar una nueva obra
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    // onSubmit={handleSubmit}
                    className="space-y-2 "
                    id="form-usuario"
                    autoComplete="off"
                >
                    <article className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                        <section className="w-full col-span-2">
                            <InputConEtiquetaFlotante
                                handleChange={handleChange}
                                label={"Nombre de la obra"}
                                name={"nombre"}
                                value={form.nombre}
                                disabled={isLoading}
                            />
                            {errores.nombre && (
                                <p className="text-red-500 text-xs pl-2">* {errores.nombre}</p>
                            )}
                        </section>

                        <section className="w-full col-span-2">
                            <div className="flex gap-2 w-full">
                                <InputConEtiquetaFlotante
                                    handleChange={handleChange}
                                    label={"Direccion"}
                                    name={"direccion"}
                                    value={form.direccion}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={(e) => buscarUbicacion(e)}
                                    className="cursor-pointer bg-green-500 hover:bg-green-600 hover:scale-105 transition-all w-9 h-8 flex items-center justify-center rounded-full text-white"
                                >
                                    <LocateFixed className="w-6 h-6" />
                                </button>
                            </div>
                            {errores.direccion && (
                                <p className="text-red-500 text-xs pl-2">
                                    * {errores.direccion}
                                </p>
                            )}
                        </section>

                        {/* <section className="w-full">
                            <InputConEtiquetaFlotante
                                handleChange={handleChange}
                                label={"Latitud"}
                                name={"latitud"}
                                value={form.latitud || ""} // Usar '' para evitar warning si es null
                                disabled={isLoading}
                            />
                            {errores.latitud && (
                                <p className="text-red-500 text-xs pl-2">* {errores.latitud}</p>
                            )}
                        </section>

                        <section className="w-full">
                            <InputConEtiquetaFlotante
                                handleChange={handleChange}
                                label={"Longitud"}
                                name={"longitud"}
                                value={form.longitud || ""} // Usar '' para evitar warning si es null
                                disabled={isLoading}
                            />
                            {errores.longitud && (
                                <p className="text-red-500 text-xs pl-2">
                                    * {errores.longitud}
                                </p>
                            )}
                        </section> */}

                        <section className="w-full flex flex-col col-span-2">
                            <label className="flex items-center space-x-2 py-1 pl2">
                                <span>Ver Radio</span>
                            </label>
                            <button
                                onClick={(e) => handleRadioChange(e)}
                                className={`cursor-pointer ${showRadio ? "bg-blue-500" : "bg-gray-500"
                                    }  hover:scale-105 transition-all w-9 h-8 flex items-center justify-center rounded-md text-white`}
                            >
                                <Map className="w-6 h-6" />
                            </button>

                        </section>
                    </article>
                </form>
            </CardContent>
            <CardFooter className="justify-end gap-x-2">
                <Button
                    variant="outline"
                    className={" hover:bg-red-400  hover:text-white transition-all text-red-500 cursor-pointer"}
                    onClick={() => navigate("/obras")}
                >
                    Cancelar
                </Button>
                <Button
                    className="bg-blue-500 hover:bg-blue-700  transition-all text-white cursor-pointer"
                    type="submit"
                    form="form-usuario"
                    disabled={isLoading || isLoadingBtnSave}
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" />
                        </span>
                    ) : form.id ? (
                        "Actualizar"
                    ) : (
                        "Guardar"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AgregarObraForm;
