import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../database";
import { sendError } from "../response";

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

export default async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    return sendError(res, 400, "Authorization header is required");
  }
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const jwtPayload = verifyToken(token);
    res.locals.user = await User.findById(jwtPayload.userId);
    return next();
  } catch (err) {
    sendError(res, 401, "Authentification failed");
    return next(err);
  }
}
