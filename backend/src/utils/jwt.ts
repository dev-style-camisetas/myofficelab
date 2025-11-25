import jwt from "jsonwebtoken";
import { env } from "../env";

export type JwtPayload = string | Buffer | object;

export function signAccessToken(payload:JwtPayload) {  
  return jwt.sign(payload, env.accessSecret, { expiresIn: Number(env.accessTtl) });
}
export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: Number(env.refreshTtl) });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, env.accessSecret) as JwtPayload & jwt.JwtPayload;
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, env.refreshSecret) as JwtPayload & jwt.JwtPayload;
}