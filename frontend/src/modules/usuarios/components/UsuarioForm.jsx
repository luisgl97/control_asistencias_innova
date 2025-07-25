import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { useState } from "react";
import InputConEtiquetaFlotante from "../../../shared/components/InputConEtiquetaFlotante";
import SelectConEtiquetaFlotante from "../../../shared/components/selectConEtiquetaFlotante";
import usuarioSchema from "../schemas/registroUsuarioSchema";
import usuarioService from "../services/usuarioService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const claves = {
   nombres: "",
   apellidos: "",
   email: "",
   dni: "",
   password: "",
   rol: "",
   cargo: "",
   filial: "",
};
const UsuarioForm = () => {
   const navigate=useNavigate()
   const [errores, setErrores] = useState({ ...claves });
   const [form, setForm] = useState({ ...claves });
   const [isLoading, setIsLoading] = useState(false);
   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await usuarioSchema.validate(form, {
            abortEarly: false,
         });
         setIsLoading(true);
         await usuarioService.crear(form);
         navigate('/usuarios')
         toast.success("Se creó el usuario exitosamente");
      } catch (error) {
         if (error.name === "ValidationError") {
            const errors = {};
            error.inner.forEach((err) => {
               errors[err.path] = err.message;
            });
            console.log("Errores de validación:", errors);
            setErrores(errors);
         } else {
            console.error("Error desconocido:", error);
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleChange = (e) => {
      setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
   };

   const opciones_filiales = [
      { value: "1", label: "ENCOFRADOS INNOVA S.A.C." },
      { value: "2", label: "ANDAMIOS ELECTRICOS INNOVA S.A.C." },
      { value: "3", label: "INDEK ANDINA E.I.R.L" },
      { value: "4", label: "INNOVA RENTAL MAQUINARIA SAC" },
   ];
   const opciones_roles = [
      { value: "GERENTE", label: "Gerente" },
      { value: "ADMINISTRADOR", label: "Administrador" },
      { value: "TRABAJADOR", label: "Trabajador" },
      { value: "LIDER TRABAJADOR", label: "Lider de trabajadores" },
   ];
   const opciones_cargo = [
      { value: "MONTADOR", label: "Montador" },
      { value: "ALMACEN", label: "Almacen" },
   ];

   return (
      <Card className="max-w-2xl mx-auto mt-8">
         <CardHeader>
            <CardTitle>Registrar Usuario</CardTitle>
            <CardDescription>
               Completa los datos para registrar un nuevo usuario
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form
               onSubmit={handleSubmit}
               className="space-y-2 "
               id="form-usuario"
               autoComplete="off"
            >
               <article className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"Nombres del usuario"}
                        name={"nombres"}
                        value={form.nombres}
                     />
                     {errores.nombres && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.nombres}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"Apellidos del usuario"}
                        name={"apellidos"}
                        value={form.apellidos}
                     />
                     {errores.apellidos && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.apellidos}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"D.N.I del usuario"}
                        name={"dni"}
                        value={form.dni}
                     />
                     {errores.dni && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.dni}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"Ingrese el email"}
                        name={"email"}
                        value={form.email}
                     />
                     {errores.email && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.email}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"Ingrese la contraseña"}
                        name={"password"}
                        value={form.password}
                     />
                     {errores.password && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.password}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <SelectConEtiquetaFlotante
                        value={form.filial}
                        onChange={(name, value) =>
                           setForm({ ...form, [name]: value })
                        }
                        name="filial"
                        label="Ingrese la filial"
                        opciones={opciones_filiales}
                     />
                     {errores.filial && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.filial}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <SelectConEtiquetaFlotante
                        value={form.rol}
                        onChange={(name, value) => {
                           const nuevoForm = { ...form, [name]: value };
                           if (value === "GERENTE") {
                              nuevoForm.cargo = "";
                           }
                           setForm(nuevoForm);
                        }}
                        name="rol"
                        label="Ingrese el rol"
                        opciones={opciones_roles}
                     />
                     {errores.rol && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.rol}
                        </p>
                     )}
                  </section>

                  {form.rol !== "GERENTE" && (
                     <section className="w-full">
                        <SelectConEtiquetaFlotante
                           value={form.cargo}
                           onChange={(name, value) =>
                              setForm({ ...form, [name]: value })
                           }
                           name="cargo"
                           label="Ingrese el cargo"
                           opciones={opciones_cargo}
                        />
                        {errores.cargo && (
                           <p className="text-red-500 text-xs pl-2">
                              * {errores.cargo}
                           </p>
                        )}
                     </section>
                  )}
               </article>
            </form>
         </CardContent>
         <CardFooter className="justify-end gap-8">
            <Button variant="outline" disabled={isLoading} onClick={()=>navigate('/usuarios')}>
               {" "}
               Cancelar
            </Button>
            <Button
               className="bg-innova-blue"
               type="submit"
               form="form-usuario"
               disabled={isLoading}
            >
               {isLoading ? (
                  <span className="flex items-center gap-2">
                     <Loader2 className="animate-spin h-4 w-4" />
                  </span>
               ) : (
                  "Aceptar"
               )}
            </Button>
         </CardFooter>
      </Card>
   );
};
export default UsuarioForm;
