import * as yup from "yup";

const usuarioSchema = (edicion = false) =>
   yup.object({
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

      password: edicion
         ? yup.string().notRequired()
         : yup
              .string()
              .min(8, "La contraseña debe tener al menos 8 caracteres")
              .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
              .matches(/[0-9]/, "Debe contener al menos un número")
              .required("La contraseña es obligatoria"),

      filial_id: yup.string().required("Debe seleccionar una filial"),
      rol: yup.string().required("Debe seleccionar un rol"),
      dni: yup.string().required("Debe Ingresar el DNI"),
      tipo_documento: yup.string().required("Seleccione el Tipo de Doc."),
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
