import { z } from "zod";

export const festivalSchema = z
  .object({
    id: z.string(),
    nombre: z.string().min(1, "El nombre del festival es requerido"),
    estado: z.enum(["Activo", "Cancelado"]),
    ubicacion: z.string().min(1, "La ubicación es requerida"),
    f_inicio: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La fecha debe tener formato YYYY-MM-DD",
      })
      .transform((value) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      }),
    f_fin: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La fecha debe tener formato YYYY-MM-DD",
      })
      .transform((value) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      }),
    empresa: z.string(),
    descripcion: z.string().min(1, "La descripción es requerida"),
    aforo: z.preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().positive("El aforo debe ser mayor a 0")),
    imagen: z.string().optional(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return data.f_inicio >= today;
    },
    {
      message: "La fecha de inicio debe ser hoy o en el futuro",
      path: ["f_inicio"],
    },
  )
  .refine(
    (data) => {
      return data.f_fin > data.f_inicio;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["f_fin"],
    },
  );

export type FestivalDto = z.infer<typeof festivalSchema>;
