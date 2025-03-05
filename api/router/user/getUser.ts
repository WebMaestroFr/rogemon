import { type NextFunction, type Request, type Response } from 'express'

import User from '@api/models/user'
import { sendData, sendError } from '@api/utilities/sendResponse'

export default async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      return sendData(res, 200, user)
    }
    return sendError(res, 404, 'User not found')
  } catch (err) {
    next(err)
  }
}
