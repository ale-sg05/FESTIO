import { prisma } from "../lib/prisma";
import {
  CreateEnterpriseDTOType,
  type EnterpriseDTOType,
} from "../dtos/enterprise.dto";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const findAllEnterprises = async () => {
  try {
    const enterprises = await prisma.empresa.findMany();
    return enterprises;
  } catch (error) {
    console.error("Error finding enterprises:", error);
    throw new Error("Failed to find enterprises");
  }
};
const findEnterpriseById = async (id: string) => {
  try {
    const enterprise = await prisma.empresa.findUnique({
      where: { id: id },
      include: { festivales: true },
    });
    return enterprise;
  } catch (error) {
    console.error(`Error finding enterprise with id ${id}:`, error);
    throw new Error("Failed to find enterprise");
  }
};

const getCompleteDashboard = async (empresaId: string) => {
  const [
    enterprise,
    totalClientes,
    totalTransacciones,
    abonosVendidos,
    abonosVendidosDetalle, // Nuevo: detalle de abonos vendidos con precios
    saldoPendiente,
    festivalesStats,
    topFestivals,
    recentTransactions,
  ] = await Promise.all([
    // Datos básicos de empresa
    prisma.empresa.findUnique({
      where: { id: empresaId },
      include: { festivales: { include: { actuaciones: true } } },
    }),

    // Total clientes únicos
    prisma.abono_cliente.findMany({
      where: { festivalRef: { empresa: empresaId } },
      distinct: ["cliente"],
    }),

    // Análisis de transacciones - traer datos y agrupar en memoria
    prisma.realizar_transaccion.findMany({
      where: {
        abonoClienteRef: {
          festivalRef: { empresa: empresaId },
        },
      },
      include: {
        transaccionRef: true,
      },
    }),

    // Abonos vendidos (solo count)
    prisma.abono_cliente.count({
      where: { festivalRef: { empresa: empresaId } },
    }),

    // Nuevo: Abonos vendidos con información del tipo de abono y precio
    prisma.abono_cliente.findMany({
      where: { festivalRef: { empresa: empresaId } },
      include: {
        tipoAbonoRef: {
          select: {
            nombre: true, // Cambiado de 'tipo' a 'nombre'
            precio: true,
          },
        },
      },
    }),

    // Saldo pendiente de uso
    prisma.abono_cliente.aggregate({
      where: { festivalRef: { empresa: empresaId } },
      _sum: { saldo: true },
    }),

    // Stats por festival
    prisma.abono_cliente.groupBy({
      by: ["festival"],
      where: { festivalRef: { empresa: empresaId } },
      _count: { id: true },
      _sum: { saldo: true },
    }),

    // Top 5 festivales por ventas
    prisma.abono_cliente.groupBy({
      by: ["festival", "tipo_abono"],
      where: { festivalRef: { empresa: empresaId } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),

    // Últimas transacciones
    prisma.transaccion.findMany({
      where: {
        realizaciones: {
          some: {
            abonoClienteRef: {
              festivalRef: { empresa: empresaId },
            },
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10,
    }),
  ]);

  // Calcular ingresos por venta de abonos
  const ingresosPorAbonos = abonosVendidosDetalle.reduce(
    (sum, abono) => sum + (Number(abono.tipoAbonoRef?.precio) || 0),
    0,
  );

  // Agrupar ventas por tipo de abono
  const ventasPorTipoAbono = abonosVendidosDetalle.reduce(
    (acc, abono) => {
      const tipo = abono.tipo_abono;
      const precio = Number(abono.tipoAbonoRef?.precio) || 0;

      if (!acc[tipo]) {
        acc[tipo] = {
          tipo: tipo,
          nombreTipo: abono.tipoAbonoRef?.nombre || tipo, // Cambiado de 'tipo' a 'nombre'
          cantidad: 0,
          precioUnitario: precio,
          ingresoTotal: 0,
        };
      }

      acc[tipo].cantidad += 1;
      acc[tipo].ingresoTotal += precio;

      return acc;
    },
    {} as Record<
      string,
      {
        tipo: string;
        nombreTipo: string;
        cantidad: number;
        precioUnitario: number;
        ingresoTotal: number;
      }
    >,
  );

  // Calcular ingresos unificados por compra de abonos (venta + compras dentro del festival)
  const ingresosPorCompraAbonos =
    ingresosPorAbonos +
    totalTransacciones
      .filter((t) => t.tipo_transaccion === "Compra")
      .reduce((sum, t) => sum + (Number(t.transaccionRef?.cantidad) || 0), 0);

  // Calcular ingresos por recarga de abonos
  const ingresosPorRecargaAbonos = totalTransacciones
    .filter((t) => t.tipo_transaccion === "Recarga")
    .reduce((sum, t) => sum + (Number(t.transaccionRef?.cantidad) || 0), 0);

  // Total de ingresos
  const ingresosTotales = ingresosPorCompraAbonos + ingresosPorRecargaAbonos;

  return {
    empresa: enterprise,
    metricas: {
      totalClientes: totalClientes.length,
      totalAbonos: abonosVendidos,
      totalFestivales: enterprise?.festivales.length,
      festivalesActivos: enterprise?.festivales.filter(
        (f) => f.estado === "Activo",
      ).length,
    },
    financiero: {
      // Ingresos unificados por compra de abonos (venta inicial + compras dentro del festival)
      ingresosPorCompraAbonos: ingresosPorCompraAbonos,

      // Ingresos por recarga de abonos
      ingresosPorRecargaAbonos: ingresosPorRecargaAbonos,

      // Total de ingresos
      ingresosTotales: ingresosTotales,

      saldoPendiente: Number(saldoPendiente._sum?.saldo) || 0,

      // Desglose por tipo de abono
      ventasPorTipoAbono: Object.values(ventasPorTipoAbono),
    },
    festivales: festivalesStats,
    topFestivales: topFestivals,
    actividadReciente: recentTransactions,
  };
};

const createEnterprise = async (data: CreateEnterpriseDTOType) => {
  if (!data) {
    throw new Error("No data provided");
  }
  if (await findEnterpriseById(data.cif)) {
    throw new Error("Enterprise with this CIF already exists");
  }

  // Validar que el correo no exista en clientes
  const existingClient = await prisma.cliente.findUnique({
    where: { correo: data.correo },
  });
  if (existingClient) {
    throw new Error("Email already registered as a client");
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);
  try {
    const newEnterprise = await prisma.empresa.create({
      data: {
        id: crypto.randomUUID(),
        cif: data.cif,
        persona: data.persona,
        correo: data.correo,
        telefono: data.telefono,
        razon_social: data.razonSocial,
        domicilio: data.domicilio,
        contraseña: hashedPassword,
        verificada: data.verificada,
        restringida: data.restringida,
        motivoRestriccion: data.motivoRestriccion,
      },
    });
    return newEnterprise;
  } catch (error) {
    console.error("Error creating enterprise:", error);
    throw new Error("Failed to create enterprise");
  }
};

const updateEnterprise = async (id: string, data: EnterpriseDTOType) => {
  if (!data) {
    throw new Error("No data provided");
  }
  const existingEnterprise = await findEnterpriseById(id);
  if (!existingEnterprise) {
    throw new Error("Enterprise not found");
  }

  // Validar que el nuevo correo no exista en clientes (solo si se está cambiando el correo)
  if (data.correo !== existingEnterprise.correo) {
    const existingClient = await prisma.cliente.findUnique({
      where: { correo: data.correo },
    });
    if (existingClient) {
      throw new Error("Email already registered as a client");
    }
  }

  const updateData: any = {};

  if (data.persona?.trim()) updateData.persona = data.persona;
  if (data.correo?.trim()) updateData.correo = data.correo;
  if (data.telefono?.trim()) updateData.telefono = data.telefono;
  if (data.razonSocial?.trim()) updateData.razon_social = data.razonSocial;
  if (data.domicilio?.trim()) updateData.domicilio = data.domicilio;
  if (data.contrasena?.trim()) {
    updateData.contraseña = await bcrypt.hash(data.contrasena, 10);
  }
  if (data.verificada !== undefined && data.verificada !== null) {
    updateData.verificada = data.verificada;
  }
  if (data.restringida !== undefined && data.restringida !== null) {
    updateData.restringida = data.restringida;
  }

  try {
    const updatedEnterprise = await prisma.empresa.update({
      where: { id: id },
      data: updateData,
    });
    return updatedEnterprise;
  } catch (error) {
    console.error("Error updating enterprise:", error);
    throw new Error("Failed to update enterprise");
  }
};

const deleteEnterprise = async (id: string) => {
  if (!id) {
    throw new Error("No data provided");
  }
  const existingEnterprise = await findEnterpriseById(id);
  if (!existingEnterprise) {
    throw new Error("Enterprise not found");
  }
  try {
    const deletedEnterprise = await prisma.$transaction(async (tx) => {
      await tx.festival.updateMany({
        where: { empresa: id },
        data: {
          estado: "Cancelado",
          empresa: undefined,
        },
      });

      const deleted = await tx.empresa.delete({
        where: { id: id },
      });

      return deleted;
    });

    return deletedEnterprise;
  } catch (error) {
    console.error("Error deleting enterprise:", error);
    throw new Error(
      error instanceof Error
        ? `No se pudo eliminar la empresa: ${error.message}`
        : "Failed to delete enterprise",
    );
  }
};

const restrictEnterprise = async (id: string, status: boolean) => {
  try {
    const updatedEnterprise = await prisma.empresa.update({
      where: { id },
      data: { restringida: status },
    });
    return updatedEnterprise;
  } catch (error) {
    console.error("Error restricting enterprise:", error);
    throw new Error("Failed to restrict enterprise");
  }
};

const verifyEnterprise = async (id: string, status: boolean) => {
  try {
    const updatedEnterprise = await prisma.empresa.update({
      where: { id },
      data: { verificada: status },
    });
    return updatedEnterprise;
  } catch (error) {
    console.error("Error verifying enterprise:", error);
    throw new Error("Failed to verify enterprise");
  }
};

export const enterpriseService = {
  findAllEnterprises,
  findEnterpriseById,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
  restrictEnterprise,
  verifyEnterprise,
  getCompleteDashboard,
};
