import { z } from "zod";
import { registry } from "../lib/openapi";
import {
  paymentBuyTicketDto,
  paymentRechargeAbonoDto,
  paymentRefundAbonoDto,
} from "../dtos/payment.dto";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const PaymentBuyTicketPayloadSchema = registry.register(
  "PaymentBuyTicketPayload",
  paymentBuyTicketDto.openapi("PaymentBuyTicketPayload", {
    description: "JSON a codificar en Base64 para el campo `payload` de la compra.",
  }),
);

export const PaymentBuyTicketRequestSchema = registry.register(
  "PaymentBuyTicketRequest",
  z
    .object({
      payload: z.string().openapi({
        format: "byte",
        description:
          "JSON codificado en Base64 que cumple **PaymentBuyTicketPayload**. " +
          "Ejemplo: `btoa(JSON.stringify({ cardHolder: 'Juan', ... }))`",
        example: "eyJjYXJkSG9sZGVyIjoiSnVhbiIsLi4ufQ==",
      }),
    })
    .openapi("PaymentBuyTicketRequest"),
);

export const PaymentRechargeAbonoPayloadSchema = registry.register(
  "PaymentRechargeAbonoPayload",
  paymentRechargeAbonoDto.openapi("PaymentRechargeAbonoPayload", {
    description: "JSON a codificar en Base64 para el campo `payload` de la recarga.",
  }),
);

export const PaymentRechargeAbonoRequestSchema = registry.register(
  "PaymentRechargeAbonoRequest",
  z
    .object({
      payload: z.string().openapi({
        format: "byte",
        description: "JSON codificado en Base64 que cumple **PaymentRechargeAbonoPayload**.",
        example: "eyJjYXJkSG9sZGVyIjoiSnVhbiIsLi4ufQ==",
      }),
    })
    .openapi("PaymentRechargeAbonoRequest"),
);

const PaymentChargeResponseSchema = z.object({
  status: z.string(),
  transactionId: z.string(),
  reason: z.string(),
  amount: z.number(),
  currency: z.string(),
  cardLast4: z.string(),
  timestamp: z.string().datetime(),
});

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
  method: "post",
  path: "/festival/payment/buy",
  tags: ["Payments"],
  summary: "Comprar entradas de un festival",
  description:
    "Enviar `payload` con el JSON de **PaymentBuyTicketPayload** codificado en Base64. " +
    "Solo **cliente**.",
  security: jwt,
  request: body(PaymentBuyTicketRequestSchema),
  responses: {
    200: {
      description: "Pago procesado",
      content: { "application/json": { schema: PaymentChargeResponseSchema } },
    },
    ...e(400, "Payload inválido"),
    ...e(401, "No autenticado"),
  },
});

export const PaymentRefundAbonoPayloadSchema = registry.register(
  "PaymentRefundAbonoPayload",
  paymentRefundAbonoDto.openapi("PaymentRefundAbonoPayload", {
    description: "JSON a codificar en Base64 para el campo `payload` de la devolución.",
  }),
);

export const PaymentRefundAbonoRequestSchema = registry.register(
  "PaymentRefundAbonoRequest",
  z
    .object({
      payload: z.string().openapi({
        format: "byte",
        description: "JSON codificado en Base64 que cumple **PaymentRefundAbonoPayload**.",
        example: "eyJhYm9ub0lkIjoiYWJjLTEyMyIsLi4ufQ==",
      }),
    })
    .openapi("PaymentRefundAbonoRequest"),
);

const PaymentRefundResponseSchema = z.object({
  status: z.string(),
  transactionId: z.string(),
  reason: z.string(),
  amount: z.number(),
  currency: z.string(),
  cardLast4: z.string(),
  timestamp: z.string().datetime(),
});

registry.registerPath({
  method: "post",
  path: "/festival/payment/recharge",
  tags: ["Payments"],
  summary: "Recargar saldo de un abono",
  description:
    "Enviar `payload` con el JSON de **PaymentRechargeAbonoPayload** codificado en Base64. " +
    "Solo **cliente**.",
  security: jwt,
  request: body(PaymentRechargeAbonoRequestSchema),
  responses: {
    200: {
      description: "Recarga procesada",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string(),
            transactionId: z.string(),
            amount: z.number(),
            currency: z.string(),
          }),
        },
      },
    },
    ...e(400, "Payload inválido"),
    ...e(401, "No autenticado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/festival/payment/refund",
  tags: ["Payments"],
  summary: "Solicitar devolución de un abono de festival cancelado",
  description:
    "Tramita la devolución del abono indicado a través del SAPI. " +
    "Sólo se permite si el festival está cancelado y el abono no ha sido devuelto previamente. " +
    "Tras una devolución exitosa, el estado del abono pasa a `false`. " +
    "Enviar `payload` con el JSON de **PaymentRefundAbonoPayload** codificado en Base64. " +
    "Solo **cliente**.",
  security: jwt,
  request: body(PaymentRefundAbonoRequestSchema),
  responses: {
    200: {
      description: "Devolución procesada",
      content: { "application/json": { schema: PaymentRefundResponseSchema } },
    },
    ...e(400, "Payload inválido"),
    ...e(401, "No autenticado"),
    ...e(500, "Error al procesar la devolución"),
  },
});
