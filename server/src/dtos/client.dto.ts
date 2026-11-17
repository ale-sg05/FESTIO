import { z } from "zod";

export const ClientDTO = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellidos: z.string().min(1, "Los apellidos son requeridos"),
  correo: z.email("El correo debe ser válido"),
  dni: z.string().min(1, "El DNI es requerido").max(9),
  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha debe tener formato YYYY-MM-DD",
    })
    .refine(
      (value) => {
        const [year, month, day] = value.split("-").map(Number);

        const birthDate = new Date(Date.UTC(year, month - 1, day));

        const isValidDate =
          birthDate.getUTCFullYear() === year &&
          birthDate.getUTCMonth() === month - 1 &&
          birthDate.getUTCDate() === day;

        if (!isValidDate) return false;

        const today = new Date();

        let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

        const hasNotHadBirthdayYet =
          today.getUTCMonth() < birthDate.getUTCMonth() ||
          (today.getUTCMonth() === birthDate.getUTCMonth() &&
            today.getUTCDate() < birthDate.getUTCDate());

        if (hasNotHadBirthdayYet) age--;

        return age >= 18;
      },
      {
        message: "Debe ser mayor de edad",
      },
    )
    .transform((value) => {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    }),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .max(15),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type ClientDTOType = z.infer<typeof ClientDTO>;
