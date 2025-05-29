import { NextFunction, Request, Response } from 'express'
import User from '@api/models/user'
import { sendData } from '@api/utilities/sendResponse'

export function getUsername(email: string) {
  return email.substring(0, email.indexOf('@'))
}

export default async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const allUsers = await User.find({})
    const usernames = allUsers.map((u) => getUsername(u.email))
    return sendData(res, 200, usernames)
  } catch (err) {
    next(err)
  }
}
