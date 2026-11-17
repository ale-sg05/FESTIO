import { z } from "zod";
import { cifRegex, dniRegex, telefonoRegex } from "../utils/";

export const signUpEmpresaSchema = z.object({
  cif: z.string().trim().regex(cifRegex, "CIF no válido"),

  persona: z.string().trim().min(1, "La persona de contacto es obligatoria"),

  correo: z.email("Correo no válido").trim(),

  telefono: z.string().trim().regex(telefonoRegex, "Teléfono no válido"),

  razonSocial: z.string().trim().min(1, "La razón social es obligatoria"),

  domicilio: z.string().trim().min(1, "El domicilio es obligatorio"),

  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signUpClienteSchema = z.object({
  correo: z.email("Correo no válido").trim(),

  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  apellidos: z.string().trim().min(1, "Los apellidos son obligatorios"),

  dni: z.string().trim().regex(dniRegex, "DNI no válido"),

  fechaNacimiento: z.coerce.date().refine((fecha) => fecha < new Date(), {
    message: "La fecha de nacimiento debe ser anterior a hoy",
  }),

  telefono: z.string().trim().regex(telefonoRegex, "Teléfono no válido"),

  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type SignUpEmpresaDto = z.infer<typeof signUpEmpresaSchema>;
export type SignUpClienteDto = z.infer<typeof signUpClienteSchema>;
