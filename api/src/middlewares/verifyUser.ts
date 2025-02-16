import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import _ from "lodash";

import { User } from "../database";
import { IUser } from "../database/schemas/user";

if (!process.env.JWT_SECRET) {
  throw new Error("The JWT_SECRET environment variable is undefined");
}

export const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: UserPayload) {
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}

export default async function verifyUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const jwtPayload = verifyToken(token);
      req.user = await User.findById(jwtPayload.userId);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

export function assertUser(
  req: Request
): asserts req is Request & { user: IUser } {
  if (!req.user) {
    throw "User is not authenticated";
  }
}
