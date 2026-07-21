import jwt from 'jsonwebtoken'
import type { IUserPayload } from '../../env'

if (!process.env.JWT_SECRET) {
  throw new Error('The JWT_SECRET environment variable is undefined')
}

export const JWT_SECRET = process.env.JWT_SECRET

export function signToken(payload: IUserPayload) {
  return jwt.sign(payload, JWT_SECRET)
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as IUserPayload
}
