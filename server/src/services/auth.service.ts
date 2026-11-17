import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AdminPayload, EmpresaPayload, ClientePayload } from "../lib/auth";

import { type SignUpClienteDto, type SignUpEmpresaDto } from "../dtos/auth.dto";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES = "8h";

const missingFields = (...fields: string[]) => fields.some((f) => !f?.trim());

const signInAdmin = async (email: string, password: string) => {
  if (missingFields(email, password))
    return { error: { code: 400, message: "Email y contraseña requeridos" } };

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return {
      error: { code: 401, message: "Credenciales de administrador inválidas" },
    };
  }

  const payload: AdminPayload = { sub: "admin", role: "admin" };
  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES });

  return { user: { role: "admin" }, token };
};

const signInEmpresa = async (cif: string, password: string) => {
  if (missingFields(cif, password))
    return { error: { code: 400, message: "CIF y contraseña requeridos" } };

  try {
    const empresa = await prisma.empresa.findFirst({
      where: { cif: cif },
    });

    if (!empresa)
      return { error: { code: 404, message: "Empresa no encontrada" } };

    const valid = await bcrypt.compare(password, empresa.contraseña);
    if (!valid)
      return { error: { code: 401, message: "Contraseña incorrecta" } };
    const payload: EmpresaPayload = {
      sub: empresa.cif,
      role: "empresa",
      cif: empresa.cif,
      razonSocial: empresa.razon_social,
      restringida: empresa.restringida,
      verificada: empresa.verificada,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES });

    return {
      user: {
        id: empresa.id,
        cif: empresa.cif,
        correo: empresa.correo,
        razonSocial: empresa.razon_social,
        role: "empresa",
        restringida: empresa.restringida,
        verificada: empresa.verificada,
      },
      token,
    };
  } catch (error) {
    console.error("signInEmpresa:", error);
    return { error: { code: 500, message: "Error en el inicio de sesión" } };
  }
};

const signInCliente = async (correo: string, password: string) => {
  if (missingFields(correo, password))
    return { error: { code: 400, message: "Correo y contraseña requeridos" } };

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { correo: correo },
    });

    if (!cliente)
      return { error: { code: 404, message: "Cliente no encontrado" } };

    const valid = await bcrypt.compare(password, cliente.contraseña);
    if (!valid)
      return { error: { code: 401, message: "Contraseña incorrecta" } };

    const payload: ClientePayload = {
      sub: cliente.correo,
      role: "cliente",
      correo: cliente.correo,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES });

    return {
      user: { correo: cliente.correo, nombre: cliente.nombre, role: "cliente" },
      token,
    };
  } catch (error) {
    console.error("signInCliente:", error);
    return { error: { code: 500, message: "Error en el inicio de sesión" } };
  }
};

export const authService = {
  admin: { signIn: signInAdmin },
  empresa: { signIn: signInEmpresa },
  cliente: { signIn: signInCliente },
};
