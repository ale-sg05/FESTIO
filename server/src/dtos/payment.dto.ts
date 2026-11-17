import { z } from "zod";

export const paymentBuyTicketDto = z
  .object({
    cardHolder: z.string().min(1, "El nombre del titular es requerido"),
    cardNumber: z
      .string()
      .min(13, "El número de tarjeta debe tener al menos 13 dígitos")
      .max(19, "El número de tarjeta es demasiado largo"),
    expiryDate: z
      .string()
      .min(1, "La fecha de vencimiento es requerida")
      .regex(/^\d{2}\/\d{2}$/, "La fecha debe tener formato MM/YY"),
    cvv: z.string().min(3, "El CVV debe tener al menos 3 dígitos").max(4),
    currency: z.string().optional().default("EUR"),
    festival: z.string().min(1, "El ID del festival es requerido"),
    abono: z.string().min(1, "El ID del abono es requerido"),
    tickets: z
      .number()
      .int()
      .positive("La cantidad de entradas debe ser un número positivo"),
  })
  .refine(
    (data) => {
      // Validar que la fecha de vencimiento sea en el futuro
      const [month, year] = data.expiryDate.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    },
    {
      message: "La tarjeta ha expirado",
      path: ["expiryDate"],
    },
  );

export interface PaymentChargeSAPIResponse {
  status: string;
  transactionId: string;
  reason: string;
  amount: number;
  currency: string;
  cardLast4: string;
  timestamp: string;
}

export const paymentRechargeAbonoDto = z
  .object({
    cardHolder: z.string().min(1, "El nombre del titular es requerido"),
    cardNumber: z
      .string()
      .min(13, "El número de tarjeta debe tener al menos 13 dígitos")
      .max(19, "El número de tarjeta es demasiado largo"),
    expiryDate: z
      .string()
      .min(1, "La fecha de vencimiento es requerida")
      .regex(/^\d{2}\/\d{2}$/, "La fecha debe tener formato MM/YY"),
    cvv: z.string().min(3, "El CVV debe tener al menos 3 dígitos").max(4),
    currency: z.string().optional().default("EUR"),
    amount: z
      .number()
      .positive("La cantidad debe ser un número positivo")
      .max(10000, "La cantidad no puede ser mayor a 10000€"),
    abonoId: z.string().min(1, "El ID del abono es requerido"),
    festivalId: z.string().min(1, "El ID del festival es requerido"),
    tipoAbonoId: z.string().min(1, "El ID del tipo de abono es requerido"),
  })
  .refine(
    (data) => {
      // Validar que la fecha de vencimiento sea en el futuro
      const [month, year] = data.expiryDate.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    },
    {
      message: "La tarjeta ha expirado",
      path: ["expiryDate"],
    },
  );

export const paymentRefundAbonoDto = z.object({
  abonoId: z.string().min(1, "El ID del abono es requerido"),
  festivalId: z.string().min(1, "El ID del festival es requerido"),
  tipoAbonoId: z.string().min(1, "El ID del tipo de abono es requerido"),
});

export interface PaymentRefundSAPIResponse {
  status: string;
  transactionId: string;
  reason: string;
  amount: number;
  currency: string;
  cardLast4: string;
  timestamp: string;
}

export type PaymentBuyTicketDto = z.infer<typeof paymentBuyTicketDto>;
export type PaymentRechargeAbonoDto = z.infer<typeof paymentRechargeAbonoDto>;
export type PaymentRefundAbonoDto = z.infer<typeof paymentRefundAbonoDto>;
