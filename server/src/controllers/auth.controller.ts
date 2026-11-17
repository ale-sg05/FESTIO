import type { Request, Response } from "express";
import { authService } from "../services/auth.service";

const signInAdmin = async (req: Request, res: Response) => {
  if (!req.body)
    return res
      .status(400)
      .json({ message: "Datos de inicio de sesión requeridos" });
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Email y contraseña requeridos" });
  const { email, password } = req.body;

  const result = await authService.admin.signIn(email, password);

  if (result.error)
    return res
      .status(result.error.code)
      .json({ message: result.error.message });

  return res.status(200).json(result);
};

const signInEmpresa = async (req: Request, res: Response) => {
  if (!req.body)
    return res
      .status(400)
      .json({ message: "Datos de inicio de sesión requeridos" });
  if (!req.body.cif || !req.body.password)
    return res.status(400).json({ message: "CIF y contraseña requeridos" });
  const { cif, password } = req.body;

  const result = await authService.empresa.signIn(cif, password);

  if (result.error)
    return res
      .status(result.error.code)
      .json({ message: result.error.message });

  return res.status(200).json(result);
};

const signInCliente = async (req: Request, res: Response) => {
  if (!req.body)
    return res
      .status(400)
      .json({ message: "Datos de inicio de sesión requeridos" });
  if (!req.body.correo || !req.body.contraseña)
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  const { correo, contraseña } = req.body;

  const result = await authService.cliente.signIn(correo, contraseña);

  if (result.error)
    return res
      .status(result.error.code)
      .json({ message: result.error.message });

  return res.status(200).json(result);
};

export const authController = {
  admin: { signIn: signInAdmin },
  empresa: { signIn: signInEmpresa },
  cliente: { signIn: signInCliente },
};
