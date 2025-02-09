import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../database/models/user";

if (!process.env.JWT_SECRET) {
  throw new Error("The JWT_SECRET environment variable is undefined");
}

export const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload extends JwtPayload {
  userId: string;
}

export function signToken(payload: UserPayload) {
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}

export default function useAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    res.status(401);
    return next("Authorization header is required");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const jwtPayload = verifyToken(token);
    res.locals.user = User.findById(jwtPayload.userId);
  } catch {
    res.status(401);
    return next("Authentification failed");
  }
  next();
}
