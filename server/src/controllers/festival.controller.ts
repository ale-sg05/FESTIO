import { festivalService } from "../services/";
import type { Request, Response } from "express";
import { z } from "zod";
import { type FestivalDto, festivalSchema } from "../dtos/festival.dto";
import { isEnterpriseOwner, JWTPayload } from "../lib/auth";
import { logger } from "../lib/logger";

const getAllFestivals = async (req: Request, res: Response) => {
  try {
    const festivales = await festivalService.getAllFestivals();
    return res.json({ data: festivales });
  } catch (error) {
    logger.error({ err: error }, "getAllFestivals failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFestivalById = async (req: Request, res: Response) => {
  try {
    const festivalIdSchema = z.object({
      id: z.string(),
    });
    const festivalParams = festivalIdSchema.parse(req.params);
    if (!festivalParams) {
      return res.status(400).json({ error: "Invalid festival ID" });
    }

    const festival = await festivalService.getFestivalById(festivalParams.id);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    return res.json({ data: festival });
  } catch (error) {
    logger.error({ err: error, params: req.params }, "getFestivalById failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createFestival = async (req: Request, res: Response) => {
  try {
    const parsedBody = festivalSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }
    const festivalData: FestivalDto = parsedBody.data;
    const newFestival = await festivalService.createFestival(festivalData);
    return res.status(201).json({ data: newFestival });
  } catch (error) {
    logger.error({ err: error, body: req.body }, "createFestival failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFestival = async (req: Request, res: Response) => {
  const festivalIdSchema = z.object({
    id: z.string(),
  });
  const festivalParams = festivalIdSchema.safeParse(req.body);
  if (!festivalParams.success) {
    return res.status(400).json({ error: festivalParams.error.issues });
  }
  const festival = await festivalService.getFestivalById(
    festivalParams.data.id,
  );
  if (!festival) {
    return res.status(404).json({ error: "Festival not found" });
  }

  if (!isEnterpriseOwner(req.user as JWTPayload, festival.empresa)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  await festivalService.deleteFestival(festivalParams.data.id);
  return res.status(200).json({ message: "Festival deleted successfully" });
};

const updateFestival = async (req: Request, res: Response) => {
  try {
    const parsedBody = festivalSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }
    const festivalData: FestivalDto = parsedBody.data;
    const existingFestival = await festivalService.getFestivalById(
      festivalData.id,
    );
    if (!existingFestival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    if (!isEnterpriseOwner(req.user as JWTPayload, existingFestival.empresa)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedFestival = await festivalService.updateFestival(festivalData);
    return res.json({ data: updatedFestival });
  } catch (error) {
    logger.error({ err: error, body: req.body }, "updateFestival failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addArtistToFestival = async (req: Request, res: Response) => {
  try {
    const addArtistSchema = z.object({
      festival: z.string(),
      artist: z.string(),
    });
    const parsedBody = addArtistSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }
    const { festival: festivalId, artist } = parsedBody.data;
    const festival = await festivalService.getFestivalById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    if (!isEnterpriseOwner(req.user as JWTPayload, festival.empresa)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updatedFestival = await festivalService.addArtistToFestival(
      festivalId,
      artist,
    );
    if (!updatedFestival) {
      return res.status(404).json({ error: "Festival or Artist not found" });
    }
    return res.json({ data: updatedFestival });
  } catch (error) {
    logger.error({ err: error, body: req.body }, "addArtistToFestival failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTicketToFestival = async (req: Request, res: Response) => {
  try {
    const addTicketSchema = z.object({
      nombre: z.string(),
      precio: z.coerce.number().nonnegative(),
      stock: z.coerce.number().int().nonnegative(),
      festival: z.string(),
    });
    const parsedBody = addTicketSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }
    const { festival: festivalId, nombre, precio, stock } = parsedBody.data;
    const festival = await festivalService.getFestivalById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    if (!isEnterpriseOwner(req.user as JWTPayload, festival.empresa)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updatedFestival = await festivalService.addTicketToFestival(
      festivalId,
      nombre,
      precio,
      stock,
    );
    if (!updatedFestival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    return res.json({ data: updatedFestival });
  } catch (error) {
    logger.error({ err: error, body: req.body }, "addTicketToFestival failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFestivalImages = async (req: Request, res: Response) => {
  try {
    const images = await festivalService.getFestivalImages();
    return res.json({ data: images });
  } catch (error) {
    logger.error({ err: error }, "getFestivalImages failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const cancelFestival = async (req: Request, res: Response) => {
  try {
    const cancelFestivalSchema = z.object({
      id: z.string(),
    });
    const parsedBody = cancelFestivalSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }
    const { id: festivalId } = parsedBody.data;
    const festival = await festivalService.getFestivalById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    if (!isEnterpriseOwner(req.user as JWTPayload, festival.empresa)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Validación: la fecha de inicio debe ser mayor a 3 días desde hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    if (festival.f_inicio <= threeDaysFromNow) {
      return res.status(400).json({
        error:
          "El festival no puede cancelarse con menos de 3 días de antelación",
      });
    }

    const canceledFestival = await festivalService.cancelFestival(festivalId);
    if (!canceledFestival) {
      return res.status(404).json({ error: "Festival not found" });
    }
    return res.json({ data: canceledFestival });
  } catch (error) {
    logger.error({ err: error, body: req.body }, "cancelFestival failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const festivalController = {
  getAllFestivals,
  getFestivalById,
  createFestival,
  deleteFestival,
  updateFestival,
  addArtistToFestival,
  addTicketToFestival,
  getFestivalImages,
  cancelFestival,
};
