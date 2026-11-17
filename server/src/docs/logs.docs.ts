import { z } from "zod";
import { registry } from "../lib/openapi";

const ErrorSchema = z.object({ error: z.string().openapi({ example: "Mensaje de error" }) });
const e = (code: number, description: string) => ({
  [code]: { description, content: { "application/json": { schema: ErrorSchema } } },
});

registry.registerPath({
  method: "get",
  path: "/logs",
  tags: ["Logs"],
  summary: "Obtener logs del servidor",
  description: "Devuelve las últimas entradas pino del servidor. Solo **admin**.",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Logs",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(
              z.object({
                level: z.number().int(),
                time: z.number().int(),
                msg: z.string(),
              }),
            ),
          }),
        },
      },
    },
    ...e(403, "Solo admin"),
  },
});
