import type { Request, Response } from "express";
import { clientService } from "../services";
import { ClientDTO } from "../dtos/client.dto";
import { z } from "zod";
import { isClientOwner, JWTPayload } from "../lib/auth";

const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientService.findAllClients();
    const clientsWithoutPassword = clients.map(
      ({ contraseña, ...client }) => client,
    );
    res.json({ data: clientsWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getClientById = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res
      .status(403)
      .json({ error: "No se ha proporcionado un ID válido en el token" });
  }
  try {
    const client = await clientService.findClientById(req.user.id);
    if (client) {
      const { contraseña, ...clientWithoutPassword } = client;
      res.json({ data: clientWithoutPassword });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createClient = async (req: Request, res: Response) => {
  const parsedBody = ClientDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }
  try {
    const newClient = await clientService.createClient(parsedBody.data);
    const { contraseña, ...clientWithoutPassword } = newClient;
    res.status(201).json({ data: clientWithoutPassword });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteClient = async (req: Request, res: Response) => {
  const {id} = req.user as JWTPayload;
  if (!id) {
    return res
      .status(403)
      .json({ error: "No se ha proporcionado un ID válido en el token" });
  }
  try {
    await clientService.deleteClient(id);
    res.status(204).send({
      message: "Client deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const updateClient = async (req: Request, res: Response) => {
  const clientParamsSchema = z.object({
    correo: z.string().email("Correo must be a valid email"),
  });
  const parsedParams = clientParamsSchema.safeParse(req.body);
  if (!parsedParams.success) {
    return res.status(400).json({ error: parsedParams.error.issues });
  }
  const { correo } = parsedParams.data;

  if (!isClientOwner(req.user as JWTPayload, correo)) {
    return res
      .status(403)
      .json({ error: "Solo puedes actualizar tu propia cuenta" });
  }

  const parsedBody = ClientDTO.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.issues });
  }

  try {
    const updatedClient = await clientService.updateClient(parsedBody.data);
    const { contraseña, ...clientWithoutPassword } = updatedClient;
    res.json({ data: clientWithoutPassword });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getClientFestivals = async (req: Request, res: Response) => {
  const { id } = req.user as JWTPayload;

  if (!id) {
    return res
      .status(403)
      .json({ error: "No se ha proporcionado un ID válido en el token" });
  }

  try {
    const festivals = await clientService.getClientFestivals(id);
    res.json({ data: festivals });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getTicketById = async (req: Request, res: Response) => {
  const ticketIdSchema = z.object({
    id: z.string().uuid("ID must be a valid UUID"),
  });
  const parsedParams = ticketIdSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: parsedParams.error.issues });
  }
  const { id } = parsedParams.data;
  const { id: userId } = req.user as JWTPayload;

  if (!userId) {
    return res
      .status(403)
      .json({ error: "No se ha proporcionado un ID válido en el token" });
  }

  try {
    const ticket = await clientService.getTicketById(id, userId);
    res.json({ data: ticket });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const clientController = {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
  getClientById,
  getClientFestivals,
  getTicketById,
};
