// IMPORTANTE: openapi debe ser el primer import para que extendZodWithOpenApi(z)
// se ejecute antes de que cualquier DTO use .openapi()
import "./lib/openapi";

import "dotenv/config";
import express from "express";
import cors from "cors";

import passport from "passport";
import { JWTStrategy } from "./lib/auth";
import { httpLogger, logger } from "./lib/logger";
import { setupSwagger } from "./lib/swagger";

import router from "./routes/";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
passport.use("jwt", JWTStrategy);
app.use(passport.initialize());

// Swagger UI disponible en /api-docs  (spec JSON en /api-docs.json)
setupSwagger(app);

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server is running");
  logger.info({ url: `http://localhost:${PORT}/api-docs` }, "Swagger UI disponible");
});
