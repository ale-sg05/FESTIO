import { z } from "zod";
import { registry } from "../lib/openapi";

// artist.dto.ts sólo exporta interfaces TypeScript, no schemas Zod.
// Definimos los schemas inline aquí para la documentación.

const ArtistImageSchema = z.object({
  url: z.string().url(),
  height: z.number().int(),
  width: z.number().int(),
});

const TopTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  album: z.string(),
  durationMs: z.number().int(),
});

const ArtistSchema = registry.register(
  "Artist",
  z
    .object({
      id: z.string().openapi({ example: "6olE6TJLbe7ai5UzxMC3es" }),
      name: z.string().openapi({ example: "Metallica" }),
      images: z.array(ArtistImageSchema),
      topTracks: z.array(TopTrackSchema),
    })
    .openapi("Artist"),
);

const ArtistSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(ArtistImageSchema),
});

const ErrorSchema = z.object({ error: z.string().openapi({ example: "Mensaje de error" }) });
const e = (code: number, description: string) => ({
  [code]: { description, content: { "application/json": { schema: ErrorSchema } } },
});

// ── Paths ─────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get",
  path: "/artist",
  tags: ["Artists"],
  summary: "Listar todos los artistas",
  responses: {
    200: {
      description: "Lista de artistas",
      content: { "application/json": { schema: z.object({ data: z.array(ArtistSummarySchema) }) } },
    },
    ...e(500, "Error interno"),
  },
});

registry.registerPath({
  method: "get",
  path: "/artist/search",
  tags: ["Artists"],
  summary: "Buscar artistas en Spotify",
  request: {
    query: z.object({
      query: z.string().min(1).openapi({ example: "Metallica", description: "Término de búsqueda" }),
      limit: z.coerce.number().int().positive().optional().default(10).openapi({ description: "Máx. resultados" }),
    }),
  },
  responses: {
    200: {
      description: "Resultados de la búsqueda",
      content: { "application/json": { schema: z.array(ArtistSummarySchema) } },
    },
    ...e(400, "Parámetros inválidos"),
    ...e(404, "Sin resultados"),
  },
});

registry.registerPath({
  method: "get",
  path: "/artist/details/{id}",
  tags: ["Artists"],
  summary: "Detalle de un artista con top tracks",
  request: {
    params: z.object({ id: z.string().openapi({ description: "ID del artista en Spotify" }) }),
  },
  responses: {
    200: {
      description: "Artista con top tracks",
      content: { "application/json": { schema: ArtistSchema } },
    },
    ...e(404, "Artista no encontrado"),
    ...e(500, "Error interno"),
  },
});
