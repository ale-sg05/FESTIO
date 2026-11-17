import { prisma } from "../lib/prisma";
import { type ClientDTOType } from "../dtos/client.dto";
import bcrypt from "bcryptjs";

const findAllClients = async () => {
  try {
    const clients = await prisma.cliente.findMany();
    return clients;
  } catch (error) {
    console.error("Error finding clients:", error);
    throw new Error("Failed to find clients");
  }
};

const findClientById = async (id: string) => {
  try {
    const client = await prisma.cliente.findUnique({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error(`Error finding client with id ${id}:`, error);
    throw new Error("Failed to find client");
  }
};

const findClientByCorreo = async (correo: string) => {
  try {
    const client = await prisma.cliente.findUnique({
      where: { correo },
    });
    return client;
  } catch (error) {
    console.error(`Error finding client with correo ${correo}:`, error);
    throw new Error("Failed to find client");
  }
};

const createClient = async (clientData: ClientDTOType) => {
  if (!clientData) {
    throw new Error("No data provided");
  }
  if (await findClientByCorreo(clientData.correo)) {
    throw new Error("Client with this email already exists");
  }

  // Validar que el correo no exista en empresas
  const existingEnterprise = await prisma.empresa.findUnique({
    where: { correo: clientData.correo },
  });
  if (existingEnterprise) {
    throw new Error("Email already registered as an enterprise");
  }

  const hashedPassword = await bcrypt.hash(clientData.contraseña, 10);

  try {
    const newClient = await prisma.cliente.create({
      data: {
        id: crypto.randomUUID(),
        correo: clientData.correo,
        nombre: clientData.nombre,
        apellidos: clientData.apellidos,
        telefono: clientData.telefono,
        contraseña: hashedPassword,
        dni: clientData.dni,
        fecha_nacimiento: clientData.fecha_nacimiento,
      },
    });
    return newClient;
  } catch (error) {
    console.error("Error creating client:", error);
    throw new Error("Failed to create client");
  }
};

const deleteClient = async (id: string) => {
  try {
    await prisma.cliente.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting client with id ${id}:`, error);
    throw new Error("Failed to delete client");
  }
};

const updateClient = async (clientData: ClientDTOType) => {
  if (!clientData) {
    throw new Error("No data provided");
  }
  const existingClient = await findClientByCorreo(clientData.correo);
  if (!existingClient) {
    throw new Error("Client not found");
  }

  // Validar que el nuevo correo no exista en empresas (solo si se está cambiando el correo)
  if (clientData.correo !== existingClient.correo) {
    const existingEnterprise = await prisma.empresa.findUnique({
      where: { correo: clientData.correo },
    });
    if (existingEnterprise) {
      throw new Error("Email already registered as an enterprise");
    }
  }

  const updateData: any = {};

  if (clientData.nombre?.trim()) updateData.nombre = clientData.nombre;
  if (clientData.apellidos?.trim()) updateData.apellidos = clientData.apellidos;
  if (clientData.telefono?.trim()) updateData.telefono = clientData.telefono;
  if (clientData.dni?.trim()) updateData.dni = clientData.dni;
  if (clientData.fecha_nacimiento) {
    if (typeof clientData.fecha_nacimiento === "string") {
      const fechaStr = clientData.fecha_nacimiento.trim();
      if (fechaStr) updateData.fecha_nacimiento = new Date(fechaStr);
    } else if (clientData.fecha_nacimiento instanceof Date) {
      updateData.fecha_nacimiento = clientData.fecha_nacimiento;
    }
  }
  if (clientData.contraseña?.trim()) {
    updateData.contraseña = await bcrypt.hash(clientData.contraseña, 10);
  }

  try {
    const updatedClient = await prisma.cliente.update({
      where: { correo: clientData.correo },
      data: updateData,
    });
    return updatedClient;
  } catch (error) {
    console.error(
      `Error updating client with correo ${clientData.correo}:`,
      error,
    );
    throw new Error("Failed to update client");
  }
};

const getClientFestivals = async (id: string) => {
  try {
    const festivals = await prisma.festival.findMany({
      where: {
        abonos: {
          some: {
            cliente: id,
          },
        },
      },
      include: {
        abonos: {
          where: {
            cliente: id,
          },
          orderBy: { timestamp: "desc" },
        },
      },
    });
    return festivals;
  } catch (error) {
    console.error(`Error fetching festivals for client with id ${id}:`, error);
    throw new Error("Failed to fetch client's festivals");
  }
};

const getTicketById = async (id: string, userId: string) => {
  try {
    const ticket = await prisma.abono_cliente.findFirst({
      where: {
        id,
        cliente: userId,
      },
      include: {
        festivalRef: true,
      },
    });
    if (!ticket) {
      throw new Error("Ticket not found or does not belong to the client");
    }
    return ticket;
  } catch (error) {
    console.error(
      `Error fetching ticket with id ${id} for client with id ${userId}:`,
      error,
    );
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch ticket",
    );
  }
};

export const clientService = {
  findAllClients,
  findClientById,
  findClientByCorreo,
  createClient,
  deleteClient,
  updateClient,
  getClientFestivals,
  getTicketById,
};
