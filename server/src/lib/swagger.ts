/**
 * swagger.ts — Genera y sirve la especificación OpenAPI 3.1.
 *
 * Los schemas y paths están distribuidos por dominio en src/docs/.
 * Este archivo solo los importa para activar su registro y luego
 * genera el documento y monta los endpoints /api-docs y /api-docs.json.
 */

import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import type { Application } from "express";

import { registry } from "./openapi";

// Importar los docs de cada dominio para que registren sus paths y schemas
import "../docs/auth.docs";
import "../docs/artist.docs";
import "../docs/client.docs";
import "../docs/enterprise.docs";
import "../docs/festival.docs";
import "../docs/payment.docs";
import "../docs/logs.docs";

// ── Generación del documento ──────────────────────────────────────────────────

export function buildOpenApiSpec() {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Festival Management API",
      version: "1.0.0",
      description:
        "API REST para la gestión de festivales, artistas, empresas y clientes. " +
        "Autenticación JWT con roles: **admin**, **empresa** y **cliente**.",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}`, description: "Servidor local" },
    ],
    tags: [
      { name: "Auth",        description: "Registro e inicio de sesión" },
      { name: "Artists",     description: "Búsqueda y detalle de artistas (Spotify)" },
      { name: "Clients",     description: "Gestión de clientes" },
      { name: "Enterprises", description: "Gestión de empresas organizadoras" },
      { name: "Festivals",   description: "Gestión de festivales" },
      { name: "Payments",    description: "Compra de entradas y recarga de abonos" },
      { name: "Logs",        description: "Logs del servidor (solo admin)" },
    ],
  });
}

// ── Swagger UI via swagger-ui-express ─────────────────────────────────────────

export function setupSwagger(app: Application): void {
  const spec = buildOpenApiSpec();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec, {
    swaggerOptions: { persistAuthorization: true },
  }));

  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(spec, null, 2));
  });
}
