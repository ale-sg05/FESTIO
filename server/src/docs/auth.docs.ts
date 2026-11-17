import { z } from "zod";
import { registry } from "../lib/openapi";
import { signUpEmpresaSchema, signUpClienteSchema } from "../dtos/auth.dto";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const SignUpEmpresaSchema = registry.register(
  "SignUpEmpresaRequest",
  signUpEmpresaSchema.openapi("SignUpEmpresaRequest", {
    description: "Datos necesarios para registrar una nueva empresa organizadora.",
  }),
);

// signUpClienteSchema usa z.coerce.date() — sobreescribimos fechaNacimiento para Swagger UI
export const SignUpClienteSchema = registry.register(
  "SignUpClienteRequest",
  signUpClienteSchema
    .extend({
      fechaNacimiento: z.string().openapi({
        example: "1995-06-15",
        description: "Fecha de nacimiento (ISO 8601). El cliente debe ser mayor de 18 años.",
      }),
    })
    .openapi("SignUpClienteRequest", {
      description: "Datos necesarios para registrar un nuevo cliente.",
    }),
);

export const AdminSignInSchema = registry.register(
  "AdminSignInRequest",
  z
    .object({
      email: z.string().email().openapi({ example: "admin@admin.com" }),
      password: z.string().min(8).openapi({ example: "supersecret" }),
    })
    .openapi("AdminSignInRequest"),
);

export const EmpresaSignInSchema = registry.register(
  "EmpresaSignInRequest",
  z
    .object({
      cif: z.string().openapi({ example: "A12345678" }),
      password: z.string().min(8).openapi({ example: "mipassword" }),
    })
    .openapi("EmpresaSignInRequest"),
);

export const ClienteSignInSchema = registry.register(
  "ClienteSignInRequest",
  z
    .object({
      correo: z.string().email().openapi({ example: "cliente@email.com" }),
      contraseña: z.string().min(8).openapi({ example: "mipassword" }),
    })
    .openapi("ClienteSignInRequest"),
);

export const TokenResponseSchema = registry.register(
  "TokenResponse",
  z
    .object({
      token: z
        .string()
        .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
      role: z.enum(["admin", "empresa", "cliente"]),
    })
    .openapi("TokenResponse"),
);

// ── Helpers locales ───────────────────────────────────────────────────────────

const body = (schema: z.ZodTypeAny) => ({
  body: { required: true as const, content: { "application/json": { schema } } },
});

const err = (schema: z.ZodTypeAny) => (code: number, description: string) => ({
  [code]: { description, content: { "application/json": { schema } } },
});

const ErrorSchema = z.object({ error: z.string().openapi({ example: "Mensaje de error" }) });
const e = err(ErrorSchema);

// ── Paths ─────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "post",
  path: "/auth/admin/signin",
  tags: ["Auth"],
  summary: "Sign-in de administrador",
  request: body(AdminSignInSchema),
  responses: {
    ...{ 200: { description: "Token JWT", content: { "application/json": { schema: TokenResponseSchema } } } },
    ...e(400, "Credenciales inválidas"),
    ...e(401, "No autorizado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/enterprise/signup",
  tags: ["Auth"],
  summary: "Registro de empresa",
  request: body(SignUpEmpresaSchema),
  responses: {
    201: { description: "Empresa registrada" },
    ...e(400, "Datos inválidos"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/enterprise/signin",
  tags: ["Auth"],
  summary: "Sign-in de empresa",
  request: body(EmpresaSignInSchema),
  responses: {
    200: { description: "Token JWT", content: { "application/json": { schema: TokenResponseSchema } } },
    ...e(400, "Credenciales inválidas"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/client/signup",
  tags: ["Auth"],
  summary: "Registro de cliente",
  request: body(SignUpClienteSchema),
  responses: {
    201: { description: "Cliente registrado" },
    ...e(400, "Datos inválidos"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/client/signin",
  tags: ["Auth"],
  summary: "Sign-in de cliente",
  request: body(ClienteSignInSchema),
  responses: {
    200: { description: "Token JWT", content: { "application/json": { schema: TokenResponseSchema } } },
    ...e(400, "Credenciales inválidas"),
  },
});
