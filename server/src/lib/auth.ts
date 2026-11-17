import { Strategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import { prisma } from "./prisma";
import { Request, Response, NextFunction } from "express";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "mi_clave_super_secreta",
};

// ── Tipos para el payload del JWT ──────────────────────────────────────────

export type AdminPayload = { sub: "admin"; role: "admin" };
export type EmpresaPayload = {
  sub: string;
  role: "empresa";
  id: string;
  cif: string;
  razonSocial: string;
  restringida: boolean;
  verificada: boolean;
};
export type ClientePayload = {
  sub: string;
  id: string;
  role: "cliente";
  correo: string;
};

export type JWTPayload = AdminPayload | EmpresaPayload | ClientePayload;

// ── Estrategia única con dispatch por rol ──────────────────────────────────

export const JWTStrategy = new Strategy(
  options,
  async (payload: JWTPayload, done) => {
    try {
      // 1. Administrador: credenciales en variables de entorno, sin BD
      if (payload.role === "admin") {
        // El payload solo es válido si fue firmado con el secreto correcto,
        // así que basta con confirmar que el rol existe.
        return done(null, { role: "admin" });
      }

      // 2. Empresa
      if (payload.role === "empresa") {
        const empresa = await prisma.empresa.findUnique({
          where: { cif: payload.cif },
          select: {
            id: true,
            cif: true,
            persona: true,
            correo: true,
            verificada: true,
            restringida: true,
          },
        });

        if (!empresa) return done(null, false);

        return done(null, { role: "empresa", ...empresa });
      }

      if (payload.role === "cliente") {
        const cliente = await prisma.cliente.findUnique({
          where: { correo: payload.correo },
          select: {
            id: true,
            correo: true,
            nombre: true,
            apellidos: true,
            dni: true,
          },
        });

        if (!cliente) return done(null, false);

        return done(null, { role: "cliente", ...cliente });
      }

      // Rol desconocido
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  },
);

export type AppRole = "admin" | "empresa" | "cliente";

export const authorize = (allowedRoles: AppRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as JWTPayload | undefined;

    if (!user || !allowedRoles.includes(user.role)) {
      res
        .status(403)
        .json({ error: "No tienes permiso para acceder a este endpoint" });
      return;
    }

    next();
  };
};

export const isEnterpriseOwner = (
  user: JWTPayload,
  ownerId: string,
): boolean => {
  if (user.role === "admin") return true;
  if (user.role === "empresa") return user.id === ownerId;
  return false;
};

export const isClientOwner = (
  user: JWTPayload,
  ownerCorreo: string,
): boolean => {
  if (user.role === "admin") return true;
  if (user.role === "cliente") return user.correo === ownerCorreo;
  return false;
};
