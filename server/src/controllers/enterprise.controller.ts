import type { Request, Response } from "express";
import { enterpriseService } from "../services";
import { z } from "zod";
import {
  CreateEnterpriseDTO,
  EnterpriseDTO,
  RestrictEnterpriseDTO,
} from "../dtos/enterprise.dto";
import { isEnterpriseOwner, JWTPayload } from "../lib/auth";

const getAllEnterprises = async (req: Request, res: Response) => {
  try {
    const enterprises = await enterpriseService.findAllEnterprises();
    const enterprisesWithoutPassword = enterprises.map(
      ({ contraseña, ...enterprise }) => enterprise,
    );
    res.json({ data: enterprisesWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEnterpriseById = async (req: Request, res: Response) => {
  const enterpriseParamsSchema = z.object({
    id: z.string().min(1, "Id is required"),
  });
  const parsedParams = enterpriseParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: parsedParams.error.issues });
  }
  const { id } = parsedParams.data;

  if (!isEnterpriseOwner(req.user as JWTPayload, id)) {
    return res
      .status(403)
      .json({ error: "Solo puedes visualizar tu propia empresa" });
  }
  try {
    const enterprise = await enterpriseService.findEnterpriseById(id);
    if (enterprise) {
      const { contraseña, ...enterpriseWithoutPassword } = enterprise;
      res.json({ data: enterpriseWithoutPassword });
    } else {
      res.status(404).json({ error: "Enterprise not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const getEnterpriseDashboard = async (req: Request, res: Response) => {
  const enterpriseParamsSchema = z.object({
    id: z.string().min(1, "Id is required"),
  });
  const parsedParams = enterpriseParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: parsedParams.error.issues });
  }
  const { id } = parsedParams.data;

  if (!isEnterpriseOwner(req.user as JWTPayload, id)) {
    return res.status(403).json({
      error: "Solo puedes visualizar el dashboard de tu propia empresa",
    });
  }
  try {
    const dashboardData = await enterpriseService.getCompleteDashboard(id);
    res.json({ data: dashboardData });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const createEnterprise = async (req: Request, res: Response) => {
  const parsedBody = CreateEnterpriseDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }
  try {
    const newEnterprise = await enterpriseService.createEnterprise(
      parsedBody.data,
    );
    const { contraseña, ...enterpriseWithoutPassword } = newEnterprise;
    res.status(201).json({ data: enterpriseWithoutPassword });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const updateEnterprise = async (req: Request, res: Response) => {
  const user = req.user as JWTPayload;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsedBody = EnterpriseDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }

  const existingEnterprise = await enterpriseService.findEnterpriseById(
    user.id,
  );
  if (!existingEnterprise) {
    return res.status(404).json({ error: "Enterprise not found" });
  }

  const hasVerificada = Object.prototype.hasOwnProperty.call(
    req.body,
    "verificada",
  );
  const hasRestringida = Object.prototype.hasOwnProperty.call(
    req.body,
    "restringida",
  );

  if (
    user.role !== "admin" &&
    ((hasVerificada &&
      parsedBody.data.verificada !== existingEnterprise.verificada) ||
      (hasRestringida &&
        parsedBody.data.restringida !== existingEnterprise.restringida))
  ) {
    return res.status(403).json({
      error:
        "Solo el administrador puede cambiar los campos verificada y restringida",
    });
  }

  try {
    const updatedEnterprise = await enterpriseService.updateEnterprise(
      user.id,
      parsedBody.data,
    );

    const { contraseña, ...enterpriseWithoutPassword } = updatedEnterprise;
    res.json({ data: enterpriseWithoutPassword });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteEnterprise = async (req: Request, res: Response) => {
  const { id } = req.user as JWTPayload;
  if (!id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await enterpriseService.deleteEnterprise(id);
    res.json({ data: { message: "Enterprise deleted successfully" } });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const restrictEnterprise = async (req: Request, res: Response) => {
  const parsedBody = RestrictEnterpriseDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }
  const { id, status } = parsedBody.data;

  try {
    const updatedEnterprise = await enterpriseService.restrictEnterprise(
      id,
      status,
    );
    res.json({
      data: { enterprise: id, restringida: status },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const verifyEnterprise = async (req: Request, res: Response) => {
  const parsedBody = RestrictEnterpriseDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }
  const { id, status } = parsedBody.data;
  try {
    const updatedEnterprise = await enterpriseService.verifyEnterprise(
      id,
      status,
    );
    res.json({
      data: { enterprise: id, verificada: status },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const enterpriseController = {
  getAllEnterprises,
  getEnterpriseById,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
  restrictEnterprise,
  verifyEnterprise,
  getEnterpriseDashboard,
};
