import { z } from "zod";
import { registry } from "../lib/openapi";
import { festivalSchema } from "../dtos/festival.dto";

// ── Schemas ───────────────────────────────────────────────────────────────────

// festivalSchema usa .transform() en fechas y .preprocess() en aforo.
// La librería infiere la entrada correctamente (string para fechas, number para aforo).
export const FestivalRequestSchema = registry.register(
  "FestivalRequest",
  festivalSchema.openapi("FestivalRequest", {
    description:
      "Datos del festival. Las fechas se envían como string YYYY-MM-DD y se transforman internamente a Date.",
  }),
);

export const FestivalResponseSchema = registry.register(
  "FestivalResponse",
  z
    .object({
      id: z.string(),
      nombre: z.string(),
      estado: z.enum(["Activo", "Cancelado"]),
      ubicacion: z.string(),
      f_inicio: z.string().datetime(),
      f_fin: z.string().datetime(),
      empresa: z.string(),
      descripcion: z.string(),
      aforo: z.number().int(),
      imagen: z.string().nullable().optional(),
    })
    .openapi("FestivalResponse"),
);

const AddArtistSchema = registry.register(
  "AddArtistToFestivalRequest",
  z
    .object({
      festival: z.string().openapi({ description: "ID del festival" }),
      artist: z.string().openapi({ description: "ID del artista en Spotify" }),
    })
    .openapi("AddArtistToFestivalRequest"),
);

const AddTicketSchema = registry.register(
  "AddTicketToFestivalRequest",
  z
    .object({
      festival: z.string().openapi({ description: "ID del festival" }),
      nombre: z.string().openapi({ example: "VIP" }),
      precio: z.number().nonnegative().openapi({ example: 120.0, description: "Precio en euros" }),
      stock: z.number().int().nonnegative().openapi({ example: 500 }),
    })
    .openapi("AddTicketToFestivalRequest"),
);

const CancelFestivalSchema = registry.register(
  "CancelFestivalRequest",
  z
    .object({ id: z.string().openapi({ description: "ID del festival a cancelar" }) })
    .openapi("CancelFestivalRequest"),
);

// ── Helpers locales ───────────────────────────────────────────────────────────

const jwt = [{ bearerAuth: [] }];

const body = (schema: z.ZodTypeAny) => ({
  body: { required: true as const, content: { "application/json": { schema } } },
});

const ErrorSchema = z.object({ error: z.string().openapi({ example: "Mensaje de error" }) });
const e = (code: number, description: string) => ({
  [code]: { description, content: { "application/json": { schema: ErrorSchema } } },
});

// ── Paths ─────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get",
  path: "/festival/images",
  tags: ["Festivals"],
  summary: "Imágenes destacadas de festivales",
  description: "Endpoint público.",
  responses: {
    200: {
      description: "Lista de imágenes",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(
              z.object({ id: z.string(), nombre: z.string(), imagen: z.string().url() }),
            ),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/festival",
  tags: ["Festivals"],
  summary: "Listar todos los festivales",
  description: "Endpoint público.",
  responses: {
    200: {
      description: "Lista de festivales",
      content: { "application/json": { schema: z.object({ data: z.array(FestivalResponseSchema) }) } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/festival/{id}",
  tags: ["Festivals"],
  summary: "Obtener festival por ID",
  description: "Endpoint público.",
  request: {
    params: z.object({ id: z.string().openapi({ description: "ID del festival" }) }),
  },
  responses: {
    200: {
      description: "Festival",
      content: { "application/json": { schema: z.object({ data: FestivalResponseSchema }) } },
    },
    ...e(404, "Festival no encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/add",
  tags: ["Festivals"],
  summary: "Crear festival",
  description: "Solo **empresa**.",
  security: jwt,
  request: body(FestivalRequestSchema),
  responses: {
    201: {
      description: "Festival creado",
      content: { "application/json": { schema: z.object({ data: FestivalResponseSchema }) } },
    },
    ...e(400, "Datos inválidos"),
    ...e(403, "Solo empresa"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/update",
  tags: ["Festivals"],
  summary: "Actualizar festival",
  description: "Solo la empresa propietaria o **admin**.",
  security: jwt,
  request: body(FestivalRequestSchema),
  responses: {
    200: {
      description: "Festival actualizado",
      content: { "application/json": { schema: z.object({ data: FestivalResponseSchema }) } },
    },
    ...e(403, "No es el propietario"),
    ...e(404, "Festival no encontrado"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/festival/delete",
  tags: ["Festivals"],
  summary: "Eliminar festival",
  description: "Solo la empresa propietaria o **admin**.",
  security: jwt,
  request: body(z.object({ id: z.string().openapi({ description: "ID del festival" }) })),
  responses: {
    200: {
      description: "Festival eliminado",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    ...e(403, "No es el propietario"),
    ...e(404, "Festival no encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/artist/add",
  tags: ["Festivals"],
  summary: "Añadir artista al festival",
  description: "Solo la empresa propietaria. Rol: **empresa**.",
  security: jwt,
  request: body(AddArtistSchema),
  responses: {
    200: { description: "Artista añadido" },
    ...e(403, "No es el propietario"),
    ...e(404, "Festival o artista no encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/ticket/add",
  tags: ["Festivals"],
  summary: "Añadir tipo de entrada al festival",
  description: "Solo la empresa propietaria. Rol: **empresa**.",
  security: jwt,
  request: body(AddTicketSchema),
  responses: {
    200: { description: "Entrada añadida" },
    ...e(403, "No es el propietario"),
    ...e(404, "Festival no encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/cancel",
  tags: ["Festivals"],
  summary: "Cancelar festival",
  description: "Solo si faltan **más de 3 días** para el inicio. Roles: **empresa**, **admin**.",
  security: jwt,
  request: body(CancelFestivalSchema),
  responses: {
    200: {
      description: "Festival cancelado",
      content: { "application/json": { schema: z.object({ data: FestivalResponseSchema }) } },
    },
    ...e(400, "Menos de 3 días para el inicio"),
    ...e(403, "No es el propietario"),
    ...e(404, "Festival no encontrado"),
  },
});
