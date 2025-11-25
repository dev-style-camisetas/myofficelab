import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any; // vamos inserir o payload aqui
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;

  if (!hdr || !hdr.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }

  const token = hdr.substring(7); // remove "Bearer "

  try {
    const payload = verifyAccess(token);

    if (!payload) {
      return res.status(401).json({ error: "invalid token" });
    }

    // SALVA O PAYLOAD NO REQUEST ✔
    req.user = payload;

    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "invalid or expired token" });
  }
}
