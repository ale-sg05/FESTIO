/**
 * openapi.ts — Inicialización del registry de OpenAPI.
 *
 * IMPORTANTE: este módulo debe ser el PRIMERO en importarse (ver index.ts).
 * `extendZodWithOpenApi(z)` añade `.openapi()` al prototipo de Zod y
 * debe ejecutarse antes de que cualquier otro módulo use `.openapi()`.
 */

import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Debe llamarse una vez, antes de definir cualquier schema con .openapi()
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Esquema de seguridad JWT reutilizado por todos los dominios
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "Token JWT obtenido al hacer sign-in. Header: `Authorization: Bearer <token>`",
});
