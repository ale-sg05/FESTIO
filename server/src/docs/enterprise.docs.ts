import { z } from "zod";
import { registry } from "../lib/openapi";
import { EnterpriseDTO, CreateEnterpriseDTO, RestrictEnterpriseDTO } from "../dtos/enterprise.dto";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const CreateEnterpriseSchema = registry.register(
  "CreateEnterpriseRequest",
  CreateEnterpriseDTO.openapi("CreateEnterpriseRequest", {
    description:
      "Datos para crear una empresa. `verificada` y `restringida` solo los cambia el admin.",
  }),
);

export const UpdateEnterpriseSchema = registry.register(
  "UpdateEnterpriseRequest",
  EnterpriseDTO.openapi("UpdateEnterpriseRequest", {
    description: "Datos completos de la empresa para actualizar.",
  }),
);

export const RestrictEnterpriseSchema = registry.register(
  "RestrictEnterpriseRequest",
  RestrictEnterpriseDTO.openapi("RestrictEnterpriseRequest", {
    description: "`status: true` activa la restricción/verificación; `false` la desactiva.",
  }),
);

export const EnterpriseResponseSchema = registry.register(
  "EnterpriseResponse",
  z
    .object({
      id: z.string().uuid(),
      cif: z.string().openapi({ example: "A12345678" }),
      persona: z.string(),
      correo: z.string().email(),
      telefono: z.string(),
      razonSocial: z.string(),
      domicilio: z.string(),
      verificada: z.boolean(),
      restringida: z.boolean(),
      motivoRestriccion: z.string().nullable().optional(),
    })
    .openapi("EnterpriseResponse"),
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
  path: "/enterprise",
  tags: ["Enterprises"],
  summary: "Listar todas las empresas",
  description: "Solo **admin**.",
  security: jwt,
  responses: {
    200: {
      description: "Lista de empresas",
      content: { "application/json": { schema: z.object({ data: z.array(EnterpriseResponseSchema) }) } },
    },
    ...e(403, "Acceso denegado"),
  },
});

registry.registerPath({
  method: "get",
  path: "/enterprise/{id}",
  tags: ["Enterprises"],
  summary: "Obtener empresa por ID",
  description: "La empresa solo puede ver sus propios datos. Roles: **admin**, **empresa**.",
  security: jwt,
  request: {
    params: z.object({ id: z.string().openapi({ description: "ID de la empresa" }) }),
  },
  responses: {
    200: {
      description: "Datos de la empresa",
      content: { "application/json": { schema: z.object({ data: EnterpriseResponseSchema }) } },
    },
    ...e(403, "No es el propietario"),
    ...e(404, "Empresa no encontrada"),
  },
});

registry.registerPath({
  method: "put",
  path: "/enterprise/add",
  tags: ["Enterprises"],
  summary: "Crear empresa",
  description: "Endpoint público.",
  request: body(CreateEnterpriseSchema),
  responses: {
    201: {
      description: "Empresa creada",
      content: { "application/json": { schema: z.object({ data: EnterpriseResponseSchema }) } },
    },
    ...e(400, "Datos inválidos"),
  },
});

registry.registerPath({
  method: "post",
  path: "/enterprise/update",
  tags: ["Enterprises"],
  summary: "Actualizar empresa",
  description:
    "Solo el admin puede cambiar `verificada` y `restringida`. Roles: **empresa**, **admin**.",
  security: jwt,
  request: body(UpdateEnterpriseSchema),
  responses: {
    200: {
      description: "Empresa actualizada",
      content: { "application/json": { schema: z.object({ data: EnterpriseResponseSchema }) } },
    },
    ...e(400, "Datos inválidos"),
    ...e(403, "Sin permisos suficientes"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/enterprise/delete",
  tags: ["Enterprises"],
  summary: "Eliminar empresa",
  description: "El ID se extrae del token. Roles: **empresa**, **admin**.",
  security: jwt,
  responses: {
    200: {
      description: "Empresa eliminada",
      content: {
        "application/json": { schema: z.object({ data: z.object({ message: z.string() }) }) },
      },
    },
    ...e(400, "Error de negocio"),
  },
});

registry.registerPath({
  method: "post",
  path: "/enterprise/restrict",
  tags: ["Enterprises"],
  summary: "Restringir / quitar restricción",
  description: "Solo **admin**.",
  security: jwt,
  request: body(RestrictEnterpriseSchema),
  responses: {
    200: {
      description: "Estado actualizado",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ enterprise: z.string(), restringida: z.boolean() }) }),
        },
      },
    },
    ...e(400, "Datos inválidos"),
    ...e(403, "Solo admin"),
  },
});

registry.registerPath({
  method: "post",
  path: "/enterprise/verify",
  tags: ["Enterprises"],
  summary: "Verificar / revocar verificación",
  description: "Solo **admin**.",
  security: jwt,
  request: body(RestrictEnterpriseSchema),
  responses: {
    200: {
      description: "Estado actualizado",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ enterprise: z.string(), verificada: z.boolean() }) }),
        },
      },
    },
    ...e(403, "Solo admin"),
  },
});

registry.registerPath({
  method: "get",
  path: "/enterprise/{id}/dashboard",
  tags: ["Enterprises"],
  summary: "Dashboard de la empresa",
  description: "Métricas y resumen de festivales. Roles: **admin**, **empresa**.",
  security: jwt,
  request: {
    params: z.object({ id: z.string().openapi({ description: "ID de la empresa" }) }),
  },
  responses: {
    200: { description: "Datos del dashboard" },
    ...e(403, "No es el propietario"),
  },
});
