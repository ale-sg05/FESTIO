import {
  paymentBuyTicketDto,
  paymentRechargeAbonoDto,
  paymentRefundAbonoDto,
  type PaymentBuyTicketDto,
  type PaymentRechargeAbonoDto,
  type PaymentRefundAbonoDto,
} from "../dtos/payment.dto";
import { type Request, type Response } from "express";
import { paymentService } from "../services";
import { logger } from "../lib/logger";

const buyTicket = async (req: Request, res: Response) => {
  try {
    const { payload } = req.body;

    const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
    const parsedPayload = JSON.parse(decodedPayload);

    const validation = paymentBuyTicketDto.safeParse(parsedPayload);
    if (!validation.success) {
      logger.warn(
        { issues: validation.error.issues },
        "buyTicket validation failed",
      );
      return res.status(400).json({
        error: "Invalid request body",
        details: validation.error.flatten(),
      });
    }

    const client = req.user as any;
    if (!client || !client.id) {
      logger.warn({ user: client }, "Unauthorized buyTicket attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }
    const {
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      currency,
      festival,
      abono,
      tickets,
    } = validation.data as PaymentBuyTicketDto;

    const cardLast4 =
      typeof cardNumber === "string" && cardNumber.length >= 4
        ? cardNumber.slice(-4)
        : undefined;

    logger.info(
      { user: client.id, festival, tickets, cardLast4 },
      "Initiating payment",
    );

    const result = await paymentService.buyTicket(
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      currency,
      client.id,
      festival,
      abono,
      tickets,
    );
    res.json(result);
  } catch (error) {
    logger.error({ err: error }, "Error in buyTicket controller");
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const rechargeAbono = async (req: Request, res: Response) => {
  try {
    const { payload } = req.body;

    const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
    const parsedPayload = JSON.parse(decodedPayload);

    const validation = paymentRechargeAbonoDto.safeParse(parsedPayload);
    if (!validation.success) {
      logger.warn(
        { issues: validation.error.issues },
        "rechargeAbono validation failed",
      );
      return res.status(400).json({
        error: "Invalid request body",
        details: validation.error.flatten(),
      });
    }

    const client = req.user as any;
    if (!client || !client.id) {
      logger.warn({ user: client }, "Unauthorized rechargeAbono attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      currency,
      amount,
      abonoId,
      festivalId,
      tipoAbonoId,
    } = validation.data as PaymentRechargeAbonoDto;


    const cardLast4 =
      typeof cardNumber === "string" && cardNumber.length >= 4
        ? cardNumber.slice(-4)
        : undefined;

    logger.info(
      { user: client.id, abonoId, amount, cardLast4 },
      "Initiating abono recharge",
    );

    const result = await paymentService.rechargeAbono(
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      currency,
      amount,
      client.id,
      abonoId,
      festivalId,
      tipoAbonoId,
    );
    res.json(result);
  } catch (error) {
    logger.error({ err: error }, "Error in rechargeAbono controller");
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const refundAbono = async (req: Request, res: Response) => {
  try {
    const { payload } = req.body;

    const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
    const parsedPayload = JSON.parse(decodedPayload);

    const validation = paymentRefundAbonoDto.safeParse(parsedPayload);
    if (!validation.success) {
      logger.warn(
        { issues: validation.error.issues },
        "refundAbono validation failed",
      );
      return res.status(400).json({
        error: "Invalid request body",
        details: validation.error.flatten(),
      });
    }

    const client = req.user as any;
    if (!client || !client.id) {
      logger.warn({ user: client }, "Unauthorized refundAbono attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { abonoId, festivalId, tipoAbonoId } =
      validation.data as PaymentRefundAbonoDto;

    logger.info(
      { user: client.id, abonoId, festivalId, tipoAbonoId },
      "Initiating abono refund",
    );

    const result = await paymentService.refundAbono(
      client.id,
      abonoId,
      festivalId,
      tipoAbonoId,
    );
    res.json(result);
  } catch (error) {
    logger.error({ err: error }, "Error in refundAbono controller");
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const paymentController = {
  buyTicket,
  rechargeAbono,
  refundAbono,
};
