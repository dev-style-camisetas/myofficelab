import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prismaClient } from "../prisma/prisma";
import { signAccessToken, signRefreshToken, verifyRefresh, type JwtPayload  } from "../utils/jwt";
 

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(String(password), saltRounds);

    const user = await prismaClient.user.create({
      data: { email, password: hashedPassword, name },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prismaClient.token.create({
      data: {
        token: refreshToken,
        type: "refresh",
        userId: user.id,
        revoked: false,
        expiresAt,
      },
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const refresh = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken é obrigatório" });
  }

  try {
    const stored = await prismaClient.token.findFirst({
      where: { token: refreshToken, type: "refresh" },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "invalid refresh token" });
    }

    const payload = verifyRefresh(refreshToken) as JwtPayload & {
      id: number;
      email: string;
      name: string | null;
    };

    const accessToken = signAccessToken({
      userId: payload.id,
      email: payload.email,
      name: payload.name,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return res.status(401).json({ error: "invalid refresh token" });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken é obrigatório" });
  }

  try {
    const storedRefreshToken = await prismaClient.token.findFirst({
      where: { token: refreshToken },
    });

    if (
      !storedRefreshToken ||
      storedRefreshToken.revoked ||
      storedRefreshToken.expiresAt < new Date()
    ) {
      return res.status(401).json({ error: "invalid refresh token" });
    }

    await prismaClient.token.update({
      where: { id: storedRefreshToken.id },
      data: { revoked: true },
    });

    return res.status(200).json("Usuário deslogado!");
  } catch (error) {
    console.error("Erro no logout:", error);
    return res.status(400).json(error);
  }
};
