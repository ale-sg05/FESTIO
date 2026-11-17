import { z } from "zod";
import { registry } from "../lib/openapi";
import { ClientDTO } from "../dtos/client.dto";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const ClientRequestSchema = registry.register(
  "ClientRequest",
  ClientDTO.openapi("ClientRequest", {
    description: "Datos del cliente. La contraseña se almacena hasheada.",
  }),
);

export const ClientResponseSchema = registry.register(
  "ClientResponse",
  z
    .object({
      id: z.string().uuid(),
      nombre: z.string(),
      apellidos: z.string(),
      correo: z.string().email(),
      dni: z.string(),
      fecha_nacimiento: z.string().datetime(),
      telefono: z.string(),
    })
    .openapi("ClientResponse"),
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
  path: "/client",
  tags: ["Clients"],
  summary: "Listar todos los clientes",
  description: "Solo **admin**.",
  security: jwt,
  responses: {
    200: {
      description: "Lista de clientes",
      content: { "application/json": { schema: z.object({ data: z.array(ClientResponseSchema) }) } },
    },
    ...e(401, "No autenticado"),
    ...e(403, "Acceso denegado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/client/get",
  tags: ["Clients"],
  summary: "Obtener datos del cliente autenticado",
  description: "Extrae el ID del token JWT. Roles: **cliente**, **admin**.",
  security: jwt,
  responses: {
    200: {
      description: "Datos del cliente",
      content: { "application/json": { schema: z.object({ data: ClientResponseSchema }) } },
    },
    ...e(403, "Token sin ID válido"),
    ...e(404, "Cliente no encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/client/add",
  tags: ["Clients"],
  summary: "Crear un nuevo cliente",
  description: "Endpoint público.",
  request: body(ClientRequestSchema),
  responses: {
    201: {
      description: "Cliente creado",
      content: { "application/json": { schema: z.object({ data: ClientResponseSchema }) } },
    },
    ...e(400, "Datos inválidos"),
  },
});

registry.registerPath({
  method: "post",
  path: "/client/update",
  tags: ["Clients"],
  summary: "Actualizar datos del cliente",
  description: "Un cliente solo puede actualizar su propia cuenta. Roles: **cliente**, **admin**.",
  security: jwt,
  request: body(ClientRequestSchema),
  responses: {
    200: {
      description: "Cliente actualizado",
      content: { "application/json": { schema: z.object({ data: ClientResponseSchema }) } },
    },
    ...e(400, "Datos inválidos"),
    ...e(403, "Sin permiso"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/client/delete",
  tags: ["Clients"],
  summary: "Eliminar cliente",
  description: "El ID se extrae del token. Roles: **cliente**, **admin**.",
  security: jwt,
  responses: {
    204: { description: "Cliente eliminado" },
    ...e(403, "Sin ID en token"),
  },
});

registry.registerPath({
  method: "get",
  path: "/client/festivals",
  tags: ["Clients"],
  summary: "Festivales del cliente autenticado",
  description: "Roles: **cliente**, **admin**.",
  security: jwt,
  responses: {
    200: {
      description: "Lista de festivales",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(
              z.object({
                id: z.string(),
                nombre: z.string(),
                estado: z.enum(["Activo", "Cancelado"]),
                ubicacion: z.string(),
                f_inicio: z.string().datetime(),
                f_fin: z.string().datetime(),
              }),
            ),
          }),
        },
      },
    },
    ...e(403, "Sin ID en token"),
  },
});

registry.registerPath({
  method: "get",
  path: "/client/ticket/{id}",
  tags: ["Clients"],
  summary: "Detalle de una entrada",
  description: "Roles: **cliente**, **admin**.",
  security: jwt,
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: "UUID de la entrada (abono_cliente)" }),
    }),
  },
  responses: {
    200: { description: "Detalle de la entrada" },
    ...e(400, "UUID inválido"),
    ...e(403, "Sin permiso"),
  },
});
