import { z } from "zod";

export const EnterpriseDTO = z.object({
  id: z.string(),
  cif: z.string().min(1, "El CIF es requerido").max(9),
  persona: z.string().min(1, "El nombre de la persona de contacto es requerido"),
  correo: z.email("El correo debe ser válido"),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .max(15),
  razonSocial: z.string().min(1, "La razón social es requerida"),
  domicilio: z.string().min(1, "El domicilio es requerido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  verificada: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return value === "true";
      }

      return value;
    }, z.boolean())
    .default(false),
  restringida: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return value === "true";
      }

      return value;
    }, z.boolean())
    .default(false),
  motivoRestriccion: z.string().nullable().optional(),
});

export const RestrictEnterpriseDTO = z.object({
  id: z.string(),
  status: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return value === "true";
      }

      return value;
    }, z.boolean())
    .default(false),
});

export const CreateEnterpriseDTO = EnterpriseDTO.omit({ id: true });

export type CreateEnterpriseDTOType = z.infer<typeof CreateEnterpriseDTO>;
export type EnterpriseDTOType = z.infer<typeof EnterpriseDTO>;
export type RestrictEnterpriseDTOType = z.infer<typeof RestrictEnterpriseDTO>;
