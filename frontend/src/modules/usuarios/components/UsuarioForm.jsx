import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import InputConEtiquetaFlotante from "../../../shared/components/InputConEtiquetaFlotante";
import SelectConEtiquetaFlotante from "../../../shared/components/selectConEtiquetaFlotante";
import usuarioSchema from "../schemas/registroUsuarioSchema";
import usuarioService from "../services/usuarioService";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
   opciones_cargo,
   opciones_documento,
   opciones_filiales,
   opciones_roles,
} from "../utils/optionsUsuarioForm";

const claves = {
   id: null,
   nombres: "",
   apellidos: "",
   email: "",
   dni: "",
   password: "",
   rol: "",
   cargo: "",
   filial_id: "",
   tipo_documento: "",
};
const UsuarioForm = () => {
   const [searchParams] = useSearchParams();
   const id = searchParams.get("id"); // "asc"
   const navigate = useNavigate();
   const [errores, setErrores] = useState({ ...claves });
   const [form, setForm] = useState({ ...claves });

   const [isLoading, setIsLoading] = useState(true);

   const fetchTrabajador = async () => {
      try {
         const res = await usuarioService.getUsuario(id);
         const usuario = res.data.usuario;
         setForm({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            dni: usuario.dni,
            rol: usuario.rol,
            email: usuario.email,
            filial_id: usuario.filial.id.toString(),
            id: usuario.id,
            cargo: usuario.cargo,
            tipo_documento: usuario.tipo_documento,
         });
      } catch (error) {
      } finally {
         setIsLoading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await usuarioSchema(!!form.id).validate(form, {
            abortEarly: false,
         });

         setIsLoading(true);
         if (form.id) {
            const datos = {
               ...res,
               cargo: res.rol === "GERENTE" ? null : res.cargo,
            };
            await usuarioService.editar(datos, form.id);
            toast.success("Se Edito el usuario exitosamente");
            fetchTrabajador();
         } else {

            await usuarioService.crear(form);
            navigate("/usuarios");
            toast.success("Se creó el usuario exitosamente");
         }
      } catch (error) {

         if (error.name === "ValidationError") {
            const errors = {};
            error.inner.forEach((err) => {
               errors[err.path] = err.message;
            });
            setErrores(errors);
         } else if (error.response.data.mensaje) {
            toast.error(error.response.data.mensaje);
         } else {
            toast.error("Error Desconocido:");
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (id) {
         fetchTrabajador();
      } else {
         setIsLoading(false);
      }
   }, []);
   const handleChange = (e) => {
      setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
   };

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
                        disabled={isLoading}
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
                        disabled={isLoading}
                     />
                     {errores.apellidos && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.apellidos}
                        </p>
                     )}
                  </section>
                  {/* tipo_documento */}
                  <section className="w-full">
                     <SelectConEtiquetaFlotante
                        value={form.tipo_documento}
                        onChange={(name, value) =>
                           setForm({ ...form, [name]: value })
                        }
                        name="tipo_documento"
                        label="Tipo de documento"
                        opciones={opciones_documento}
                        disabled={isLoading}
                     />
                     {errores.tipo_documento && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.tipo_documento}
                        </p>
                     )}
                  </section>

                  <section className="w-full">
                     <InputConEtiquetaFlotante
                        handleChange={handleChange}
                        label={"Numero de Documento"}
                        name={"dni"}
                        value={form.dni}
                        disabled={isLoading}
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
                        disabled={isLoading}
                     />
                     {errores.email && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.email}
                        </p>
                     )}
                  </section>
                  {!form.id && (
                     <section className="w-full">
                        <InputConEtiquetaFlotante
                           handleChange={handleChange}
                           label={"Ingrese la contraseña"}
                           name={"password"}
                           value={form.password}
                           disabled={isLoading}
                        />
                        {errores.password && (
                           <p className="text-red-500 text-xs pl-2">
                              * {errores.password}
                           </p>
                        )}
                     </section>
                  )}

                  <section className="w-full">
                     <SelectConEtiquetaFlotante
                        value={form.filial_id}
                        onChange={(name, value) =>
                           setForm({ ...form, [name]: value })
                        }
                        name="filial_id"
                        label="Ingrese la filial"
                        opciones={opciones_filiales}
                        disabled={isLoading}
                     />
                     {errores.filial_id && (
                        <p className="text-red-500 text-xs pl-2">
                           * {errores.filial_id}
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
                        disabled={isLoading}
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
                           disabled={isLoading}
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
            <Button
               variant="outline"
               disabled={isLoading}
               onClick={() => navigate("/usuarios")}
            >
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
export default UsuarioForm;
