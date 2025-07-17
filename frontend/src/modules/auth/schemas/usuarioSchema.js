import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("El correo no es válido")
    .test(
      "domain",
      "El correo debe pertenecer al dominio @grupoinnova.pe",
      (value) => value?.endsWith("@grupoinnova.pe") || false
    ),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});


//    const schema = obtenerContactoSchema();


//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//          const datosValidados = await schema.validate(contacto, {
//             abortEarly: false,
//          });
//          setErrores({});

//          onSubmit(datosValidados);
//          closeModal();
//       } catch (err) {
//          const nuevosErrores = {};
//          err.inner.forEach((e) => {
//             nuevosErrores[e.path] = e.message;
//          });

//          setErrores(nuevosErrores);
//          toast.error("Faltan campos obligatorios");
//       }
//    };
