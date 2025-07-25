import * as yup from "yup";

const usuarioSchema = yup.object({
   nombres: yup
      .string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("Los nombres son obligatorios"),

   apellidos: yup
      .string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("Los apellidos son obligatorios"),

   email: yup
      .string()
      .email("Debe ser un correo válido")
      .matches(
         /^[\w.%+-]+@grupoinnova\.pe$/,
         "El correo debe terminar en @grupoinnova.pe"
      )
      .required("El correo es obligatorio"),

   password: yup
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[\W_]/, "Debe contener al menos un carácter especial")
      .required("La contraseña es obligatoria"),

   filial: yup.string().required("Debe seleccionar una filial"),

   rol: yup.string().required("Debe seleccionar un rol"),
   dni: yup.string().required("Debe Ingresar el DNI"),
   cargo: yup
      .string()
      .nullable()
      .when("rol", {
         is: (rol) => rol !== "GERENTE",
         then: (schema) => schema.required("Debe seleccionar un cargo"),
         otherwise: (schema) => schema.nullable(),
      }),
});

export default usuarioSchema;
