import jwt, { type JwtPayload } from "jsonwebtoken";

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
